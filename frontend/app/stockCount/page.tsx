"use client";
import React, { useMemo, useState } from 'react';
import { TrendingUp, Clock, Package, ArrowUpRight, ChevronDown } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Label, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const StockDashboard = () => {
  const [activeView, setActiveView] = useState('charts');
  const [showAllDemand, setShowAllDemand] = useState(false);

  // Enhanced stock data
  const stockData = [
    { 
      productName: "iPhone 13",
      stock: "Electronics", 
      available: 150, 
      sold: 50, 
      category: "tech", 
      demanded: 200, 
      lastUpdated: "2024-02-12T10:30:00" 
    },
    { 
      productName: "Plastic Containers",
      stock: "Plastics", 
      available: 300, 
      sold: 120, 
      category: "materials", 
      demanded: 350, 
      lastUpdated: "2024-02-12T09:15:00" 
    },
    { 
      productName: "Coffee Maker",
      stock: "Household", 
      available: 200, 
      sold: 75, 
      category: "home", 
      demanded: 180, 
      lastUpdated: "2024-02-12T11:45:00" 
    },
    { 
      productName: "Car Battery",
      stock: "Automotive", 
      available: 100, 
      sold: 25, 
      category: "vehicles", 
      demanded: 150, 
      lastUpdated: "2024-02-11T16:20:00" 
    },
    { 
      productName: "Power Tools",
      stock: "Industrial", 
      available: 250, 
      sold: 90, 
      category: "manufacturing", 
      demanded: 280, 
      lastUpdated: "2024-02-12T08:00:00" 
    },
    { 
      productName: "Gaming Console",
      stock: "Electronics", 
      available: 75, 
      sold: 45, 
      category: "tech", 
      demanded: 200, 
      lastUpdated: "2024-02-12T07:30:00" 
    },
    { 
      productName: "Smart Watch",
      stock: "Electronics", 
      available: 80, 
      sold: 60, 
      category: "tech", 
      demanded: 150, 
      lastUpdated: "2024-02-12T06:45:00" 
    }
  ];

  // Data for comparison bar chart
  const compareData = stockData.map(item => ({
    name: item.productName,
    available: item.available,
    demanded: item.demanded,
    sold: item.sold
  }));

  // Category distribution data for pie chart
  const categoryData = [
    { name: "Electronics", value: 150, fill: "#0088FE" },
    { name: "Plastics", value: 300, fill: "#00C49F" },
    { name: "Household", value: 200, fill: "#FFBB28" },
    { name: "Automotive", value: 100, fill: "#FF8042" },
    { name: "Industrial", value: 250, fill: "#8884d8" }
  ];

  const totalStock = useMemo(() => {
    return categoryData.reduce((acc, curr) => acc + curr.value, 0);
  }, [categoryData]);

  const getTimeAgo = (dateString: string | number | Date) => {
    if (!dateString) return "Invalid date";  // Check if dateString is null or undefined

    const updated = new Date(dateString);
    if (isNaN(updated.getTime())) return "Invalid date";  // Ensure valid date

    const diffHours = Math.floor((Date.now() - updated.getTime()) / (1000 * 60 * 60));
    return `${diffHours} hours ago`;
};


  // Get high demand items
  const highDemandItems = stockData.filter(item => item.demanded > item.available);
  const displayedDemandItems = showAllDemand ? highDemandItems : highDemandItems.slice(0, 4);
  const hasMoreItems = highDemandItems.length > 4;

  return (
    <div className="w-full min-h-screen bg-black text-blue-400 p-6">
      {/* Navigation */}
      <nav className="flex items-center justify-between mb-6 border-b border-blue-400 pb-2">
        <div className="flex gap-8">
        </div>
        <div className="flex gap-4">
          <button 
            className={`px-4 py-2 rounded ${activeView === 'table' ? 'bg-blue-600 text-white' : 'bg-blue-900 text-blue-300'}`}
            onClick={() => setActiveView('table')}
          >
            Table View
          </button>
          <button 
            className={`px-4 py-2 rounded ${activeView === 'charts' ? 'bg-blue-600 text-white' : 'bg-blue-900 text-blue-300'}`}
            onClick={() => setActiveView('charts')}
          >
            Chart View
          </button>
        </div>
      </nav>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Overview Section */}
          <Card className="bg-black border border-blue-400">
            <CardHeader>
              <CardTitle className="text-blue-400">Stock Overview</CardTitle>
              <CardDescription className="text-blue-300">Comprehensive stock details</CardDescription>
            </CardHeader>
            <CardContent>
              {activeView === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-400">
                        <th className="text-left py-3 px-4">Product Name</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Available</th>
                        <th className="text-left py-3 px-4">Sold</th>
                        <th className="text-left py-3 px-4">Demanded</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.map((item) => (
                        <tr key={item.productName} className="border-b border-blue-400/30 hover:bg-blue-900/20">
                          <td className="py-3 px-4 font-medium">{item.productName}</td>
                          <td className="py-3 px-4">{item.stock}</td>
                          <td className="py-3 px-4">{item.available}</td>
                          <td className="py-3 px-4">{item.sold}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {item.demanded}
                              {item.demanded > item.available && (
                                <ArrowUpRight className="text-red-400 h-4 w-4" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm ${
                              item.available > item.demanded ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'
                            }`}>
                              {item.available > item.demanded ? 'Sufficient' : 'High Demand'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stock Distribution Pie Chart */}
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Stock Comparison Bar Chart */}
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={compareData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
                        <XAxis dataKey="name" stroke="#3b82f6" />
                        <YAxis stroke="#3b82f6" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="available" fill="#0088FE" name="Available" />
                        <Bar dataKey="demanded" fill="#00C49F" name="Demanded" />
                        <Bar dataKey="sold" fill="#FFBB28" name="Sold" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
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
                    {stockData.filter(item => item.demanded > item.available).length}
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
            <CardContent>
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
            <CardContent>
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
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;