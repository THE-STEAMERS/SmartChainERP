import logging
from django.db import transaction
from django.db.models import F
from rest_framework.response import Response
from .models import Order, Employee, Shipment, Product

logger = logging.getLogger(__name__)

def allocate_shipments(request):
    """
    Allocate shipments dynamically based on truck capacity, retailer distance, and product stock.
    """
    allocated_orders = []
    skipped_orders = []

    try:
        with transaction.atomic():
            # Fetch all pending orders with related product and retailer
            orders = Order.objects.filter(status='pending').select_related('product', 'retailer').order_by('order_date')

            # Get truck IDs currently in transit
            assigned_truck_ids = set(
                Shipment.objects.filter(status='in_transit').values_list('employee__truck__truck_id', flat=True)
            )

            # Get employees who have available trucks
            available_employees = Employee.objects.exclude(truck__truck_id__in=assigned_truck_ids).select_related('truck')

            if not available_employees.exists():
                return Response({"error": "No available employees with trucks"}, status=400)

            # Map truck capacities
            truck_capacity_map = {emp.truck.truck_id: emp.truck.capacity for emp in available_employees}

            for order in orders:
                product = order.product
                retailer = order.retailer

                if not product or not retailer:
                    skipped_orders.append({"order_id": order.order_id, "reason": "Invalid product or retailer"})
                    continue

                if product.available_quantity < order.required_qty:
                    skipped_orders.append({"order_id": order.order_id, "reason": "Insufficient stock"})

                    # ❌ Removed: No need to update total_required_quantity here (was causing double count)

                    # Refresh and update status
                    product.refresh_from_db()
                    product.update_status()
                    product.save(update_fields=['status'])

                    continue

                # Find an employee with a truck that has enough capacity
                employee = next(
                    (emp for emp in available_employees if truck_capacity_map.get(emp.truck.truck_id, 0) >= order.required_qty),
                    None
                )

                if not employee:
                    skipped_orders.append({"order_id": order.order_id, "reason": "No suitable truck available"})
                    continue

                truck = employee.truck  

                # Create a new shipment
                shipment = Shipment.objects.create(
                    order=order,
                    employee=employee,
                    status='in_transit'
                )

                # Log product details before update
                logger.info(f"Before update: Product {product.name} - Available: {product.available_quantity}, Required: {product.total_required_quantity}, Status: {product.status}")

                # Reduce available quantity
                Product.objects.filter(product_id=product.product_id).update(
                    available_quantity=F('available_quantity') - order.required_qty
                )

                # Refresh and update status
                product.refresh_from_db()
                product.update_status()
                product.save(update_fields=['status'])

                # Log product details after update
                logger.info(f"After update: Product {product.name} - Available: {product.available_quantity}, Required: {product.total_required_quantity}, Status: {product.status}")

                # Update truck capacity
                truck_capacity_map[truck.truck_id] -= order.required_qty

                # Mark order as allocated
                order.status = 'allocated'
                order.save()

                allocated_orders.append({
                    "order_id": order.order_id,
                    "shipment_id": shipment.shipment_id,
                    "status": "allocated"
                })

        return Response({"allocated_orders": allocated_orders, "skipped_orders": skipped_orders})

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return Response({"error": str(e)}, status=500)