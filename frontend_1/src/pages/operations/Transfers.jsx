import React, { useEffect, useState } from 'react';
import { fetchTransfers } from '../../services/api';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { Plus } from 'lucide-react';

export default function Transfers() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTransfers().then(setData);
  }, []);

  const columns = [
    { header: 'Transfer ID', accessor: 'id' },
    { header: 'From Location', accessor: 'fromLocation' },
    { header: 'To Location', accessor: 'toLocation' },
    { header: 'Product', accessor: 'product' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Status', render: (row) => <Badge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 shadow-sm p-2 rounded bg-white w-full border-b">Internal Transfers</h1>
      </div>
      <div className="bg-white p-4 shadow-sm rounded-lg border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-end">
          <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            New Transfer
          </button>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
