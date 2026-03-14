import { useState } from 'react';

const Warehouses = () => {
  const [warehouseMode, setWarehouseMode] = useState(true); // true = Warehouse mode, false = Location mode
  
  // Warehouse State
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseShortCode, setWarehouseShortCode] = useState('');
  const [warehouseAddress, setWarehouseAddress] = useState('');

  // Location State
  const [locationName, setLocationName] = useState('');
  const [locationShortCode, setLocationShortCode] = useState('');
  const [locationWarehouse, setLocationWarehouse] = useState('WH');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in p-4">
      {/* Toggle between Warehouse and Location wireframes just for demonstration */}
      <div className="flex gap-4 mb-2">
        <button 
           onClick={() => setWarehouseMode(true)}
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${warehouseMode ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}>
          View Warehouse Form
        </button>
        <button 
           onClick={() => setWarehouseMode(false)}
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${!warehouseMode ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}>
          View Location Form
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        {/* Top Navbar Simulation */}
        <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center">
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-8 text-gray-600 font-bold text-xl uppercase tracking-wider">
            {warehouseMode ? 'Warehouse' : 'Location'}
          </div>

          {/* Main Info Area */}
          <div className="border border-gray-200 p-6 md:p-10 rounded-xl bg-white mb-8 shadow-sm">
            
            {warehouseMode ? (
              <div className="space-y-8 max-w-lg">
                <div className="flex items-end group">
                  <label className="w-32 text-sm font-bold text-gray-700 pb-1 shrink-0">Name:</label>
                  <input 
                    value={warehouseName}
                    onChange={e => setWarehouseName(e.target.value)}
                    className="flex-1 border-b border-gray-300 focus:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-medium" 
                  />
                </div>
                <div className="flex items-end group">
                  <label className="w-32 text-sm font-bold text-gray-700 pb-1 shrink-0">Short Code:</label>
                  <input 
                    value={warehouseShortCode}
                    onChange={e => setWarehouseShortCode(e.target.value)}
                    className="flex-1 border-b border-gray-300 focus:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-medium" 
                  />
                </div>
                <div className="flex items-end group">
                  <label className="w-32 text-sm font-bold text-gray-700 pb-1 shrink-0">Address:</label>
                  <input 
                    value={warehouseAddress}
                    onChange={e => setWarehouseAddress(e.target.value)}
                    className="flex-1 border-b border-gray-300 focus:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-medium" 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8 max-w-lg">
                <div className="flex items-end group">
                  <label className="w-32 text-sm font-bold text-gray-700 pb-1 shrink-0">Name:</label>
                  <input 
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    className="flex-1 border-b border-gray-300 focus:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-medium" 
                  />
                </div>
                <div className="flex items-end group">
                  <label className="w-32 text-sm font-bold text-gray-700 pb-1 shrink-0">Short Code:</label>
                  <input 
                    value={locationShortCode}
                    onChange={e => setLocationShortCode(e.target.value)}
                    className="flex-1 border-b border-gray-300 focus:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-medium" 
                  />
                </div>
                <div className="flex items-end group">
                  <label className="w-32 text-sm font-bold text-gray-700 pb-1 shrink-0">warehouse:</label>
                  <input 
                    value={locationWarehouse}
                    onChange={e => setLocationWarehouse(e.target.value)}
                    className="flex-1 border-b border-gray-300 focus:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-bold text-center" 
                  />
                </div>
                
                <div className="mt-12 text-center">
                  <p className="text-gray-500 font-medium italic text-sm">
                    This holds the multiple locations of warehouse, rooms etc..
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Warehouses;
