import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { StockItem, useCategoryData } from './data';

interface StockChartsProps {
  stockData: StockItem[];
}

const StockCharts: React.FC<StockChartsProps> = ({ stockData }) => {
  const { categoryData } = useCategoryData(); // ✅ Keep this, it's needed.

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
              dataKey="product_count" // ✅ Use the correct key from your dataset
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={entry.name} fill={entry.fill} /> // ✅ Keep a meaningful key
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
