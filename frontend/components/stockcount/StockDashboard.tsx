import React from 'react';
import FullscreenButton from './FullscreenButton';

export default function StockDashboard() {
  return (
    <div id="stockDashboard" className="relative p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Stock Dashboard</h2>
        <FullscreenButton />
      </div>
      <p>Here, stock counting and inventory management will be displayed.</p>
    </div>
  );
}