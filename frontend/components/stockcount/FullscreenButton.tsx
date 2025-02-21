"use client";

import React, { useState } from 'react';
import { stockData } from './data';
import SidePanel from './SidePanel';
import NavigationBar from './NavigationBar';
import StockOverview from './StockOverview';

export default function StockCountPage() {
  const [activeView, setActiveView] = useState<string>('table');

  return (
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
  );
}