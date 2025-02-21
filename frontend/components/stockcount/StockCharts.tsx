import React from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import { StockItem, categoryData } from './data';

interface StockChartsProps {
  stockData: StockItem[];
}

const StockCharts: React.FC<StockChartsProps> = ({ stockData }) => {
  const compareData = stockData.map(item => ({
    name: item.productName,
    available: item.available,
    demanded: item.demanded,
    sold: item.sold
  }));

  return (
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
  );
};

export default StockCharts;