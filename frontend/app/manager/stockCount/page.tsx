"use client";
import { Navbar } from "../Navbar/navbar";
import React, { useState } from 'react';
import { stockData } from '@/components/stockcount/data';
import SidePanel from '@/components/stockcount/SidePanel';
import NavigationBar from '@/components/stockcount/NavigationBar';
import StockOverview from '@/components/stockcount/StockOverview';

export default function StockCountPage() {
  const [activeView, setActiveView] = useState<string>('table');

  return (
    <>
    <Navbar />
    <div className="relative p-6 bg-black text-blue-300 min-h-screen">
      <h1 className="text-xl font-semibold mb-6 text-blue-400">Stock Dashboard</h1>
      
      <NavigationBar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <StockOverview activeView={activeView} stockData={stockData} />
        </div>
        
        {/* Side Panel - 1/3 width on large screens */}
        <div className="space-y-6">
          <SidePanel stockData={stockData} />
        </div>
      </div>
    </div>
    </>
  );
}