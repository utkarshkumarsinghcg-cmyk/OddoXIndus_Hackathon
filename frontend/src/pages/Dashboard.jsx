import { useState } from 'react';
import { PackageOpen, AlertTriangle, ArrowDownToLine, Truck, ArrowRightLeft } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import ChartWidget from '../components/ChartWidget';
import Table from '../components/Table';
import FilterDropdown from '../components/FilterDropdown';

const Dashboard = () => {
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWarehouse, setFilterWarehouse] = useState('All');

  const kpiData = [
    { title: 'Total Products', value: '14,234', icon: PackageOpen, trend: 'up', trendValue: '12' },
    { title: 'Low Stock/Out', value: '86', icon: AlertTriangle, trend: 'down', trendValue: '4' },
    { title: 'Pending Receipts', value: '12', icon: ArrowDownToLine, trend: 'up', trendValue: '8' },
    { title: 'Pending Deliveries', value: '45', icon: Truck, trend: 'down', trendValue: '2' },
    { title: 'Internal Transfers', value: '8', icon: ArrowRightLeft, trend: 'up', trendValue: '15' },
  ];

  const recentActivityColumns = [
    { header: 'Order ID', accessor: 'id', render: (row) => <span className="font-semibold text-gray-900">{row.id}</span> },
    { header: 'Type', accessor: 'type' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`px-3 py-1 bg-opacity-10 rounded-full text-xs font-medium border
        ${row.status === 'Ready' ? 'bg-emerald-500 text-emerald-700 border-emerald-200' :
          row.status === 'Waiting' ? 'bg-amber-500 text-amber-700 border-amber-200' :
          row.status === 'Draft' ? 'bg-gray-500 text-gray-700 border-gray-200' :
          'bg-indigo-500 text-indigo-700 border-indigo-200'}`}
      >
        {row.status}
      </span>
    ) },
    { header: 'Warehouse', accessor: 'warehouse' },
    { header: 'Date', accessor: 'date' },
  ];

  const recentActivityData = [
    { id: 'REC-0012', type: 'Receipt', status: 'Ready', warehouse: 'WH01-Main', date: 'Oct 24, 2023' },
    { id: 'OUT-0045', type: 'Delivery', status: 'Waiting', warehouse: 'WH02-East', date: 'Oct 24, 2023' },
    { id: 'INT-0089', type: 'Transfer', status: 'Draft', warehouse: 'WH01 to WH03', date: 'Oct 23, 2023' },
    { id: 'REC-0013', type: 'Receipt', status: 'Done', warehouse: 'WH01-Main', date: 'Oct 22, 2023' },
    { id: 'OUT-0046', type: 'Delivery', status: 'Ready', warehouse: 'WH03-North', date: 'Oct 22, 2023' },
  ];

  const filterTypeOptions = [
    { label: 'All Document Types', value: 'All' },
    { label: 'Receipts', value: 'Receipts' },
    { label: 'Deliveries', value: 'Deliveries' },
    { label: 'Transfers', value: 'Transfers' },
    { label: 'Adjustments', value: 'Adjustments' },
  ];

  const filterStatusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Waiting', value: 'Waiting' },
    { label: 'Ready', value: 'Ready' },
    { label: 'Done', value: 'Done' },
  ];

  const filterWarehouseOptions = [
    { label: 'All Warehouses', value: 'All' },
    { label: 'WH01-Main', value: 'WH01-Main' },
    { label: 'WH02-East', value: 'WH02-East' },
    { label: 'WH03-North', value: 'WH03-North' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here is what is happening today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <FilterDropdown label="Type" options={filterTypeOptions} selected={filterType} onChange={setFilterType} />
          <FilterDropdown label="Status" options={filterStatusOptions} selected={filterStatus} onChange={setFilterStatus} />
          <FilterDropdown label="Warehouse" options={filterWarehouseOptions} selected={filterWarehouse} onChange={setFilterWarehouse} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiData.map((kpi, idx) => (
          <div key={idx} style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }} className="animate-fade-in opacity-0">
            <DashboardCard {...kpi} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full mt-6">
        <div className="lg:col-span-2 shadow-sm rounded-2xl border border-gray-100 bg-white animate-fade-in opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <ChartWidget />
        </div>
        <div className="lg:col-span-1 border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentActivityData.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/30 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-semibold text-gray-900">{row.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 bg-opacity-10 rounded-full text-xs font-medium border
                        ${row.status === 'Ready' ? 'bg-emerald-500 text-emerald-700 border-emerald-200' :
                          row.status === 'Waiting' ? 'bg-amber-500 text-amber-700 border-amber-200' :
                          row.status === 'Draft' ? 'bg-gray-500 text-gray-700 border-gray-200' :
                          'bg-indigo-500 text-indigo-700 border-indigo-200'}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button className="text-indigo-600 font-medium text-sm hover:text-indigo-700 transition w-full text-center py-2 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-200">
              View all activity &rarr;
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
        <Table title="Detailed Operations" data={recentActivityData} columns={recentActivityColumns} />
      </div>
    </div>
  );
};

export default Dashboard;
