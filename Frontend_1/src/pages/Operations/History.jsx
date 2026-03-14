import React, { useState, useEffect } from 'react';
import { fetchMoves, fetchProducts, fetchWarehouses } from '../../services/api';
import { Search, List, Columns3, ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react';

const STATUS_COLS = ['RECEIPT', 'DELIVERY', 'TRANSFER', 'ADJUSTMENT'];
const TYPE_COLORS = { RECEIPT: '#10b981', DELIVERY: '#ef4444', TRANSFER: '#2196F3', ADJUSTMENT: '#f59e0b' };

const MoveHistory = () => {
  const [moves, setMoves] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [movesData, prodData, whData] = await Promise.all([
        fetchMoves(),
        fetchProducts().catch(() => []),
        fetchWarehouses().catch(() => []),
      ]);
      setMoves(movesData);
      setProducts(prodData);
      setWarehouses(whData);
    } catch (err) {
      console.error('Failed to load move history:', err);
      setError('Failed to load move history. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getProductName = (id) => products.find(p => p.id === id)?.name || `#${id}`;
  const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || `#${id}`;

  const filtered = moves.filter(m => {
    const prodName = getProductName(m.product_id).toLowerCase();
    const whName = getWarehouseName(m.warehouse_id).toLowerCase();
    const type = (m.type || '').toLowerCase();
    const q = search.toLowerCase();
    return prodName.includes(q) || whName.includes(q) || type.includes(q) || String(m.id).includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
        <span className="ml-3 text-gray-500 font-medium">Loading move history...</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .ops-page h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
        .ops-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .ops-header-left { display: flex; align-items: center; gap: 1rem; }
        .ops-header-right { display: flex; align-items: center; gap: 0.5rem; }
        .ops-view-btn {
          width: 34px; height: 34px; border-radius: 6px;
          border: 1px solid var(--border-color, #e5e7eb); background: var(--bg-primary, #fff);
          color: var(--text-muted, #6b7280); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .ops-view-btn:hover { border-color: #06b6d4; color: #06b6d4; }
        .ops-view-btn.active { background: #06b6d4; color: white; border-color: #06b6d4; }
        .ops-search-bar {
          background: var(--bg-secondary, #f9fafb); border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 12px; padding: 0.75rem 1rem;
          margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;
        }
        .ops-search-input {
          flex: 1; background: transparent; border: none; color: var(--text-primary, #111827);
          font-family: inherit; font-size: 0.875rem; outline: none;
        }
        .ops-search-input::placeholder { color: var(--text-muted, #9ca3af); }
        .ops-table-card {
          background: var(--bg-secondary, #fff); border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 14px; overflow: hidden;
        }
        .ops-table { width: 100%; border-collapse: collapse; }
        .ops-table th {
          background: var(--bg-primary, #f9fafb); color: var(--text-muted, #6b7280);
          font-weight: 600; font-size: 0.72rem; text-transform: uppercase;
          letter-spacing: 0.06em; padding: 0.7rem 1.25rem; text-align: left;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }
        .ops-table td {
          padding: 0.85rem 1.25rem; font-size: 0.875rem;
          border-bottom: 1px solid var(--border-color, #e5e7eb); color: var(--text-primary, #111827);
        }
        .ops-table tbody tr { transition: background 0.15s; }
        .ops-table tbody tr:hover { background: rgba(6,182,212,0.03); }
        .ops-table tbody tr:last-child td { border-bottom: none; }

        .move-ref-in { font-weight: 600; color: #10b981; }
        .move-ref-out { font-weight: 600; color: #ef4444; }

        .move-dir-badge {
          display: inline-flex; align-items: center; gap: 0.3rem;
          padding: 0.15rem 0.5rem; border-radius: 4px;
          font-size: 0.72rem; font-weight: 600;
        }
        .move-dir-in { background: rgba(16,185,129,0.1); color: #10b981; }
        .move-dir-out { background: rgba(239,68,68,0.1); color: #ef4444; }

        .ops-status-badge {
          padding: 0.2rem 0.6rem; border-radius: 999px;
          font-size: 0.72rem; font-weight: 600;
          display: inline-flex; align-items: center;
        }
        .kanban-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .kanban-col {
          background: var(--bg-secondary, #f9fafb); border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 12px; padding: 1rem; min-height: 300px;
        }
        .kanban-col-header {
          font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 0.75rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .kanban-col-count { background: var(--bg-primary, #fff); font-size: 0.7rem; padding: 0.1rem 0.45rem; border-radius: 4px; }
        .kanban-card {
          background: var(--bg-primary, #fff); border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem;
          transition: transform 0.15s;
        }
        .kanban-card:hover { transform: translateY(-2px); }
        .kanban-card-ref { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.25rem; }
        .kanban-card-info { color: var(--text-muted, #6b7280); font-size: 0.75rem; }

        @keyframes opsFade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); }}
        .ops-animate { animation: opsFade 0.4s ease forwards; }

        @media (max-width: 1024px) {
          .kanban-board { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .ops-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; }
          .ops-page h1 { font-size: 1.4rem; }
          .ops-search-bar { border-radius: 10px; padding: 0.6rem 0.75rem; }
          .ops-table-card { border-radius: 12px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .ops-table { min-width: 650px; }
          .ops-table th { padding: 0.55rem 0.85rem; }
          .ops-table td { padding: 0.65rem 0.85rem; font-size: 0.8rem; }
          .kanban-board { grid-template-columns: 1fr !important; }
          .kanban-col { min-height: auto; }
        }
      `}</style>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-4">{error}</div>}

      <div className="ops-page ops-animate">
        <div className="ops-header">
          <div className="ops-header-left">
            <div>
              <h1>Move History / Ledger</h1>
              <p className="text-gray-500 text-sm mt-1">Track every stock change event across the organization.</p>
            </div>
          </div>
          <div className="ops-header-right">
            <button className={`ops-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="List View"><List size={16} /></button>
            <button className={`ops-view-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')} title="Kanban View"><Columns3 size={16} /></button>
          </div>
        </div>

        <div className="ops-search-bar">
          <Search size={16} style={{ color: 'var(--text-muted, #9ca3af)' }} />
          <input className="ops-search-input" placeholder="Search by product, warehouse, or type..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {view === 'list' ? (
          <div className="ops-table-card">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted, #9ca3af)', padding: '2rem' }}>No moves found</td></tr>
                ) : filtered.map(m => {
                  const isPositive = m.quantity > 0;
                  return (
                    <tr key={m.id}>
                      <td>
                        <span className={isPositive ? 'move-ref-in' : 'move-ref-out'}>
                          {isPositive ? <ArrowDownLeft size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} /> : <ArrowUpRight size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />}
                          #{m.id}
                        </span>
                      </td>
                      <td>
                        <span className="ops-status-badge" style={{
                          background: `${TYPE_COLORS[m.type] || '#6b7280'}18`,
                          color: TYPE_COLORS[m.type] || '#6b7280',
                          border: `1px solid ${TYPE_COLORS[m.type] || '#6b7280'}33`
                        }}>{m.type}</span>
                      </td>
                      <td>{getProductName(m.product_id)}</td>
                      <td>{getWarehouseName(m.warehouse_id)}</td>
                      <td>
                        <span className={`move-dir-badge ${isPositive ? 'move-dir-in' : 'move-dir-out'}`}>
                          {isPositive ? '+' : ''}{m.quantity}
                        </span>
                      </td>
                      <td>{new Date(m.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="kanban-board">
            {STATUS_COLS.map(type => {
              const items = filtered.filter(m => m.type === type);
              return (
                <div className="kanban-col" key={type}>
                  <div className="kanban-col-header" style={{ color: TYPE_COLORS[type] }}>
                    {type} <span className="kanban-col-count">{items.length}</span>
                  </div>
                  {items.map(m => (
                    <div className="kanban-card" key={m.id}>
                      <div className={`kanban-card-ref ${m.quantity > 0 ? 'move-ref-in' : 'move-ref-out'}`}>#{m.id}</div>
                      <div className="kanban-card-info">{getProductName(m.product_id)}</div>
                      <div className="kanban-card-info">{getWarehouseName(m.warehouse_id)} · Qty: {m.quantity}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MoveHistory;
