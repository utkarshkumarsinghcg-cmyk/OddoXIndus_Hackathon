import { useState } from 'react';

const Receipts = () => {
  const [status, setStatus] = useState('Ready');
  const [products, setProducts] = useState([
    { id: 1, name: '[DESK001] Desk', qty: 6 }
  ]);
  const [receiveFrom, setReceiveFrom] = useState('');
  const [responsible, setResponsible] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  const handleValidate = () => setStatus('Done');

  const handleNewReceipt = () => {
    setStatus('Draft');
    setReceiveFrom('');
    setResponsible('');
    setScheduleDate('');
    setProducts([]);
  };

  const handleAddProduct = () => {
    setProducts([...products, { id: Date.now(), name: '', qty: 1 }]);
  };

  const handleProductChange = (id, field, value) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in p-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        {/* Top Navbar Simulation */}
        <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center">
          <button 
            onClick={handleNewReceipt}
            className="px-4 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700">
            New
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-gray-600 font-medium text-lg">
            Receipt
          </div>

          {/* Action and Status Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 border border-gray-200 rounded-t-xl p-3">
            <div className="flex gap-2">
              <button 
                onClick={handleValidate}
                disabled={status === 'Done'}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                Validate
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Print
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>

            <div className="flex items-center text-sm font-bold mt-4 md:mt-0 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
               <div className={`px-4 py-2 flex items-center justify-center transition-colors ${status === 'Draft' ? 'text-gray-900 bg-gray-100' : 'text-gray-400'}`}>
                  Draft
               </div>
               <div className="text-gray-300">❯</div>
               <div className={`px-4 py-2 flex items-center justify-center transition-colors ${status === 'Ready' ? 'text-gray-900 bg-gray-100' : 'text-gray-400'}`}>
                  Ready
               </div>
               <div className="text-gray-300">❯</div>
               <div className={`px-4 py-2 flex items-center justify-center transition-colors ${status === 'Done' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400'}`}>
                  Done
               </div>
            </div>
          </div>
          
          {/* Main Info Area */}
          <div className="border border-t-0 border-gray-200 p-6 md:p-8 rounded-b-xl bg-white mb-8 shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">WH/IN/0001</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              <div className="space-y-6">
                <div className="flex items-end group">
                  <label className="w-32 text-sm font-bold text-gray-700 pb-1 shrink-0">Receive From</label>
                  <input 
                    value={receiveFrom}
                    onChange={e => setReceiveFrom(e.target.value)}
                    className="flex-1 border-b border-gray-300 group-focus-within:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-medium" 
                  />
                </div>
                <div className="flex items-end group">
                  <label className="w-32 text-sm font-bold text-gray-700 pb-1 shrink-0">Responsible</label>
                  <input 
                    value={responsible}
                    onChange={e => setResponsible(e.target.value)}
                    className="flex-1 border-b border-gray-300 group-focus-within:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-medium" 
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-end group">
                  <label className="w-32 text-sm font-bold text-gray-700 pb-1 shrink-0">Schedule Date</label>
                  <input 
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="flex-1 border-b border-gray-300 group-focus-within:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-medium" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notebook / Products Tabs */}
          <div className="bg-white">
            <div className="flex border-b border-gray-200 mb-6">
              <div className="px-6 py-3 text-sm font-bold text-cyan-700 border-b-2 border-cyan-700 -mb-[1px]">
                Products
              </div>
            </div>
            
            <div className="px-2">
              <table className="w-full text-left">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="pb-3 text-sm font-extrabold text-gray-800 w-3/4">Product</th>
                    <th className="pb-3 text-sm font-extrabold text-gray-800">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 group">
                      <td className="py-2 pr-4">
                        <input 
                          value={p.name}
                          onChange={e => handleProductChange(p.id, 'name', e.target.value)}
                          placeholder="e.g. Desk"
                          className="w-full border-b border-transparent focus:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-semibold" 
                        />
                      </td>
                      <td className="py-2">
                        <input 
                          type="number"
                          value={p.qty}
                          onChange={e => handleProductChange(p.id, 'qty', e.target.value)}
                          className="w-32 border-b border-transparent focus:border-cyan-600 outline-none px-1 py-1 text-sm text-gray-900 bg-transparent transition-colors font-semibold" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 pb-4">
                <button 
                  onClick={handleAddProduct}
                  className="text-cyan-600 text-sm font-bold hover:text-cyan-800 transition-colors">
                  New Product
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Receipts;
