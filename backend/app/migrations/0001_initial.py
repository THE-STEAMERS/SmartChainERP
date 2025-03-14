# Generated by Django 5.1.5 on 2025-02-13 18:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('category_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('employee_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('contact', models.CharField(max_length=20)),
                ('shipment_priority', models.IntegerField(help_text='Lower value indicates higher priority')),
            ],
        ),
        migrations.CreateModel(
            name='Retailer',
            fields=[
                ('retailer_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('address', models.TextField()),
                ('contact', models.CharField(max_length=20)),
                ('distance_from_warehouse', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Truck',
            fields=[
                ('truck_id', models.AutoField(primary_key=True, serialize=False)),
                ('license_plate', models.CharField(max_length=20, unique=True)),
                ('capacity', models.PositiveIntegerField(help_text='Maximum shipment capacity')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('product_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('available_quantity', models.PositiveIntegerField()),
                ('total_shipped', models.PositiveIntegerField(default=0)),
                ('total_required_quantity', models.PositiveIntegerField(default=0)),
                ('status', models.CharField(choices=[('on_demand', 'On Demand'), ('sufficient', 'Sufficient')], default='sufficient', max_length=20)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.category')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('order_id', models.AutoField(primary_key=True, serialize=False)),
                ('required_qty', models.PositiveIntegerField()),
                ('order_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('allocated', 'Allocated'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.product')),
            ],
        ),
        migrations.CreateModel(
            name='Shipment',
            fields=[
                ('shipment_id', models.AutoField(primary_key=True, serialize=False)),
                ('shipment_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('in_transit', 'In Transit'), ('delivered', 'Delivered'), ('failed', 'Failed')], default='in_transit', max_length=20)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.employee')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.order')),
                ('truck', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.truck')),
            ],
        ),
        migrations.AddField(
            model_name='employee',
            name='truck',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='app.truck'),
        ),
        migrations.CreateModel(
            name='RetailerOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('allocated', 'Allocated'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.order')),
                ('retailer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.retailer')),
            ],
            options={
                'unique_together': {('retailer', 'order')},
            },
        ),
    ]
