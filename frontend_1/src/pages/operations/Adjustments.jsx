import React, { useState, useEffect } from 'react';
import { fetchAdjustments, deleteAdjustment, fetchProducts, fetchWarehouses } from '../../services/api';
import { Trash2, AlertTriangle, Loader2, GitCommit } from 'lucide-react';
import Table from '../../components/Table';
import Badge from '../../components/Badge';

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [adjData, prodData, whData] = await Promise.all([
        fetchAdjustments(),
        fetchProducts().catch(() => []),
        fetchWarehouses().catch(() => [])
      ]);
      setAdjustments(adjData);
      setProducts(prodData);
      setWarehouses(whData);
    } catch (err) {
      console.error(err);
      setError('Could not load inventory adjustments. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to revert this adjustment? This will recalculate stock!')) return;
    try {
      await deleteAdjustment(id);
      setAdjustments(adjustments.filter(a => a.id !== id));
      // Re-fetch since deleting adjustment modifies actual product stock
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to revert');
    }
  };

  const getProductName = (id) => products.find(p => p.id === id)?.name || `#${id}`;
  const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || `WH#${id}`;

  const columns = [
    { header: 'Adj ID', accessor: 'id', render: (row) => <span className="font-semibold text-gray-900">ADJ-{String(row.id).padStart(4, '0')}</span> },
    { header: 'Warehouse', accessor: 'warehouse_id', render: (row) => getWarehouseName(row.warehouse_id) },
    { header: 'Product', accessor: 'product_id', render: (row) => getProductName(row.product_id) },
    { header: 'Difference', accessor: 'quantity_difference', render: (row) => (
      <span className={`font-medium ${row.quantity_difference > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        {row.quantity_difference > 0 ? '+' : ''}{row.quantity_difference}
      </span>
    )},
    { header: 'Reason', accessor: 'reason', render: (row) => <span className="text-gray-500 italic text-sm">{row.reason}</span> },
    { header: 'Actions', accessor: 'actions', render: (row) => (
        <div className="flex gap-2">
            <button onClick={() => handleDelete(row.id)} className="p-1 rounded bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition" title="Revert Error">
                <Trash2 size={16} />
            </button>
        </div>
    )}
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-cyan-600 animate-spin" /><span className="ml-3 text-gray-500 font-medium">Loading adjustments...</span></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <GitCommit size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Inventory Adjustments</h1>
              <p className="text-gray-500 mt-1 text-sm">Correct real-world differences vs database counts</p>
            </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
           <Table title="" data={adjustments} columns={columns} />
        </div>
      )}
    </div>
  );
};
export default Adjustments;
