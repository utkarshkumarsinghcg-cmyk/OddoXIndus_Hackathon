import { useState } from 'react';
import { ArrowDownToLine, CheckCircle2, User, Search, Package } from 'lucide-react';

const Receipts = () => {
  const [receipts, setReceipts] = useState([
    { id: 'REC-0012', supplier: 'Tech Corp Vendor', product: 'Sensors v2', qty: 500, date: 'Oct 24, 2023', status: 'Ready' },
  ]);

  const [formData, setFormData] = useState({ supplier: '', product: 'Steel Rods', qty: '' });

  const handleValidate = (e) => {
    e.preventDefault();
    if (!formData.supplier || !formData.qty) return;
    setReceipts([...receipts, { 
      id: `REC-00${receipts.length + 13}`, 
      ...formData, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Done' 
    }]);
    setFormData({ supplier: '', product: 'Steel Rods', qty: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Receipts (Incoming Goods)</h1>
          <p className="text-gray-500 mt-1">Receive inventory from vendors directly into your warehouse.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1 bg-white shadow-sm border border-gray-100 rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <ArrowDownToLine className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-bold text-gray-900">Create Receipt</h3>
          </div>
          <form className="space-y-4" onSubmit={handleValidate}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier / Vendor</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} type="text" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm" placeholder="e.g., Acme Corp" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm bg-white">
                <option>Steel Rods</option>
                <option>A4 Paper</option>
                <option>Office Chairs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Received</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} type="number" min="1" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm" placeholder="100" />
              </div>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm border border-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Validate (Increase Stock)
            </button>
            <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center">
              * Validating will automatically log the stock increment.
            </p>
          </form>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Receipt History
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search receipts..." className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Receipt ID</th>
                  <th className="px-6 py-3">Supplier</th>
                  <th className="px-6 py-3">Product Received</th>
                  <th className="px-6 py-3">Qty</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {receipts.map((r, i) => (
                  <tr key={i} className="hover:bg-cyan-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{r.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{r.supplier}</td>
                    <td className="px-6 py-4 text-cyan-700 font-semibold">{r.product}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">+{r.qty}</td>
                    <td className="px-6 py-4 text-gray-500">{r.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 bg-opacity-10 rounded-full text-xs font-bold border ${r.status === 'Done' ? 'bg-emerald-500 text-emerald-700 border-emerald-200' : 'bg-amber-500 text-amber-700 border-amber-200'}`}>
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

export default Receipts;
