"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio_group";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { BadgeCheck, XCircle, AlertCircle, Check } from "lucide-react";

interface DeliveryOrder {
  orderId: string;
  orderName: string;
  phoneNumber: string;
  address: string;
  isDelivered: boolean;
  isCancelled?: boolean;
  cancellationReason?: string;
  items?: string[];
}

interface UndeliverableOrder {
  orderId: string;
  name: string;
  phone: string;
}

const DeliveryDashboard = () => {
  const [mounted, setMounted] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [selectedReason, setSelectedReason] = React.useState("");
  const [orders, setOrders] = React.useState<DeliveryOrder[]>([
    {
      orderId: "ORD-001",
      orderName: "John Smith",
      phoneNumber: "555-0123",
      address: "123 Main St, City, State",
      isDelivered: false,
      items: ["Laptop", "Mouse"]
    },
    {
      orderId: "ORD-002",
      orderName: "Jane Doe",
      phoneNumber: "555-0124",
      address: "456 Oak Ave, City, State",
      isDelivered: true,
      items: ["Monitor", "Keyboard", "Headphones"]
    },
    {
      orderId: "ORD-003",
      orderName: "Mike Johnson",
      phoneNumber: "555-0125",
      address: "789 Pine Rd, City, State",
      isDelivered: false,
      items: ["Smartphone", "Case", "Charger"]
    },
    {
      orderId: "ORD-004",
      orderName: "Sarah Wilson",
      phoneNumber: "555-0126",
      address: "321 Elm St, City, State",
      isDelivered: false,
      items: ["Tablet", "Stylus"]
    },
    {
      orderId: "ORD-005",
      orderName: "Robert Brown",
      phoneNumber: "555-0127",
      address: "654 Maple Dr, City, State",
      isDelivered: true,
      items: ["Printer", "Paper", "Ink"]
    }
  ]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const undeliverableOrders: UndeliverableOrder[] = [
    {
      orderId: "ORD-006",
      name: "Alice Johnson",
      phone: "555-0128",
    },
    {
      orderId: "ORD-007",
      name: "Tom Davis",
      phone: "555-0129",
    }
  ];

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

  const getStatusColor = (order: DeliveryOrder) => {
    if (order.isCancelled) return "text-yellow-500";
    if (order.isDelivered) return "text-green-500";
    return "text-blue-500";
  };

  const getStatusIcon = (order: DeliveryOrder) => {
    if (order.isCancelled) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    if (order.isDelivered) return <BadgeCheck className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-blue-500" />;
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Cancel Order Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup 
              value={selectedReason} 
              onValueChange={setSelectedReason}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <RadioGroupItem value="customer_choice" id="customer_choice" className="border-white">
                  {selectedReason === "customer_choice" && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </RadioGroupItem>
                <Label htmlFor="customer_choice" className="text-white cursor-pointer">Customer Choice</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <RadioGroupItem value="other_incident" id="other_incident" className="border-white">
                  {selectedReason === "other_incident" && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </RadioGroupItem>
                <Label htmlFor="other_incident" className="text-white cursor-pointer">Other Incident</Label>
              </div>
            </RadioGroup>
            <div className="mt-6">
              <Button 
                onClick={handleCancelOrder}
                disabled={!selectedReason}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Orders Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Today's Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 font-medium text-slate-300">Status</th>
                  <th className="text-left p-4 font-medium text-slate-300">Order ID</th>
                  <th className="text-left p-4 font-medium text-slate-300">Order Name</th>
                  <th className="text-left p-4 font-medium text-slate-300">Phone Number</th>
                  <th className="text-left p-4 font-medium text-slate-300">Address</th>
                  <th className="text-left p-4 font-medium text-slate-300">Items</th>
                  <th className="text-left p-4 font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} className={`border-b border-slate-700 ${order.isCancelled ? 'bg-slate-800/50' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order)}
                        <span className={`${getStatusColor(order)} text-sm font-medium`}>
                          {order.isCancelled ? 'Cancelled' : order.isDelivered ? 'Delivered' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{order.orderId}</td>
                    <td className="p-4 text-slate-300">{order.orderName}</td>
                    <td className="p-4 text-slate-300">{order.phoneNumber}</td>
                    <td className="p-4 text-slate-300">{order.address}</td>
                    <td className="p-4 text-slate-300">
                      {order.items?.join(", ")}
                    </td>
                    <td className="p-4">
                      {!order.isCancelled && !order.isDelivered && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleCancelClick(order.orderId)}
                        >
                          Cancel Order
                        </Button>
                      )}
                      {order.isDelivered && (
                        <span className="text-sm text-green-500">
                          Cannot be cancelled
                        </span>
                      )}
                      {order.isCancelled && (
                        <span className="text-sm text-slate-400">
                          Reason: {order.cancellationReason === 'customer_choice' ? 'Customer Choice' : 'Other Incident'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Undeliverable Orders */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Cannot be delivered today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 font-medium text-slate-300">Order ID</th>
                    <th className="text-left p-4 font-medium text-slate-300">Name</th>
                    <th className="text-left p-4 font-medium text-slate-300">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {undeliverableOrders.map((order) => (
                    <tr key={order.orderId} className="border-b border-slate-700">
                      <td className="p-4 text-slate-300">{order.orderId}</td>
                      <td className="p-4 text-slate-300">{order.name}</td>
                      <td className="p-4 text-slate-300">{order.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Status with Pie Chart */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            {mounted && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calculatePieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {calculatePieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-slate-300">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <div className="text-sm text-slate-400">
                Total Orders: {orders.length + undeliverableOrders.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryDashboard;