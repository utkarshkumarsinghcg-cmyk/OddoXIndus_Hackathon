import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, RefreshCw, GitCommit, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { products, operations } = useInventory();

  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // KPIs
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.stock < 50).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const pendingReceipts = operations.filter(o => o.type === 'Receipt' && o.status !== 'Done').length;
  const pendingDeliveries = operations.filter(o => o.type === 'Delivery' && o.status !== 'Done').length;

  const barData = products.map(p => ({ name: p.name, stock: p.stock }));

  const pieData = [
    { name: 'Receipts', value: operations.filter(o => o.type === 'Receipt').length },
    { name: 'Deliveries', value: operations.filter(o => o.type === 'Delivery').length },
    { name: 'Adjustments', value: operations.filter(o => o.type === 'Adjustment').length },
    { name: 'Transfers', value: operations.filter(o => o.type === 'Transfer').length },
  ].filter(d => d.value > 0);

  const PIE_COLORS = ['#10b981', '#f59e0b', '#6366f1', '#3b82f6'];

  const filteredOperations = operations.filter(op => {
    if (filterType !== 'All' && op.type !== filterType) return false;
    if (filterStatus !== 'All' && op.status !== filterStatus) return false;
    return true;
  });

  return (
    <>
      <style>{`
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .dash-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .dash-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .kpi-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .kpi-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          border-radius: 14px 14px 0 0;
        }

        .kpi-card.kpi-blue::after   { background: linear-gradient(90deg, #3b82f6, #6366f1); }
        .kpi-card.kpi-red::after    { background: linear-gradient(90deg, #ef4444, #f97316); }
        .kpi-card.kpi-green::after  { background: linear-gradient(90deg, #10b981, #34d399); }
        .kpi-card.kpi-amber::after  { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

        .kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .kpi-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .kpi-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-icon-blue   { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
        .kpi-icon-red    { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
        .kpi-icon-green  { background: rgba(16, 185, 129, 0.12); color: #10b981; }
        .kpi-icon-amber  { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }

        .kpi-value {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .kpi-change {
          font-size: 0.78rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .kpi-change.positive { color: #10b981; }
        .kpi-change.negative { color: #ef4444; }

        /* Charts Row */
        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 1.5rem;
        }

        .chart-card h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }

        /* Filters Row */
        .filters-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: 0.4rem 1rem;
          border-radius: 999px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .filter-pill:hover {
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }

        .filter-pill.active {
          background: rgba(99, 102, 241, 0.12);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .filter-divider {
          width: 1px;
          height: 24px;
          background: var(--border-color);
        }

        /* Operations Table */
        .ops-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          overflow: hidden;
        }

        .ops-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .ops-card-header h3 {
          font-size: 1rem;
          font-weight: 600;
        }

        .low-stock-banner {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(245, 158, 11, 0.08));
          border: 1px solid rgba(239, 68, 68, 0.15);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .low-stock-banner-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .low-stock-banner h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fca5a5;
          margin-bottom: 0.15rem;
        }

        .low-stock-banner p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @keyframes dashFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-animate {
          animation: dashFadeIn 0.45s ease forwards;
        }

        @media (max-width: 1024px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .charts-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .dash-header h1 { font-size: 1.4rem; }
          .dash-header { margin-bottom: 1.25rem; }
          .kpi-grid { gap: 0.75rem; margin-bottom: 1.25rem; }
          .kpi-card { padding: 1rem; border-radius: 12px; }
          .kpi-value { font-size: 1.6rem; }
          .kpi-icon-wrap { width: 34px; height: 34px; border-radius: 8px; }
          .kpi-label { font-size: 0.7rem; }
          .chart-card { padding: 1rem; border-radius: 12px; }
          .chart-card h3 { font-size: 0.9rem; }
          .filters-row { gap: 0.5rem; }
          .filter-pill { padding: 0.3rem 0.75rem; font-size: 0.72rem; }
          .filter-divider { display: none; }
          .low-stock-banner { flex-direction: column; text-align: center; gap: 0.5rem; padding: 0.85rem; }
          .ops-card-header { padding: 1rem; }
          .ops-card-header h3 { font-size: 0.9rem; }
        }

        @media (max-width: 480px) {
          .kpi-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dash-animate">
        <div className="dash-header">
          <div>
            <h1>Inventory Overview</h1>
            <p>Welcome back. Here&#39;s a snapshot of your stock operations today.</p>
          </div>
        </div>

        {/* Low Stock Alert Banner */}
        {lowStockItems > 0 && (
          <div className="low-stock-banner">
            <div className="low-stock-banner-icon">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h4>{lowStockItems} item{lowStockItems > 1 ? 's' : ''} running low on stock</h4>
              <p>{outOfStock > 0 ? `${outOfStock} out of stock. ` : ''}Review reorder rules to prevent shortages.</p>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card kpi-blue">
            <div className="kpi-top">
              <span className="kpi-label">Total Products</span>
              <div className="kpi-icon-wrap kpi-icon-blue"><Package size={20} /></div>
            </div>
            <div className="kpi-value">{totalProducts}</div>
            <span className="kpi-change positive"><TrendingUp size={14} /> +2 this month</span>
          </div>

          <div className="kpi-card kpi-red">
            <div className="kpi-top">
              <span className="kpi-label">Low / Out of Stock</span>
              <div className="kpi-icon-wrap kpi-icon-red"><AlertTriangle size={20} /></div>
            </div>
            <div className="kpi-value">{lowStockItems}</div>
            <span className="kpi-change negative"><TrendingDown size={14} /> Needs attention</span>
          </div>

          <div className="kpi-card kpi-green">
            <div className="kpi-top">
              <span className="kpi-label">Pending Receipts</span>
              <div className="kpi-icon-wrap kpi-icon-green"><ArrowDownToLine size={20} /></div>
            </div>
            <div className="kpi-value">{pendingReceipts}</div>
            <span className="kpi-change positive">Awaiting validation</span>
          </div>

          <div className="kpi-card kpi-amber">
            <div className="kpi-top">
              <span className="kpi-label">Pending Deliveries</span>
              <div className="kpi-icon-wrap kpi-icon-amber"><ArrowUpFromLine size={20} /></div>
            </div>
            <div className="kpi-value">{pendingDeliveries}</div>
            <span className="kpi-change positive">Ready to ship</span>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-row">
          <div className="chart-card">
            <h3>Stock Levels by Product</h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '10px', fontSize: '0.82rem' }}
                  />
                  <Bar dataKey="stock" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Operations Breakdown</h3>
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '10px', fontSize: '0.82rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No operations yet</p>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'center' }}>
              {pieData.map((d, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], display: 'inline-block' }}></span>
                  {d.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filters-row">
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          {['All', 'Receipt', 'Delivery', 'Adjustment', 'Transfer'].map(t => (
            <button key={t} className={`filter-pill ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
              {t === 'All' ? 'All Types' : t + 's'}
            </button>
          ))}
          <div className="filter-divider"></div>
          {['All', 'Draft', 'Waiting', 'Ready', 'Done', 'Canceled'].map(s => (
            <button key={s} className={`filter-pill ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
              {s === 'All' ? 'All Status' : s}
            </button>
          ))}
        </div>

        {/* Recent Operations Table */}
        <div className="ops-card">
          <div className="ops-card-header">
            <h3>Recent Operations ({filteredOperations.length})</h3>
          </div>

          {filteredOperations.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No operations match the selected filters.
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0, overflowX: 'auto' }}>
              <table style={{ minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOperations.map(op => (
                    <tr key={op.id}>
                      <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{op.id}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          {op.type === 'Receipt' && <ArrowDownToLine size={14} style={{ color: '#10b981' }} />}
                          {op.type === 'Delivery' && <ArrowUpFromLine size={14} style={{ color: '#f59e0b' }} />}
                          {op.type === 'Adjustment' && <RefreshCw size={14} style={{ color: '#6366f1' }} />}
                          {op.type === 'Transfer' && <GitCommit size={14} style={{ color: '#3b82f6' }} />}
                          {op.type}
                        </span>
                      </td>
                      <td>{op.date}</td>
                      <td>{op.source}</td>
                      <td>{op.destination}</td>
                      <td>
                        <span className={`badge ${
                          op.status === 'Done' ? 'badge-success' :
                          op.status === 'Draft' ? 'badge-default' :
                          op.status === 'Ready' ? 'badge-info' : 'badge-warning'
                        }`}>
                          {op.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
