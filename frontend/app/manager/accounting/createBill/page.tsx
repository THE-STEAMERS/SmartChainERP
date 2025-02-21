'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";
import { Bill } from '../types';

interface BillFormData {
  vendor: string;
  billNumber: string;
  amount: number;
  dueDate: string;
}

export default function CreateBill() {
  const router = useRouter();
  const [formData, setFormData] = useState<BillFormData>({
    vendor: '',
    billNumber: '',
    amount: 0,
    dueDate: ''
  });
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add bill creation logic here
    setNotification('Bill created successfully');
    setTimeout(() => {
      router.push('/manager/accounting/vendorBills');
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {notification && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{notification}</AlertDescription>
        </Alert>
      )}

      <Button 
        variant="outline" 
        onClick={() => router.push('/manager/accounting')}
        className="mb-6"
      >
        <FileText className="mr-2 h-4 w-4" />
        Back
      </Button>

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
}