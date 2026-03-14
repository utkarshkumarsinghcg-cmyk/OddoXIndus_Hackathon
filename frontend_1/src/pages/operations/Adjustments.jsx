import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Plus, Search, List, Columns3, RefreshCw } from 'lucide-react';

const STATUS_COLS = ['Draft', 'Waiting', 'Ready', 'Done'];
const STATUS_COLORS = { Draft: '#8899b4', Waiting: '#f59e0b', Ready: '#2196F3', Done: '#10b981' };

const Adjustments = () => {
  const { products } = useInventory();
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const adjustments = [
    { id: 'a1', reference: 'WH/ADJ/0001', product: 'Steel Rods', date: '2026-03-12', counted: 1480, recorded: 1500, diff: -20, status: 'Done' },
    { id: 'a2', reference: 'WH/ADJ/0002', product: 'Aluminium Frames', date: '2026-03-13', counted: 48, recorded: 45, diff: 3, status: 'Ready' },
  ];

  const filtered = adjustments.filter(a =>
    a.reference.toLowerCase().includes(search.toLowerCase()) ||
    a.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        .ops-page h1 { font-size: 1.75rem; font-weight: 700; }
        .ops-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .ops-header-left { display: flex; align-items: center; gap: 1rem; }
        .ops-header-right { display: flex; align-items: center; gap: 0.5rem; }
        .ops-new-btn { padding: 0.5rem 1.1rem; border-radius: 8px; border: 1.5px solid var(--accent-primary); background: transparent; color: var(--accent-primary); font-weight: 600; font-size: 0.85rem; cursor: pointer; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem; }
        .ops-new-btn:hover { background: rgba(33,150,243,0.1); }
        .ops-view-btn { width: 34px; height: 34px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .ops-view-btn:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
        .ops-view-btn.active { background: var(--accent-primary); color: white; border-color: var(--accent-primary); }
        .ops-search-bar { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
        .ops-search-input { flex: 1; background: transparent; border: none; color: var(--text-primary); font-family: inherit; font-size: 0.875rem; outline: none; }
        .ops-search-input::placeholder { color: var(--text-muted); }
        .ops-table-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 14px; overflow: hidden; }
        .ops-table { width: 100%; border-collapse: collapse; }
        .ops-table th { background: var(--bg-primary); color: var(--text-muted); font-weight: 600; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.7rem 1.25rem; text-align: left; border-bottom: 1px solid var(--border-color); }
        .ops-table td { padding: 0.85rem 1.25rem; font-size: 0.875rem; border-bottom: 1px solid var(--border-color); color: var(--text-primary); }
        .ops-table tbody tr { transition: background 0.15s; }
        .ops-table tbody tr:hover { background: rgba(33,150,243,0.03); }
        .ops-table tbody tr:last-child td { border-bottom: none; }
        .ops-ref { font-weight: 600; color: var(--accent-primary); }
        .ops-status-badge { padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; display: inline-flex; align-items: center; }
        .adj-positive { color: #10b981; font-weight: 600; }
        .adj-negative { color: #ef4444; font-weight: 600; }
        @keyframes opsFade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); }}
        .ops-animate { animation: opsFade 0.4s ease forwards; }
      `}</style>

      <div className="ops-page ops-animate">
        <div className="ops-header">
          <div className="ops-header-left">
            <button className="ops-new-btn" onClick={() => setShowModal(true)}><Plus size={16} /> NEW</button>
            <h1>Adjustments</h1>
          </div>
          <div className="ops-header-right">
            <button className={`ops-view-btn active`}><List size={16} /></button>
          </div>
        </div>

        <div className="ops-search-bar">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input className="ops-search-input" placeholder="Search by reference or product..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="ops-table-card">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Product</th>
                <th>Date</th>
                <th>Recorded</th>
                <th>Counted</th>
                <th>Diff</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><span className="ops-ref">{a.reference}</span></td>
                  <td style={{ fontWeight: 500 }}>{a.product}</td>
                  <td>{a.date}</td>
                  <td>{a.recorded}</td>
                  <td>{a.counted}</td>
                  <td><span className={a.diff >= 0 ? 'adj-positive' : 'adj-negative'}>{a.diff >= 0 ? '+' : ''}{a.diff}</span></td>
                  <td>
                    <span className="ops-status-badge" style={{
                      background: `${STATUS_COLORS[a.status]}18`,
                      color: STATUS_COLORS[a.status],
                      border: `1px solid ${STATUS_COLORS[a.status]}33`
                    }}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Adjustments;
