import { useState } from 'react';
import { ArrowRightLeft, CheckCircle2, Search, MapPin } from 'lucide-react';

const Transfers = () => {
  const [transfers, setTransfers] = useState([
    { id: 'INT-0089', source: 'Main Warehouse', dest: 'Production Floor', product: 'Steel Rods', qty: 100, date: 'Oct 23, 2023', status: 'Draft' },
  ]);

  const [formData, setFormData] = useState({ source: 'Main Warehouse', dest: 'Production Floor', product: 'Steel Rods', qty: '' });

  const handleValidate = (e) => {
    e.preventDefault();
    if (!formData.qty) return;
    setTransfers([...transfers, { 
      id: `INT-00${transfers.length + 90}`, 
      ...formData, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Done' 
    }]);
    setFormData({ ...formData, qty: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Internal Transfers</h1>
          <p className="text-gray-500 mt-1">Move stock safely inside your company network.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1 bg-white shadow-sm border border-gray-100 rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <ArrowRightLeft className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-bold text-gray-900">New Transfer</h3>
          </div>
          <form className="space-y-4" onSubmit={handleValidate}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm bg-white">
                  <option>Main Warehouse</option>
                  <option>Warehouse 2</option>
                  <option>Rack A</option>
                  <option>Rack B</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center -my-3 relative z-10">
              <div className="bg-cyan-50 p-1 rounded-full border border-gray-200">
                 <ArrowRightLeft className="w-4 h-4 text-cyan-600 rotate-90" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                <select value={formData.dest} onChange={e => setFormData({...formData, dest: e.target.value})} className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm bg-white border-cyan-200">
                  <option>Production Floor</option>
                  <option>Warehouse 2</option>
                  <option>Rack B</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm bg-white">
                <option>Steel Rods</option>
                <option>A4 Paper</option>
                <option>Office Chairs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Quantity</label>
              <input required value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} type="number" min="1" className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm" placeholder="100" />
            </div>
            
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm border border-indigo-700">
              <CheckCircle2 className="w-4 h-4" /> Execute Transfer
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Stock counts remain identical, simply re-assigned.
            </p>
          </form>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Transfer Logs
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search logs..." className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Qty Moved</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transfers.map((r, i) => (
                  <tr key={i} className="hover:bg-cyan-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{r.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-700 flex flex-col text-xs gap-1">
                       <span><span className="text-gray-400">From:</span> {r.source}</span>
                       <span className="text-cyan-700 font-semibold"><span className="text-gray-400">To:</span> {r.dest}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{r.product}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">⇄ {r.qty}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 bg-opacity-10 rounded-full text-xs font-bold border ${r.status === 'Done' ? 'bg-indigo-500 text-indigo-700 border-indigo-200' : 'bg-gray-500 text-gray-700 border-gray-200'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfers;
