import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { BackButton } from "./BackButton";
import { Bill } from "./Accounting";

interface VendorBillsProps {
  onBack: () => void;
  bills: Bill[];
  onNewBill: () => void;
}

export const VendorBills = ({ onBack, bills, onNewBill }: VendorBillsProps) => {
  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      <Card className="bg-[#1E293B] border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-blue-400">Vendor Bills</CardTitle>
          <Button onClick={onNewBill} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            New Bill
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto rounded-lg">
            <table className="w-full text-left">
              <thead className="text-blue-400 border-b border-blue-500">
                <tr>
                  <th scope="col" className="px-6 py-3">Bill ID</th>
                  <th scope="col" className="px-6 py-3">Vendor</th>
                  <th scope="col" className="px-6 py-3">Bill Number</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3">Due Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Created</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="border-b border-blue-500/20 hover:bg-blue-900/20 transition-colors">
                    <td className="px-6 py-4 text-white">#{bill.id}</td>
                    <td className="px-6 py-4 text-white">{bill.vendor}</td>
                    <td className="px-6 py-4 text-white">{bill.billNumber}</td>
                    <td className="px-6 py-4 text-white">${bill.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-white">{bill.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        bill.status === 'Paid' ? 'bg-green-500/20 text-green-400' :
                        bill.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">{bill.createdAt}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
                {bills.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                      No bills found. Click "New Bill" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};