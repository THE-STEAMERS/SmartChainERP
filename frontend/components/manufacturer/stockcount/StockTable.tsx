import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useStockData, StockItem } from "./data";

interface StockTableProps {
  stockData: StockItem[];
}

const StockTable: React.FC<StockTableProps> = ({ stockData }) => {
  const { loading, error } = useStockData();

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Stock Information</h2>

      {loading ? (
        <p>Loading stock data...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : stockData && stockData.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-blue-400 bg-blue-900/20">
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
                <tr key={item.productName + item.category} className="border-b border-blue-400/30 hover:bg-blue-900/20">
                  <td className="py-3 px-4 font-medium">{item.productName}</td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">{item.available}</td>
                  <td className="py-3 px-4">{item.sold}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    {item.demanded}
                    {item.demanded > item.available && (
                      <ArrowUpRight className="text-red-400 h-4 w-4" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        item.available > item.demanded ? "bg-blue-900 text-blue-300" : "bg-red-900 text-red-300"
                      }`}
                    >
                      {item.available > item.demanded ? "Sufficient" : "High Demand"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400">No stock data available</p>
      )}
    </div>
  );
};

export default StockTable;