"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, UserPlus, FileInput, Building2, Settings, CreditCard, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";

type PageType = 'main' | 'new-bill' | 'new-customer' | 'invoices' | 'vendor-bills' | 'configure' | 'payments';
type Status = 'Paid' | 'Pending' | 'Overdue';

interface Bill {
  id: number;
  vendor: string;
  billNumber: string;
  amount: number;
  dueDate: string;
  status: Status;
  createdAt: string;
}

interface BillFormData {
  vendor: string;
  billNumber: string;
  amount: number;
  dueDate: string;
}

interface PageProps {
  onBack: () => void;
}

interface MainDashboardProps {
  onNavigate: (page: PageType) => void;
}

const NavigationMenu = ({ onNavigate }: { onNavigate: (page: PageType) => void }) => {
  const menuItems = [
    { icon: <FileText className="w-6 h-6" />, title: "Create New Bill", page: 'new-bill' as PageType },
    { icon: <UserPlus className="w-6 h-6" />, title: "Add New Customer", page: 'new-customer' as PageType },
    { icon: <FileInput className="w-6 h-6" />, title: "Customer Invoices", page: 'invoices' as PageType },
    { icon: <Building2 className="w-6 h-6" />, title: "Vendor Bills", page: 'vendor-bills' as PageType },
    { icon: <Settings className="w-6 h-6" />, title: "Configure Documents", page: 'configure' as PageType },
    { icon: <CreditCard className="w-6 h-6" />, title: "Track Payment", page: 'payments' as PageType },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {menuItems.map((item) => (
        <button
          key={item.page}
          onClick={() => onNavigate(item.page)}
          className="flex flex-col items-center justify-center p-8 bg-[#1E293B] rounded-lg border border-blue-500/20 hover:bg-blue-900/20 transition-colors duration-200 group"
        >
          <div className="text-blue-400 mb-3 transform group-hover:scale-110 transition-transform duration-200">
            {item.icon}
          </div>
          <span className="text-white text-sm font-medium">{item.title}</span>
        </button>
      ))}
    </div>
  );
};

const BackButton = ({ onBack }: { onBack: () => void }) => (
  <Button 
    variant="ghost" 
    onClick={onBack} 
    className="mb-6 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
  >
    <FileText className="w-4 h-4 mr-2" />
    Back
  </Button>
);

const Accounting = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const [bills, setBills] = useState<Bill[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const addBill = (bill: Omit<Bill, 'id' | 'status' | 'createdAt'>) => {
    const newBill: Bill = {
      ...bill,
      id: bills.length + 1,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBills([...bills, newBill]);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('main');
  };

  const handleBillSuccess = () => {
    showNotification('Bill created successfully');
    setCurrentPage('vendor-bills');
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-[#0F172A]">
      {notification && (
        <Alert className="mb-6 bg-green-500/20 border-green-500 text-green-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{notification}</AlertDescription>
        </Alert>
      )}

      {currentPage === 'main' && (
        <div className="space-y-8">
          <MainDashboard onNavigate={handleNavigate} />
          <NavigationMenu onNavigate={handleNavigate} />
        </div>
      )}
      {currentPage === 'vendor-bills' && <VendorBills onBack={handleBack} bills={bills} onNewBill={() => setCurrentPage('new-bill')} />}
      {currentPage === 'new-bill' && <NewBill onBack={handleBack} onSuccess={handleBillSuccess} addBill={addBill} />}
    </div>
  );
};

const MainDashboard = ({ onNavigate }: MainDashboardProps) => {
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

const VendorBills = ({ onBack, bills, onNewBill }: { onBack: () => void; bills: Bill[]; onNewBill: () => void }) => {
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

const NewBill = ({ onBack, onSuccess, addBill }: { onBack: () => void; onSuccess: () => void; addBill: (bill: Omit<Bill, 'id' | 'status' | 'createdAt'>) => void }) => {
  const [formData, setFormData] = useState<BillFormData>({
    vendor: '',
    billNumber: '',
    amount: 0,
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBill(formData);
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-[#1E293B] border-0">
          <CardHeader>
            <CardTitle className="text-xl text-blue-400">Create New Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="vendor" className="text-white">Vendor Name</Label>
                <Input 
                  id="vendor" 
                  className="bg-[#0F172A] border-blue-500 text-white"
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billNumber" className="text-white">Bill Number</Label>
                <Input 
                  id="billNumber" 
                  className="bg-[#0F172A] border-blue-500 text-white"
                  value={formData.billNumber}
                  onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  className="bg-[#0F172A] border-blue-500 text-white"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-white">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  className="bg-[#0F172A] border-blue-500 text-white"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  required
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Create Bill
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-0">
          <CardHeader>
            <CardTitle className="text-xl text-blue-400">Bill Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-[#0F172A] rounded-lg text-white space-y-4">
              <div className="text-2xl font-bold mb-6">BILL</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-blue-400 text-sm">Vendor</div>
                  <div className="font-medium">{formData.vendor || 'Not specified'}</div>
                  </div>
                <div>
                  <div className="text-blue-400 text-sm">Bill Number</div>
                  <div className="font-medium">{formData.billNumber || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-blue-400 text-sm">Amount</div>
                  <div className="font-medium">${formData.amount.toLocaleString() || '0.00'}</div>
                </div>
                <div>
                  <div className="text-blue-400 text-sm">Due Date</div>
                  <div className="font-medium">{formData.dueDate || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accounting;