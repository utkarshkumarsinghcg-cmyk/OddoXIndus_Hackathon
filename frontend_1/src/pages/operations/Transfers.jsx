import React, { useState, useEffect } from 'react';
import { fetchTransfers, fetchProducts, fetchWarehouses } from '../../services/api';
import { Loader2, ArrowRightLeft } from 'lucide-react';
import Table from '../../components/Table';
import Badge from '../../components/Badge';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [transData, prodData, whData] = await Promise.all([
        fetchTransfers(),
        fetchProducts().catch(() => []),
        fetchWarehouses().catch(() => [])
      ]);
      setTransfers(transData);
      setProducts(prodData);
      setWarehouses(whData);
    } catch (err) {
      console.error(err);
      setError('Could not load internal transfers. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getProductName = (id) => products.find(p => p.id === id)?.name || `#${id}`;
  const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || `WH#${id}`;

  const columns = [
    { header: 'Transfer ID', accessor: 'id', render: (row) => <span className="font-semibold text-gray-900">INT-{String(row.id).padStart(4, '0')}</span> },
    { header: 'From WH', accessor: 'from_warehouse', render: (row) => getWarehouseName(row.from_warehouse) },
    { header: 'To WH', accessor: 'to_warehouse', render: (row) => getWarehouseName(row.to_warehouse) },
    { header: 'Product', accessor: 'product_id', render: (row) => getProductName(row.product_id) },
    { header: 'Quantity', accessor: 'quantity', render: (row) => <span className="font-medium text-cyan-600">{row.quantity}</span> },
    { header: 'Date', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-cyan-600 animate-spin" /><span className="ml-3 text-gray-500 font-medium">Loading transfers...</span></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                <ArrowRightLeft size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Internal Transfers</h1>
              <p className="text-gray-500 mt-1 text-sm">Move goods between your own locations</p>
            </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
           <Table title="" data={transfers} columns={columns} />
        </div>
      )}
    </div>
  );
};
export default Transfers;
