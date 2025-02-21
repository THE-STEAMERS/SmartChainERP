'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function CustomerInvoice() {
  const router = useRouter();

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
        <CardHeader>
          <CardTitle className="text-xl text-blue-400">Customer Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add invoice list/table */}
        </CardContent>
      </Card>
    </div>
  );
}