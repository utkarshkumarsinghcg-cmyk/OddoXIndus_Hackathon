import { useState } from 'react';
import { Truck, CheckCircle2, ShoppingCart, Search, Package } from 'lucide-react';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([
    { id: 'OUT-0045', customer: 'Global Retailers', product: 'Office Chairs', qty: 10, date: 'Oct 24, 2023', status: 'Ready to Pick' },
  ]);

  const [formData, setFormData] = useState({ customer: '', product: 'Office Chairs', qty: '' });

  const handleValidate = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.qty) return;
    setDeliveries([...deliveries, { 
      id: `OUT-00${deliveries.length + 46}`, 
      ...formData, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Shipped (Done)' 
    }]);
    setFormData({ customer: '', product: 'Office Chairs', qty: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Delivery Orders</h1>
          <p className="text-gray-500 mt-1">Pick, pack, and validate outgoing shipments to customers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1 bg-white shadow-sm border border-gray-100 rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <Truck className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-bold text-gray-900">Create Delivery</h3>
          </div>
          <form className="space-y-4" onSubmit={handleValidate}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer / Destination</label>
              <div className="relative">
                <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} type="text" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm" placeholder="e.g., Global Retailers" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product to Ship</label>
              <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm bg-white">
                <option>Steel Rods</option>
                <option>A4 Paper</option>
                <option>Office Chairs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Ship</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} type="number" min="1" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm" placeholder="10" />
              </div>
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm border border-cyan-700">
              <CheckCircle2 className="w-4 h-4" /> Pick, Pack & Validate
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Validating will decrease <span className="font-bold">available stock</span>.
            </p>
          </form>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Delivery Queue
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search orders..." className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Product Out</th>
                  <th className="px-6 py-3">Qty</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deliveries.map((r, i) => (
                  <tr key={i} className="hover:bg-cyan-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{r.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{r.customer}</td>
                    <td className="px-6 py-4 text-cyan-700 font-semibold">{r.product}</td>
                    <td className="px-6 py-4 font-bold text-red-500">-{r.qty}</td>
                    <td className="px-6 py-4 text-gray-500">{r.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 bg-opacity-10 rounded-full text-xs font-bold border ${r.status.includes('Done') ? 'bg-cyan-500 text-cyan-700 border-cyan-200' : 'bg-amber-500 text-amber-700 border-amber-200'}`}>
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

export default Deliveries;
