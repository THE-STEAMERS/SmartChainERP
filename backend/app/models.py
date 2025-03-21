from django.db import models
from django.contrib.auth.models import User
from django.db.models import Count
from decimal import Decimal


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    @classmethod
    def get_category_counts(cls):
        """
        Returns a queryset with categories and their respective product counts.
        """
        return cls.objects.annotate(product_count=Count('products'))


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    available_quantity = models.PositiveIntegerField()
    total_shipped = models.PositiveIntegerField(default=0)
    total_required_quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    STATUS_CHOICES = [
        ('on_demand', 'On Demand'),
        ('sufficient', 'Sufficient')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='sufficient')

    def update_status(self):
        """Update the status based on available and required quantity."""
        available = self.available_quantity if isinstance(self.available_quantity, int) else 0
        required = self.total_required_quantity if isinstance(self.total_required_quantity, int) else 0

        self.status = 'sufficient' if available > required else 'on_demand'

    def save(self, *args, **kwargs):
        self.update_status()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name



class Retailer(models.Model):
    retailer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.TextField()
    contact = models.CharField(max_length=20)
    distance_from_warehouse = models.FloatField()

    def __str__(self):
        return self.name


class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    required_qty = models.PositiveIntegerField()
    order_date = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('allocated', 'Allocated'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Order {self.order_id} - {self.product.name} - {self.retailer.name}"


class Truck(models.Model):
    truck_id = models.AutoField(primary_key=True)
    license_plate = models.CharField(max_length=20, unique=True)
    capacity = models.PositiveIntegerField(help_text="Maximum shipment capacity")
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.license_plate


class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)  # ✅ Ensuring ID is auto-generated
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="employee_profile", null=True)
    contact = models.CharField(max_length=20, default="Not Provided")
    truck = models.OneToOneField(Truck, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} (Truck: {self.truck.license_plate if self.truck else 'No Truck Assigned'})"


class Shipment(models.Model):
    shipment_id = models.AutoField(primary_key=True)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="shipment")
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="shipments")
    shipment_date = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_transit')

    def save(self, *args, **kwargs):
        """
        If shipment is marked as 'delivered', update:
        - The corresponding order's status to 'delivered'.
        - Reduce the product's total_required_quantity.
        - Increase the product's total_shipped.
        """
        if self.status == "delivered":
            order = self.order
            product = order.product

            # Update order status
            order.status = "delivered"
            order.save(update_fields=["status"])

            # Update product details
            product.total_required_quantity = max(0, product.total_required_quantity - order.required_qty)
            product.total_shipped += order.required_qty
            product.save(update_fields=["total_required_quantity", "total_shipped"])

        super().save(*args, **kwargs)

    def __str__(self):
        truck_license_plate = getattr(self.employee.truck, 'license_plate', 'No Truck Assigned')
        return f"Shipment {self.shipment_id} - {truck_license_plate}"
