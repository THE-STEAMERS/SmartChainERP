import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UndeliverableOrder } from "./types";

interface UndeliverableOrdersProps {
  orders: UndeliverableOrder[];
}

export const UndeliverableOrders = ({ orders }: UndeliverableOrdersProps) => {
  return (
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
              {orders.map((order) => (
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
  );
};
