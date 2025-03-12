import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, XCircle, AlertCircle } from "lucide-react";
import { DeliveryOrder } from "./types";

interface OrdersTableProps {
  orders: DeliveryOrder[];
  onCancelClick: (orderId: string) => void;
}

export const OrdersTable = ({ orders, onCancelClick }: OrdersTableProps) => {
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

  return (
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
                        onClick={() => onCancelClick(order.orderId)}
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
  );
};