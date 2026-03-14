import { useState } from 'react';
import { PenTool, CheckCircle2, Search, AlertTriangle } from 'lucide-react';

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState([
    { id: 'ADJ-0012', product: 'Steel Rods', location: 'Rack B', recorded: 105, counted: 102, diff: -3, reason: 'Damaged items', date: 'Oct 24, 2023', status: 'Adjusted' },
  ]);

  const [formData, setFormData] = useState({ product: 'Steel Rods', location: 'Rack B', recorded: 105, counted: '', reason: '' });

  const handleValidate = (e) => {
    e.preventDefault();
    if (!formData.counted) return;
    
    const diff = parseInt(formData.counted) - formData.recorded;
    
    setAdjustments([...adjustments, { 
      id: `ADJ-00${adjustments.length + 13}`, 
      diff: diff,
      ...formData, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Adjusted' 
    }]);
    setFormData({ ...formData, counted: '', reason: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Stock Adjustments</h1>
          <p className="text-gray-500 mt-1">Fix mismatches between recorded stock and physical counts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1 bg-white shadow-sm border border-gray-100 rounded-2xl p-6 h-fit relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-gray-900">Log Discrepancy</h3>
          </div>
          <form className="space-y-4" onSubmit={handleValidate}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm bg-gray-50">
                  <option>Steel Rods</option>
                  <option>A4 Paper</option>
                  <option>Office Chairs</option>
                </select>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex justify-between items-center">
               <span className="text-sm font-semibold text-amber-800">System Recorded Stock:</span>
               <span className="text-lg font-bold text-amber-900">{formData.recorded}</span>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Actual Physical Count</label>
              <input required value={formData.counted} onChange={e => setFormData({...formData, counted: e.target.value})} type="number" min="0" className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none text-base font-bold shadow-inner" placeholder="Enter counted qty..." />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
               <input value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 outline-none text-sm" placeholder="e.g. 3 kg Damaged in transit" />
            </div>
            
            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm border border-gray-800">
              <PenTool className="w-4 h-4" /> Save Auto-Adjustment
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              System will universally update stock and write to ledger.
            </p>
          </form>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Adjustment Ledger
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search adjustments..." className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Log ID</th>
                  <th className="px-6 py-3">Product (Loc)</th>
                  <th className="px-6 py-3 text-center">Difference</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {adjustments.map((r, i) => (
                  <tr key={i} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{r.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{r.product}</div>
                      <div className="text-xs text-gray-500">{r.location}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-3 py-1 rounded-full font-bold text-xs border ${r.diff < 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {r.diff > 0 ? '+' : ''}{r.diff}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm max-w-[150px] truncate" title={r.reason}>{r.reason || 'Manual Update'}</td>
                    <td className="px-6 py-4 text-gray-500">{r.date}</td>
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

export default Adjustments;
