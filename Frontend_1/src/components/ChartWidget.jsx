import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ChartWidget = () => {
  const [activeTab, setActiveTab] = useState('week');

  // Simple bar chart data
  const weekData = [
    { label: 'Mon', receipts: 12, deliveries: 8 },
    { label: 'Tue', receipts: 19, deliveries: 14 },
    { label: 'Wed', receipts: 8, deliveries: 11 },
    { label: 'Thu', receipts: 15, deliveries: 9 },
    { label: 'Fri', receipts: 22, deliveries: 17 },
    { label: 'Sat', receipts: 6, deliveries: 3 },
    { label: 'Sun', receipts: 4, deliveries: 2 },
  ];

  const maxVal = Math.max(...weekData.map(d => Math.max(d.receipts, d.deliveries)));

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/30">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Operations Overview</h3>
          <p className="text-sm text-gray-500 mt-0.5">Receipts vs Deliveries</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {['week', 'month'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              This {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-end">
        {/* Simple bar chart */}
        <div className="flex items-end gap-3 h-48">
          {weekData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex gap-1 items-end w-full justify-center" style={{ height: '160px' }}>
                <div
                  className="w-3 bg-cyan-500 rounded-t-sm transition-all duration-500 hover:bg-cyan-600"
                  style={{ height: `${(d.receipts / maxVal) * 100}%`, minHeight: '4px' }}
                  title={`Receipts: ${d.receipts}`}
                />
                <div
                  className="w-3 bg-amber-400 rounded-t-sm transition-all duration-500 hover:bg-amber-500"
                  style={{ height: `${(d.deliveries / maxVal) * 100}%`, minHeight: '4px' }}
                  title={`Deliveries: ${d.deliveries}`}
                />
              </div>
              <span className="text-xs font-medium text-gray-500">{d.label}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-sm" />
            <span className="text-xs font-medium text-gray-600">Receipts</span>
            <span className="flex items-center text-emerald-600 text-xs font-semibold ml-1">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-sm" />
            <span className="text-xs font-medium text-gray-600">Deliveries</span>
            <span className="flex items-center text-red-500 text-xs font-semibold ml-1">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -3%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;
