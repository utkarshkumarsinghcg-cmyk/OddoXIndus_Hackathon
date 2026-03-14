import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Plus, Search, List, GitCommit } from 'lucide-react';

const STATUS_COLORS = { Draft: '#8899b4', Waiting: '#f59e0b', Ready: '#2196F3', Done: '#10b981' };

const Transfers = () => {
  const [search, setSearch] = useState('');

  const transfers = [
    { id: 't1', reference: 'WH/INT/0001', from: 'Stock Room 1', to: 'Rack A', product: 'Steel Rods', quantity: 200, date: '2026-03-12', status: 'Done' },
    { id: 't2', reference: 'WH/INT/0002', from: 'Stock Room 2', to: 'Production Floor', product: 'Aluminium Frames', quantity: 15, date: '2026-03-13', status: 'Ready' },
  ];

  const filtered = transfers.filter(t =>
    t.reference.toLowerCase().includes(search.toLowerCase()) ||
    t.product.toLowerCase().includes(search.toLowerCase())
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
        @keyframes opsFade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); }}
        .ops-animate { animation: opsFade 0.4s ease forwards; }
      `}</style>

      <div className="ops-page ops-animate">
        <div className="ops-header">
          <div className="ops-header-left">
            <button className="ops-new-btn"><Plus size={16} /> NEW</button>
            <h1>Internal Transfers</h1>
          </div>
          <div className="ops-header-right">
            <button className="ops-view-btn active"><List size={16} /></button>
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
                <th>From</th>
                <th>To</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td><span className="ops-ref">{t.reference}</span></td>
                  <td>{t.from}</td>
                  <td>{t.to}</td>
                  <td style={{ fontWeight: 500 }}>{t.product}</td>
                  <td>{t.quantity}</td>
                  <td>{t.date}</td>
                  <td>
                    <span className="ops-status-badge" style={{
                      background: `${STATUS_COLORS[t.status]}18`,
                      color: STATUS_COLORS[t.status],
                      border: `1px solid ${STATUS_COLORS[t.status]}33`
                    }}>{t.status}</span>
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

export default Transfers;
