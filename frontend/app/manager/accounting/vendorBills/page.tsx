'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Bill } from '../types';

export default function VendorBills() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button 
        variant="outline" 
        onClick={() => router.push('/manager/accounting')}
        className="mb-6"
      >
        <FileText className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="bg-[#1E293B] border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-blue-400">Vendor Bills</CardTitle>
          <Button 
            onClick={() => router.push('/manager/accounting/createBill')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            New Bill
          </Button>
        </CardHeader>
        <CardContent>
          {bills.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-blue-400 text-sm">
                    <th className="text-left p-2">Bill ID</th>
                    <th className="text-left p-2">Vendor</th>
                    <th className="text-left p-2">Bill Number</th>
                    <th className="text-right p-2">Amount</th>
                    <th className="text-left p-2">Due Date</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.id} className="text-white border-t border-blue-500/20">
                      <td className="p-2">#{bill.id}</td>
                      <td className="p-2">{bill.vendor}</td>
                      <td className="p-2">{bill.billNumber}</td>
                      <td className="p-2 text-right">${bill.amount.toLocaleString()}</td>
                      <td className="p-2">{bill.dueDate}</td>
                      <td className="p-2">{bill.status}</td>
                      <td className="p-2">{bill.createdAt}</td>
                      <td className="p-2 text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-white p-8">
              No bills found. Click "New Bill" to create one.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}