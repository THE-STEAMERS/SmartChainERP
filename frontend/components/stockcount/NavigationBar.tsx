import React from 'react';

interface NavigationBarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeView, setActiveView }) => {
  return (
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
  );
};

export default NavigationBar;