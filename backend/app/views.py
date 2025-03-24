import json
import logging
from django.db import transaction
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count
from .models import Employee, Retailer, Order, Truck, Shipment, Product, Category
from .serializers import (
    EmployeeSerializer, RetailerSerializer, 
    OrderSerializer, ProductSerializer, TruckSerializer, ShipmentSerializer, CategorySerializer
)
from .allocation import allocate_shipments
from django.db.models import F
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.http import JsonResponse
from .permissions import IsEmployeeUser
from django.contrib.admin.models import LogEntry;

# ✅ Custom Pagination Class
class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

# ✅ Custom JWT Login View
class CustomAuthToken(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = request.user
        return Response(
            {
                "access": response.data["access"],
                "refresh": response.data["refresh"],
                "user_id": user.id,
                "username": user.username,
            },
            status=status.HTTP_200_OK,
        )


# ✅ Logout View (Blacklist Refresh Token)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ✅ Get Employees (Admin Only)
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_employees(request):
    try:
        employees = Employee.objects.all()
        paginator = StandardPagination()
        paginated_employees = paginator.paginate_queryset(employees, request)
        serializer = EmployeeSerializer(paginated_employees, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ Get Retailers (Admin Only)
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_retailers(request):
    try:
        retailers = Retailer.objects.all()
        paginator = StandardPagination()
        paginated_retailers = paginator.paginate_queryset(retailers, request)
        serializer = RetailerSerializer(paginated_retailers, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ Get Orders (Anyone Logged In)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_orders(request):
    try:
        status_filter = request.GET.get("status")
        orders = Order.objects.all().order_by("-order_date")

        if status_filter:
            orders = orders.filter(status=status_filter)

        paginator = StandardPagination()
        paginated_orders = paginator.paginate_queryset(orders, request)
        serializer = OrderSerializer(paginated_orders, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ Get Trucks (Admin Only)
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_trucks(request):
    try:
        trucks = Truck.objects.all()
        paginator = StandardPagination()
        paginated_trucks = paginator.paginate_queryset(trucks, request)
        serializer = TruckSerializer(paginated_trucks, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ Get Shipments (Anyone Logged In)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_shipments(request):
    try:
        shipments = Shipment.objects.all().order_by("-shipment_date")  # Fix applied here
        paginator = StandardPagination()
        paginated_shipments = paginator.paginate_queryset(shipments, request)
        serializer = ShipmentSerializer(paginated_shipments, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([IsAuthenticated])  
def allocate_orders(request):
    try:
        with transaction.atomic():
            allocation_result = allocate_shipments(request)

            if isinstance(allocation_result, Response):
                return allocation_result

            # ✅ Ensure all product statuses are updated
            products = Product.objects.all()
            for product in products:
                product.save()  # This will call update_status() before saving

        return Response(
            {"message": "Orders allocated and stock status updated successfully"},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ Get Stock Data (Admin Only)
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_stock_data(request):
    if not request.user.is_staff:
        return Response({"detail": "Access denied. Admins only."}, status=status.HTTP_403_FORBIDDEN)

    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# ✅ Get Category Stock Data (Accessible by Anyone)
@api_view(["GET"])
def category_stock_data(request):
    """
    Returns category names and product count for visualization.
    """
    try:
        categories = Category.objects.annotate(product_count=Count('products'))  # ✅ Count products per category

        # Serialize the data
        serialized_data = CategorySerializer(categories, many=True).data

        # Attach product_count to each category in serialized data
        for category in serialized_data:
            category["value"] = next(
                (cat["product_count"] for cat in categories.values("name", "product_count") if cat["name"] == category["name"]),
                0
            )

        return Response({"success": True, "data": serialized_data})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAdminUser])  # Restrict access to admin only
def store_qr_code(request):
    """API to process and store QR code data into the Product model (Admin Only)"""
    try:
        if not request.user.is_staff:  # Double-check admin access
            return Response({"error": "Permission denied. Admins only."}, status=403)

        qr_data = request.data.get("qr_text", "")  # Get the QR code text

        # Example QR Code Data Format: "name=Camera|category=Electronics|quantity=10"
        data_dict = dict(item.split("=") for item in qr_data.split("|"))

        product_name = data_dict.get("name")
        category_name = data_dict.get("category")
        quantity = int(data_dict.get("quantity", 0))

        if not product_name or not category_name or quantity <= 0:
            return Response({"error": "Invalid QR Code data"}, status=400)

        # Fetch or create the category
        category, _ = Category.objects.get_or_create(name=category_name)

        # Fetch existing product or create a new one
        product, created = Product.objects.get_or_create(
            name=product_name, category=category,
            defaults={"available_quantity": 0}  # Ensure no NULL values
        )

        if created:
            product.available_quantity = quantity  # Set quantity for new product
        else:
            # Update quantity safely using F() expression
            Product.objects.filter(product_id=product.product_id).update(
                available_quantity=F('available_quantity') + quantity
            )
            product.refresh_from_db()  # Fetch updated values from DB

        product.save()  # Save to trigger signals

        return Response({"message": "Product updated successfully"}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_counts(request):
    try:
        order_count = Order.objects.count()
        pending_order_count = Order.objects.filter(status="pending").count()
        employee_count = Employee.objects.count()
        retailer_count = Retailer.objects.count()

        return Response(
            {
                "orders_placed": order_count,
                "pending_orders": pending_order_count,
                "employees_available": employee_count,
                "retailers_available": retailer_count,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_users(request):
    """Fetch all users along with their assigned group(s) and return as JSON."""
    users = User.objects.prefetch_related('groups').values('id', 'username', 'email', 'is_staff', 'groups__name')

    # Organize users with their groups
    user_dict = {}
    for user in users:
        user_id = user["id"]
        if user_id not in user_dict:
            user_dict[user_id] = {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "is_staff": user["is_staff"],
                "groups": []
            }
        if user["groups__name"]:
            user_dict[user_id]["groups"].append(user["groups__name"])

    return Response(list(user_dict.values()))

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure user is authenticated
def get_logged_in_user(request):
    """Fetch details of the currently authenticated user."""
    user = request.user  # Get the logged-in user

    # Get user details along with group(s)
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_staff": user.is_staff,
        "groups": list(user.groups.values_list("name", flat=True))
    }
    
    return Response(user_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsEmployeeUser])
def get_employee_shipments(request):
    """Fetch shipments assigned to the logged-in employee."""
    
    # Get the logged-in user's username
    username = request.user.username  

    # Fetch shipments where the employee's user has the same username
    shipments = Shipment.objects.filter(employee__user__username=username)  

    # Serialize the data
    serializer = ShipmentSerializer(shipments, many=True)  

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated,IsEmployeeUser])
def update_shipment_status(request):
    """Allow an employee to update the status of their assigned shipment."""

    # Get the logged-in user's username
    username = request.user.username  

    # Extract data from the request
    shipment_id = request.data.get('shipment_id')
    new_status = request.data.get('status')

    # Validate request data
    if not shipment_id or not new_status:
        return Response({"error": "shipment_id and status are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Validate status choices
    valid_statuses = ['in_transit', 'delivered', 'failed']
    if new_status not in valid_statuses:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    # Find the shipment assigned to this employee
    try:
        shipment = Shipment.objects.get(shipment_id=shipment_id, employee__user__username=username)
    except Shipment.DoesNotExist:
        return Response({"error": "Shipment not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

    # Update shipment status
    shipment.status = new_status
    shipment.save()

    return Response({"message": "Shipment status updated successfully"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsEmployeeUser])
def get_employee_orders(request):
    """
    Fetch order details for shipments assigned to the logged-in employee.
    """

    # Get the logged-in user
    user = request.user  

    # Find shipments assigned to this employee
    shipments = Shipment.objects.filter(employee__user=user)

    # Extract order details for those shipments
    orders = [shipment.order for shipment in shipments]  

    # Serialize the data
    serializer = OrderSerializer(orders, many=True)  

    return Response(serializer.data)

def redirect_view(request):
    return redirect('/admin/')


@api_view(['GET'])
@permission_classes([IsAuthenticated,IsEmployeeUser])
def get_employee_id(request):
    user = request.user  

    try:
        employee = Employee.objects.get(user=user)  # Get employee linked to logged-in user
        return Response({"employee_id": employee.employee_id})  # ✅ Use employee_id instead of id
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def recent_actions(request):
    # Fetch the last 10 actions performed in the admin panel
    actions = LogEntry.objects.select_related('content_type', 'user').order_by('-action_time')[:10]

    # Prepare JSON response
    recent_actions_list = [
        {
            'time': action.action_time,
            'user': action.user.username,
            'content_type': action.content_type.model,
            'object_id': action.object_id,
            'object_repr': action.object_repr,
            'action_flag': action.get_action_flag_display(),
        }
        for action in actions
    ]

    return Response({'recent_actions': recent_actions_list})