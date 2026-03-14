import { useState, useEffect } from 'react';
import { PackageOpen, AlertTriangle, ArrowDownToLine, Truck, ArrowRightLeft, Loader2 } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import ChartWidget from '../components/ChartWidget';
import Table from '../components/Table';
import FilterDropdown from '../components/FilterDropdown';
import { fetchDashboardStats } from '../services/api';

const Dashboard = () => {
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWarehouse, setFilterWarehouse] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setError('Failed to load dashboard data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
        <span className="ml-3 text-gray-500 font-medium">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-medium max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  const kpiData = [
    { title: 'Total Products in Stock', value: stats?.totalStock?.toLocaleString() || '0', icon: PackageOpen, trend: 'up', trendValue: '—' },
    { title: 'Low Stock / Out of Stock', value: String(stats?.lowStockItems || 0), icon: AlertTriangle, trend: stats?.lowStockItems > 0 ? 'down' : 'up', trendValue: '—' },
    { title: 'Pending Receipts', value: String(stats?.pendingReceipts || 0), icon: ArrowDownToLine, trend: 'up', trendValue: '—' },
    { title: 'Pending Deliveries', value: String(stats?.pendingDeliveries || 0), icon: Truck, trend: 'down', trendValue: '—' },
    { title: 'Internal Transfers', value: String(stats?.transferCount || 0), icon: ArrowRightLeft, trend: 'up', trendValue: '—' },
  ];

  // Build recent activity from real data
  const recentActivity = [];
  (stats?.receipts || []).forEach(r => {
    const whName = stats.warehouses.find(w => w.id === r.warehouse_id)?.name || `WH#${r.warehouse_id}`;
    recentActivity.push({
      id: `REC-${String(r.id).padStart(4, '0')}`,
      type: 'Receipt',
      status: r.status === 'VALIDATED' ? 'Done' : 'Ready',
      warehouse: whName,
      date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rawDate: new Date(r.created_at),
    });
  });
  (stats?.deliveries || []).forEach(d => {
    const whName = stats.warehouses.find(w => w.id === d.warehouse_id)?.name || `WH#${d.warehouse_id}`;
    recentActivity.push({
      id: `OUT-${String(d.id).padStart(4, '0')}`,
      type: 'Delivery',
      status: d.status === 'VALIDATED' ? 'Done' : 'Waiting',
      warehouse: whName,
      date: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rawDate: new Date(d.created_at),
    });
  });
  (stats?.transfers || []).forEach(t => {
    const fromWh = stats.warehouses.find(w => w.id === t.from_warehouse)?.name || `WH#${t.from_warehouse}`;
    const toWh = stats.warehouses.find(w => w.id === t.to_warehouse)?.name || `WH#${t.to_warehouse}`;
    recentActivity.push({
      id: `INT-${String(t.id).padStart(4, '0')}`,
      type: 'Transfer',
      status: 'Done',
      warehouse: `${fromWh} → ${toWh}`,
      date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rawDate: new Date(t.created_at),
    });
  });

  // Sort by date descending
  recentActivity.sort((a, b) => b.rawDate - a.rawDate);

  // Apply filters
  const filteredActivity = recentActivity.filter(item => {
    if (filterType !== 'All') {
      const typeMap = { 'Receipts': 'Receipt', 'Delivery': 'Delivery', 'Internal': 'Transfer' };
      if (typeMap[filterType] && item.type !== typeMap[filterType]) return false;
    }
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    if (filterWarehouse !== 'All' && !item.warehouse.includes(filterWarehouse)) return false;
    return true;
  });

  const recentActivityColumns = [
    { header: 'Order ID', accessor: 'id', render: (row) => <span className="font-semibold text-gray-900">{row.id}</span> },
    { header: 'Type', accessor: 'type' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`px-3 py-1 bg-opacity-10 rounded-full text-xs font-medium border
        ${row.status === 'Ready' ? 'bg-emerald-500 text-emerald-700 border-emerald-200' :
          row.status === 'Waiting' ? 'bg-amber-500 text-amber-700 border-amber-200' :
          row.status === 'Draft' ? 'bg-gray-500 text-gray-700 border-gray-200' :
          'bg-cyan-500 text-cyan-700 border-cyan-200'}`}
      >
        {row.status}
      </span>
    ) },
    { header: 'Warehouse', accessor: 'warehouse' },
    { header: 'Date', accessor: 'date' },
  ];

  const filterTypeOptions = [
    { label: 'All Document Types', value: 'All' },
    { label: 'Receipts', value: 'Receipts' },
    { label: 'Delivery', value: 'Delivery' },
    { label: 'Internal', value: 'Internal' },
  ];

  const filterStatusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Waiting', value: 'Waiting' },
    { label: 'Ready', value: 'Ready' },
    { label: 'Done', value: 'Done' },
  ];

  // Build warehouse filter options dynamically
  const warehouseOptions = [
    { label: 'All Warehouses', value: 'All' },
    ...(stats?.warehouses || []).map(w => ({ label: w.name, value: w.name })),
  ];

  const filterCategoryOptions = [
    { label: 'All Categories', value: 'All' },
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
          <FilterDropdown label="Warehouse" options={warehouseOptions} selected={filterWarehouse} onChange={setFilterWarehouse} />
          <FilterDropdown label="Category" options={filterCategoryOptions} selected={filterCategory} onChange={setFilterCategory} />
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
                {filteredActivity.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="hover:bg-cyan-50/30 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-semibold text-gray-900">{row.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 bg-opacity-10 rounded-full text-xs font-medium border
                        ${row.status === 'Ready' ? 'bg-emerald-500 text-emerald-700 border-emerald-200' :
                          row.status === 'Waiting' ? 'bg-amber-500 text-amber-700 border-amber-200' :
                          row.status === 'Draft' ? 'bg-gray-500 text-gray-700 border-gray-200' :
                          'bg-cyan-500 text-cyan-700 border-cyan-200'}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredActivity.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-gray-400">No recent activity found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button className="text-cyan-600 font-medium text-sm hover:text-cyan-700 transition w-full text-center py-2 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-200">
              View all activity &rarr;
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
        <Table title="Detailed Operations" data={filteredActivity} columns={recentActivityColumns} />
      </div>
    </div>
  );
};

export default Dashboard;
