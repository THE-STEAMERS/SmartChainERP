"use client";
import React, { useState } from 'react';
import { useStockData } from '@/components/manufacturer/stockcount/data';
import SidePanel from '@/components/manufacturer/stockcount/SidePanel';
import NavigationBar from '@/components/manufacturer/stockcount/NavigationBar';
import StockOverview from '@/components/manufacturer/stockcount/StockOverview';

export default function StockCountPage() {
  const [activeView, setActiveView] = useState<string>('table');
  const { stockData, loading, error } = useStockData();

  if (loading) return <p className="text-blue-300">Loading stock data...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="relative p-6 bg-black text-blue-300 min-h-screen">
      <h1 className="text-xl font-semibold mb-6 text-blue-400">Stock Dashboard</h1>      
      <NavigationBar activeView={activeView} setActiveView={setActiveView} />     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockOverview activeView={activeView} stockData={{ stockData, loading, error }} />
        </div>
        <div className="space-y-6">
          <SidePanel stockData={stockData} />
        </div>
      </div>
    </div>
  );
}

