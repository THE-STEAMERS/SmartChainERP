"use client";

import React from 'react';
import { OrdersTable } from '@/components/employee/OrdersTable';
import { UndeliverableOrders } from '@/components/employee/UndeliverableOrders';
import { DeliveryStatus } from '@/components/employee/DeliveryStatus';
import { CancelOrderDialog } from '@/components/employee/CancelOrderDialog';
import { DeliveryOrder, UndeliverableOrder } from '@/components/employee/types';

interface PageProps {
  params: {
    id: string;
  };
}

// Sample data generator based on employee ID
const generateOrdersForEmployee = (employeeId: string): DeliveryOrder[] => {
  return [
    {
      orderId: `ORD-${employeeId}-001`,
      orderName: "John Smith",
      phoneNumber: "555-0123",
      address: "123 Main St, City, State",
      isDelivered: false,
      items: ["Laptop", "Mouse"]
    },
    {
      orderId: `ORD-${employeeId}-002`,
      orderName: "Jane Doe",
      phoneNumber: "555-0124",
      address: "456 Oak St, City, State",
      isDelivered: true,
      items: ["Keyboard", "Monitor"]
    }
  ];
};

const generateUndeliverableOrdersForEmployee = (employeeId: string): UndeliverableOrder[] => {
  return [
    {
      orderId: `ORD-${employeeId}-006`,
      name: "Alice Johnson",
      phone: "555-0128",
    },
    {
      orderId: `ORD-${employeeId}-007`,
      name: "Tom Davis",
      phone: "555-0129",
    }
  ];
};

export default function EmployeePage({ params }: PageProps) {
  const [mounted, setMounted] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [selectedReason, setSelectedReason] = React.useState("");
  const [orders, setOrders] = React.useState<DeliveryOrder[]>(generateOrdersForEmployee(params.id));
  const [undeliverableOrders] = React.useState<UndeliverableOrder[]>(
    generateUndeliverableOrdersForEmployee(params.id)
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleCancelClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleCancelOrder = () => {
    if (selectedOrderId && selectedReason) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === selectedOrderId
            ? { ...order, isCancelled: true, cancellationReason: selectedReason }
            : order
        )
      );
      setDialogOpen(false);
      setSelectedOrderId(null);
      setSelectedReason("");
    }
  };

  const calculatePieChartData = React.useMemo(() => {
    const deliveredCount = orders.filter(order => order.isDelivered && !order.isCancelled).length;
    const notDeliveredCount = orders.filter(order => !order.isDelivered && !order.isCancelled).length;
    const cancelledCount = orders.filter(order => order.isCancelled).length;
    const undeliverableCount = undeliverableOrders.length;

    return [
      { name: 'Delivered', value: deliveredCount, color: '#22c55e' },
      { name: 'Pending', value: notDeliveredCount, color: '#3b82f6' },
      { name: 'Cancelled', value: cancelledCount, color: '#eab308' },
      { name: 'Undeliverable', value: undeliverableCount, color: '#94a3b8' }
    ];
  }, [orders, undeliverableOrders]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard - ID: {params.id}</h1>
      
      <CancelOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
        onConfirm={handleCancelOrder}
      />

      <OrdersTable
        orders={orders}
        onCancelClick={handleCancelClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UndeliverableOrders orders={undeliverableOrders} />
        {mounted && (
          <DeliveryStatus
            data={calculatePieChartData}
            totalOrders={orders.length + undeliverableOrders.length}
          />
        )}
      </div>
    </div>
  );
}