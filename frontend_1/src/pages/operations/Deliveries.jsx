import React, { useState, useEffect } from 'react';
import { fetchDeliveries, deleteDelivery, validateDelivery, fetchProducts, fetchWarehouses } from '../../services/api';
import { Trash2, AlertTriangle, Check, Loader2, PackageX, Truck } from 'lucide-react';
import Table from '../../components/Table';
import Badge from '../../components/Badge';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [delData, prodData, whData] = await Promise.all([
        fetchDeliveries(),
        fetchProducts().catch(() => []),
        fetchWarehouses().catch(() => [])
      ]);
      setDeliveries(delData);
      setProducts(prodData);
      setWarehouses(whData);
    } catch (err) {
      console.error(err);
      setError('Could not load deliveries. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleValidate = async (id) => {
    try {
      await validateDelivery(id);
      loadData(); // Reload to get updated status and backend calculations
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Validation failed. Check stock levels.');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this delivery draft?')) return;
    try {
      await deleteDelivery(id);
      setDeliveries(deliveries.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const getProductName = (id) => products.find(p => p.id === id)?.name || `#${id}`;
  const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || `WH#${id}`;

  const columns = [
    { header: 'Delivery ID', accessor: 'id', render: (row) => <span className="font-semibold text-gray-900">OUT-{String(row.id).padStart(4, '0')}</span> },
    { header: 'Source WH', accessor: 'warehouse_id', render: (row) => getWarehouseName(row.warehouse_id) },
    { header: 'Product', accessor: 'product_id', render: (row) => getProductName(row.product_id) },
    { header: 'Quantity', accessor: 'quantity', render: (row) => <span className="font-medium text-red-600">-{row.quantity}</span> },
    { header: 'Status', accessor: 'status', render: (row) => (
      <Badge variant={row.status === 'VALIDATED' ? 'success' : 'warning'}>{row.status}</Badge>
    ) },
    { header: 'Actions', accessor: 'actions', render: (row) => (
        <div className="flex gap-2">
            {row.status === 'DRAFT' && (
              <>
                <button onClick={() => handleValidate(row.id)} className="p-1 rounded bg-green-50 text-green-600 hover:bg-green-100 transition" title="Validate (Deduct Stock)">
                    <Check size={16} />
                </button>
                <button onClick={() => handleDelete(row.id)} className="p-1 rounded bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete Draft">
                    <Trash2 size={16} />
                </button>
              </>
            )}
            {row.status === 'VALIDATED' && (
              <span className="text-gray-400 text-xs italic">Completed</span>
            )}
        </div>
    )}
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-cyan-600 animate-spin" /><span className="ml-3 text-gray-500 font-medium">Loading deliveries...</span></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <Truck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Delivery Orders</h1>
              <p className="text-gray-500 mt-1 text-sm">Track outbound goods</p>
            </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
           <Table title="" data={deliveries} columns={columns} />
        </div>
      )}
    </div>
  );
};
export default Deliveries;
