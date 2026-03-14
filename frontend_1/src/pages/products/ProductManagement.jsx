import { useState } from 'react';
import { Package, Plus, Search, FilePlus } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Steel Rods', sku: 'SR-100', category: 'Hardware', uom: 'kg', stock: 1500 },
    { id: 2, name: 'A4 Paper', sku: 'A4-500', category: 'Consumables', uom: 'reams', stock: 240 },
    { id: 3, name: 'Office Chairs', sku: 'FUR-001', category: 'Furniture', uom: 'units', stock: 45 },
  ]);

  const [formData, setFormData] = useState({ name: '', sku: '', category: 'Hardware', uom: 'units', stock: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    setProducts([...products, { ...formData, id: products.length + 1, stock: parseInt(formData.stock) || 0 }]);
    setFormData({ name: '', sku: '', category: 'Hardware', uom: 'units', stock: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Management</h1>
          <p className="text-gray-500 mt-1">Create and update your product catalog.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1 bg-white shadow-sm border border-gray-100 rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <FilePlus className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-bold text-gray-900">Create Product</h3>
          </div>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm transition-all" placeholder="e.g., Steel Rods" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Code</label>
              <input required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} type="text" className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm transition-all" placeholder="e.g., SR-100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm transition-all bg-white">
                  <option>Hardware</option>
                  <option>Electronics</option>
                  <option>Consumables</option>
                  <option>Furniture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                <select value={formData.uom} onChange={e => setFormData({...formData, uom: e.target.value})} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm transition-all bg-white">
                  <option>units</option>
                  <option>kg</option>
                  <option>liters</option>
                  <option>reams</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock (Optional)</label>
              <input value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} type="number" className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm transition-all" placeholder="0" />
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm">
              <Plus className="w-4 h-4" /> Save Product
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              Existing Products
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by name or SKU..." className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">UOM</th>
                  <th className="px-6 py-3">Stock Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-cyan-50/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500">{p.sku}</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold">{p.category}</span></td>
                    <td className="px-6 py-4 text-gray-500">{p.uom}</td>
                    <td className="px-6 py-4 font-bold text-cyan-700">{p.stock.toLocaleString()}</td>
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

export default ProductManagement;
