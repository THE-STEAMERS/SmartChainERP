import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageType } from "./Accounting";

interface MainDashboardProps {
  onNavigate: (page: PageType) => void;
}

export const MainDashboard = ({ onNavigate }: MainDashboardProps) => {
  const stats = {
    totalInvoices: 45,
    pendingPayments: 12,
    totalRevenue: 68500
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-8">Accounting Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-400">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalInvoices}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-400">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.pendingPayments}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};