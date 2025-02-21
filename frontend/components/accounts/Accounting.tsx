import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { AlertCircle } from "lucide-react";
import { MainDashboard } from "./MainDashboard";
import { NavigationMenu } from "./NavigationMenu";
import { VendorBills } from "./VendorBills";
import { NewBill } from "./NewBill";

export type PageType = 'main' | 'new-bill' | 'new-customer' | 'invoices' | 'vendor-bills' | 'configure' | 'payments';
export type Status = 'Paid' | 'Pending' | 'Overdue';

export interface Bill {
  id: number;
  vendor: string;
  billNumber: string;
  amount: number;
  dueDate: string;
  status: Status;
  createdAt: string;
}

export const Accounting = () => {
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