import React, { useState } from 'react';
import { Package, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockItem } from './data';
import { getTimeAgo } from './utils';

interface SidePanelProps {
  stockData: StockItem[];
}

const SidePanel: React.FC<SidePanelProps> = ({ stockData }) => {
  const [showAllDemand, setShowAllDemand] = useState(false);
  
  const highDemandItems = stockData.filter(item => item.demanded > item.available);
  const displayedDemandItems = showAllDemand ? highDemandItems : highDemandItems.slice(0, 4);
  const hasMoreItems = highDemandItems.length > 4;

  return (
    <>
      {/* Quick Stats */}
      <Card className="bg-black border border-blue-400">
        <CardHeader>
          <CardTitle className="text-blue-400">Stock Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-900/30 p-4 rounded border border-blue-400/30">
              <p className="text-sm text-blue-400">Total Products</p>
              <p className="text-2xl font-bold text-blue-300">{stockData.length}</p>
            </div>
            <div className="bg-blue-900/30 p-4 rounded border border-blue-400/30">
              <p className="text-sm text-blue-400">Total Stock Value</p>
              <p className="text-2xl font-bold text-blue-300">$145,000</p>
            </div>
            <div className="bg-blue-900/30 p-4 rounded border border-blue-400/30">
              <p className="text-sm text-blue-400">High Demand Items</p>
              <p className="text-2xl font-bold text-blue-300">
                {highDemandItems.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Demand Alert */}
      <Card className="bg-black border border-blue-400">
        <CardHeader>
          <CardTitle className="text-blue-400">High Demand Alert</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-200">
          <div className="space-y-3">
            {displayedDemandItems.map(item => (
              <div key={item.productName} className="flex justify-between items-center p-3 bg-red-900/30 rounded border border-red-800">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-red-300">
                    Demand exceeds stock by {item.demanded - item.available} units
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-red-400">{item.available} available</p>
                  <p className="text-sm">{item.demanded} demanded</p>
                </div>
              </div>
            ))}
            
            {hasMoreItems && (
              <button
                onClick={() => setShowAllDemand(!showAllDemand)}
                className="w-full mt-2 py-2 px-4 rounded bg-blue-900/30 border border-blue-400/30 hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
              >
                {showAllDemand ? 'Show Less' : 'Load More'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showAllDemand ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recently Updated */}
      <Card className="bg-black border border-blue-400">
        <CardHeader>
          <CardTitle className="text-blue-400">Recently Updated</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-200">
          <div className="space-y-3">
            {[...stockData]
              .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
              .slice(0, 3)
              .map(item => (
                <div key={item.productName} className="flex justify-between items-center p-3 bg-blue-900/30 rounded border border-blue-400/30">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-blue-300">{getTimeAgo(item.lastUpdated)}</p>
                  </div>
                  <Package className="h-5 w-5" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SidePanel;