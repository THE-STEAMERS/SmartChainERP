import React from 'react';
import { useQRScanner } from '../../contexts/QRScannerContext';

const QRScanner: React.FC = () => {
  const { currentQR, connectionStatus, scanHistory } = useQRScanner();

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">QR Scanner</h2>
        <div className="rounded-full px-3 py-1 text-sm font-medium" 
             style={{ 
               backgroundColor: connectionStatus === 'Connected' ? 'rgba(0, 200, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
               color: connectionStatus === 'Connected' ? 'green' : 'red'
             }}>
          {connectionStatus}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Current Scan</h3>
        <div className="rounded border border-gray-200 bg-gray-50 p-4 font-mono">
          {currentQR}
        </div>
      </div>
      
      <div>
        <h3 className="mb-2 text-lg font-semibold">Recent Scans</h3>
        {scanHistory.length > 0 ? (
          <div className="max-h-64 overflow-y-auto rounded border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Time</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {scanHistory.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-2 px-4 text-sm text-gray-500">
                      {item.timestamp}
                    </td>
                    <td className="py-2 px-4 font-mono text-sm">
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No scan history yet</p>
        )}
      </div>
    </div>
  );
};

export default QRScanner;