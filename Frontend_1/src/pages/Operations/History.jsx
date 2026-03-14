import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Plus, Search, List, Columns3, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const STATUS_COLS = ['Draft', 'Waiting', 'Ready', 'Done'];
const STATUS_COLORS = { Draft: '#8899b4', Waiting: '#f59e0b', Ready: '#2196F3', Done: '#10b981' };

const MoveHistory = () => {
  const { moveHistory, addMove } = useInventory();
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ reference: '', date: '', contact: '', from: '', to: '', quantity: '', status: 'Draft', direction: 'IN' });

  const filtered = moveHistory.filter(m =>
    m.reference.toLowerCase().includes(search.toLowerCase()) ||
    m.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    addMove({ ...form, quantity: Number(form.quantity) });
    setShowModal(false);
    setForm({ reference: '', date: '', contact: '', from: '', to: '', quantity: '', status: 'Draft', direction: 'IN' });
  };

  return (
    <>
      <style>{`
        .ops-page h1 { font-size: 1.75rem; font-weight: 700; }
        .ops-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .ops-header-left { display: flex; align-items: center; gap: 1rem; }
        .ops-header-right { display: flex; align-items: center; gap: 0.5rem; }
        .ops-new-btn {
          padding: 0.5rem 1.1rem; border-radius: 8px;
          border: 1.5px solid var(--accent-primary); background: transparent;
          color: var(--accent-primary); font-weight: 600; font-size: 0.85rem;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .ops-new-btn:hover { background: rgba(33,150,243,0.1); }
        .ops-view-btn {
          width: 34px; height: 34px; border-radius: 6px;
          border: 1px solid var(--border-color); background: var(--bg-primary);
          color: var(--text-muted); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .ops-view-btn:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
        .ops-view-btn.active { background: var(--accent-primary); color: white; border-color: var(--accent-primary); }
        .ops-search-bar {
          background: var(--bg-secondary); border: 1px solid var(--border-color);
          border-radius: 12px; padding: 0.75rem 1rem;
          margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;
        }
        .ops-search-input {
          flex: 1; background: transparent; border: none; color: var(--text-primary);
          font-family: inherit; font-size: 0.875rem; outline: none;
        }
        .ops-search-input::placeholder { color: var(--text-muted); }
        .ops-table-card {
          background: var(--bg-secondary); border: 1px solid var(--border-color);
          border-radius: 14px; overflow: hidden;
        }
        .ops-table { width: 100%; border-collapse: collapse; }
        .ops-table th {
          background: var(--bg-primary); color: var(--text-muted);
          font-weight: 600; font-size: 0.72rem; text-transform: uppercase;
          letter-spacing: 0.06em; padding: 0.7rem 1.25rem; text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        .ops-table td {
          padding: 0.85rem 1.25rem; font-size: 0.875rem;
          border-bottom: 1px solid var(--border-color); color: var(--text-primary);
        }
        .ops-table tbody tr { transition: background 0.15s; }
        .ops-table tbody tr:hover { background: rgba(33,150,243,0.03); }
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
          background: var(--bg-secondary); border: 1px solid var(--border-color);
          border-radius: 12px; padding: 1rem; min-height: 300px;
        }
        .kanban-col-header {
          font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 0.75rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .kanban-col-count { background: var(--bg-primary); font-size: 0.7rem; padding: 0.1rem 0.45rem; border-radius: 4px; }
        .kanban-card {
          background: var(--bg-primary); border: 1px solid var(--border-color);
          border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem;
          transition: transform 0.15s;
        }
        .kanban-card:hover { transform: translateY(-2px); }
        .kanban-card-ref { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.25rem; }
        .kanban-card-info { color: var(--text-muted); font-size: 0.75rem; }
        .ops-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6); z-index: 100;
          display: flex; align-items: center; justify-content: center;
        }
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
          .ops-modal-overlay { padding: 1rem; }
        }
      `}</style>

      <div className="ops-page ops-animate">
        <div className="ops-header">
          <div className="ops-header-left">
            <button className="ops-new-btn" onClick={() => setShowModal(true)}><Plus size={16} /> NEW</button>
            <h1>Move History</h1>
          </div>
          <div className="ops-header-right">
            <button className={`ops-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="List View"><List size={16} /></button>
            <button className={`ops-view-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')} title="Kanban View"><Columns3 size={16} /></button>
          </div>
        </div>

        <div className="ops-search-bar">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input className="ops-search-input" placeholder="Search by reference or contact..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {view === 'list' ? (
          <div className="ops-table-card">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Contact</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No moves found</td></tr>
                ) : filtered.map(m => (
                  <tr key={m.id}>
                    <td>
                      <span className={m.direction === 'IN' ? 'move-ref-in' : 'move-ref-out'}>
                        {m.direction === 'IN' ? <ArrowDownLeft size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} /> : <ArrowUpRight size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />}
                        {m.reference}
                      </span>
                    </td>
                    <td>{m.date}</td>
                    <td>{m.contact}</td>
                    <td>{m.from}</td>
                    <td>{m.to}</td>
                    <td><span className={`move-dir-badge ${m.direction === 'IN' ? 'move-dir-in' : 'move-dir-out'}`}>{m.direction === 'IN' ? '+' : '-'}{m.quantity}</span></td>
                    <td>
                      <span className="ops-status-badge" style={{
                        background: `${STATUS_COLORS[m.status]}18`,
                        color: STATUS_COLORS[m.status],
                        border: `1px solid ${STATUS_COLORS[m.status]}33`
                      }}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="kanban-board">
            {STATUS_COLS.map(status => {
              const items = filtered.filter(m => m.status === status);
              return (
                <div className="kanban-col" key={status}>
                  <div className="kanban-col-header" style={{ color: STATUS_COLORS[status] }}>
                    {status} <span className="kanban-col-count">{items.length}</span>
                  </div>
                  {items.map(m => (
                    <div className="kanban-card" key={m.id}>
                      <div className={`kanban-card-ref ${m.direction === 'IN' ? 'move-ref-in' : 'move-ref-out'}`}>{m.reference}</div>
                      <div className="kanban-card-info">{m.from} → {m.to}</div>
                      <div className="kanban-card-info">{m.contact} · Qty: {m.quantity}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="ops-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '520px', margin: '0 1rem' }} onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4"><History size={20} style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }} /> New Move</h2>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Reference</label>
                  <input required className="form-input" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} placeholder="e.g. WH/IN/0004" />
                </div>
                <div className="form-group">
                  <label className="form-label">Direction</label>
                  <select className="form-select" value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })}>
                    <option value="IN">IN (Receipt)</option>
                    <option value="OUT">OUT (Delivery)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">From</label>
                  <input required className="form-input" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} placeholder="e.g. Vendor" />
                </div>
                <div className="form-group">
                  <label className="form-label">To</label>
                  <input required className="form-input" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} placeholder="e.g. WH/Stock1" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Contact</label>
                  <input required className="form-input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Company name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" required className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input type="number" required className="form-input" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="0" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Draft</option><option>Waiting</option><option>Ready</option><option>Done</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Move</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MoveHistory;
