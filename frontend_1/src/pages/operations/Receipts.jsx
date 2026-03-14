import React, { useState, useRef } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Plus, Search, List, Columns3, ArrowDownToLine, ArrowLeft, Printer, X, Check, ChevronRight, Trash2 } from 'lucide-react';

const STATUS_COLS = ['Draft', 'Ready', 'Done'];
const STATUS_COLORS = { Draft: '#8899b4', Waiting: '#f59e0b', Ready: '#2196F3', Done: '#10b981' };

const Receipts = () => {
  const { receipts, addReceipt, products, user } = useInventory();
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');

  // Detail view state
  const [showDetail, setShowDetail] = useState(false);
  const [detailMode, setDetailMode] = useState('new'); // 'new' or 'view'
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Form state for new/editing
  const [form, setForm] = useState({
    from: '', to: '', scheduleDate: '', responsible: '',
    status: 'Draft', items: [{ productId: '', name: '', quantity: '' }]
  });

  const filtered = receipts.filter(r =>
    r.reference.toLowerCase().includes(search.toLowerCase()) ||
    r.contact.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm({
      from: '', to: '', scheduleDate: '',
      responsible: user?.name || 'Inventory Manager',
      status: 'Draft',
      items: [{ productId: '', name: '', quantity: '' }]
    });
    setDetailMode('new');
    setActiveReceipt(null);
    setShowDetail(true);
  };

  const openExisting = (receipt) => {
    setForm({
      from: receipt.from, to: receipt.to,
      scheduleDate: receipt.scheduleDate,
      responsible: receipt.contact,
      status: receipt.status,
      items: receipt.items && receipt.items.length > 0
        ? receipt.items
        : [{ productId: '', name: '', quantity: '' }]
    });
    setDetailMode('view');
    setActiveReceipt(receipt);
    setShowDetail(true);
  };

  const handleSave = () => {
    const validItems = form.items.filter(i => i.productId || i.name);
    addReceipt({
      from: form.from, to: form.to,
      contact: form.responsible, scheduleDate: form.scheduleDate,
      status: form.status,
      items: validItems
    });
    setShowDetail(false);
  };

  const advanceStatus = () => {
    if (form.status === 'Draft') setForm({ ...form, status: 'Ready' });
    else if (form.status === 'Ready') setForm({ ...form, status: 'Done' });
  };

  const addItemRow = () => {
    setForm({ ...form, items: [...form.items, { productId: '', name: '', quantity: '' }] });
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...form.items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    // Auto-fill name if product selected
    if (field === 'productId' && value) {
      const prod = products.find(p => p.id === value);
      if (prod) newItems[idx].name = `[${prod.sku}] ${prod.name}`;
    }
    setForm({ ...form, items: newItems });
  };

  const removeItem = (idx) => {
    if (form.items.length <= 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  const handlePrint = () => {
    window.print();
  };

  const statusLabel = form.status === 'Draft' ? 'TODO' : form.status === 'Ready' ? 'Validate' : null;

  // ---------- DETAIL VIEW ----------
  if (showDetail) {
    return (
      <>
        <style>{`${detailStyles}`}</style>
        <div className="rcpt-detail-page rcpt-animate">
          {/* Top Bar */}
          <div className="rcpt-detail-topbar">
            <div className="rcpt-detail-topbar-left">
              <button className="rcpt-outline-btn" onClick={openNew}><Plus size={14} /> New</button>
              {form.status !== 'Done' && statusLabel && (
                <button className="rcpt-action-btn validate" onClick={advanceStatus}>
                  <Check size={14} /> {statusLabel}
                </button>
              )}
              <button className="rcpt-outline-btn" onClick={handlePrint} disabled={form.status !== 'Done'} style={form.status !== 'Done' ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                <Printer size={14} /> Print
              </button>
              <button className="rcpt-outline-btn cancel" onClick={() => setShowDetail(false)}>
                <X size={14} /> Cancel
              </button>
            </div>
            <div className="rcpt-status-stepper">
              {STATUS_COLS.map((s, i) => (
                <React.Fragment key={s}>
                  <span className={`rcpt-step ${form.status === s ? 'active' : STATUS_COLS.indexOf(form.status) > i ? 'completed' : ''}`}>
                    {s}
                  </span>
                  {i < STATUS_COLS.length - 1 && <ChevronRight size={14} className="rcpt-step-arrow" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="rcpt-detail-title">Receipt</h1>
          <div className="rcpt-detail-ref">{activeReceipt?.reference || 'New Receipt'}</div>

          {/* Form Fields */}
          <div className="rcpt-detail-card">
            <div className="rcpt-form-grid">
              <div className="rcpt-form-group">
                <label className="rcpt-label">Receive From</label>
                <input className="rcpt-input" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} placeholder="e.g. Vendor" />
              </div>
              <div className="rcpt-form-group">
                <label className="rcpt-label">Schedule Date</label>
                <input type="date" className="rcpt-input" value={form.scheduleDate} onChange={e => setForm({ ...form, scheduleDate: e.target.value })} />
              </div>
              <div className="rcpt-form-group">
                <label className="rcpt-label">To (Location)</label>
                <input className="rcpt-input" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} placeholder="e.g. WH/Stock1" />
              </div>
              <div className="rcpt-form-group">
                <label className="rcpt-label">Responsible</label>
                <input className="rcpt-input" value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })} placeholder="Auto-filled" />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="rcpt-detail-card">
            <h3 className="rcpt-section-title">Products</h3>
            <table className="rcpt-products-table">
              <thead>
                <tr>
                  <th style={{ width: '60%' }}>Product</th>
                  <th>Quantity</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <select className="rcpt-select" value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)}>
                        <option value="">Select product...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input type="number" className="rcpt-input" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} placeholder="0" />
                    </td>
                    <td>
                      <button className="rcpt-remove-btn" onClick={() => removeItem(idx)} title="Remove">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="rcpt-add-product-btn" onClick={addItemRow}><Plus size={14} /> New Product</button>
          </div>

          {/* Save Button (shown for new) */}
          {detailMode === 'new' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={handleSave}>Create Receipt</button>
            </div>
          )}
        </div>
      </>
    );
  }

  // ---------- LIST / KANBAN VIEW ----------
  return (
    <>
      <style>{`${listStyles}`}</style>
      <div className="ops-page ops-animate">
        <div className="ops-header">
          <div className="ops-header-left">
            <button className="ops-new-btn" onClick={openNew}><Plus size={16} /> NEW</button>
            <h1>Receipts</h1>
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
                <tr><th>Reference</th><th>From</th><th>To</th><th>Contact</th><th>Schedule Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No receipts found</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} onClick={() => openExisting(r)} style={{ cursor: 'pointer' }}>
                    <td><span className="ops-ref">{r.reference}</span></td>
                    <td>{r.from}</td><td>{r.to}</td><td>{r.contact}</td><td>{r.scheduleDate}</td>
                    <td><span className="ops-status-badge" style={{ background: `${STATUS_COLORS[r.status]}18`, color: STATUS_COLORS[r.status], border: `1px solid ${STATUS_COLORS[r.status]}33` }}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="kanban-board">
            {STATUS_COLS.map(status => {
              const items = filtered.filter(r => r.status === status);
              return (
                <div className="kanban-col" key={status}>
                  <div className="kanban-col-header" style={{ color: STATUS_COLORS[status] }}>{status} <span className="kanban-col-count">{items.length}</span></div>
                  {items.map(r => (
                    <div className="kanban-card" key={r.id} onClick={() => openExisting(r)} style={{ cursor: 'pointer' }}>
                      <div className="kanban-card-ref">{r.reference}</div>
                      <div className="kanban-card-info">{r.from} → {r.to}</div>
                      <div className="kanban-card-info">{r.contact} · {r.scheduleDate}</div>
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

// ---------- STYLES ----------
const detailStyles = `
  .rcpt-detail-page { max-width: 900px; }
  .rcpt-detail-page h1 { font-size: 1.75rem; font-weight: 700; }
  .rcpt-detail-topbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;
  }
  .rcpt-detail-topbar-left { display: flex; align-items: center; gap: 0.5rem; }
  .rcpt-outline-btn {
    padding: 0.4rem 0.85rem; border-radius: 7px;
    border: 1.5px solid var(--border-color); background: transparent;
    color: var(--text-secondary); font-weight: 600; font-size: 0.8rem;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .rcpt-outline-btn:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
  .rcpt-outline-btn.cancel:hover { border-color: var(--color-danger); color: var(--color-danger); }

  .rcpt-action-btn {
    padding: 0.4rem 0.85rem; border-radius: 7px; border: none;
    font-weight: 600; font-size: 0.8rem; cursor: pointer;
    font-family: inherit; transition: all 0.2s;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .rcpt-action-btn.validate {
    background: var(--accent-primary); color: white;
  }
  .rcpt-action-btn.validate:hover { background: #1976d2; }

  .rcpt-status-stepper {
    display: flex; align-items: center; gap: 0.3rem;
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    border-radius: 8px; padding: 0.45rem 0.85rem;
  }
  .rcpt-step {
    font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.04em; padding: 0.2rem 0.5rem; border-radius: 4px;
    color: var(--text-muted);
  }
  .rcpt-step.active {
    background: var(--accent-primary); color: white;
  }
  .rcpt-step.completed {
    background: rgba(16,185,129,0.15); color: #10b981;
  }
  .rcpt-step-arrow { color: var(--text-muted); }

  .rcpt-detail-title { margin-bottom: 0.15rem; }
  .rcpt-detail-ref {
    font-size: 1rem; font-weight: 600; color: var(--accent-primary);
    margin-bottom: 1.25rem;
  }

  .rcpt-detail-card {
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    border-radius: 14px; padding: 1.5rem; margin-bottom: 1.25rem;
  }

  .rcpt-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

  .rcpt-form-group { display: flex; flex-direction: column; }
  .rcpt-label {
    font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.04em; color: var(--text-muted); margin-bottom: 0.4rem;
  }
  .rcpt-input {
    padding: 0.55rem 0.75rem; border: 1px solid var(--border-color);
    border-radius: 8px; background: var(--bg-primary); color: var(--text-primary);
    font-family: inherit; font-size: 0.875rem; transition: border-color 0.2s;
  }
  .rcpt-input:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 2px rgba(33,150,243,0.12); }

  .rcpt-select {
    padding: 0.55rem 0.75rem; border: 1px solid var(--border-color);
    border-radius: 8px; background: var(--bg-primary); color: var(--text-primary);
    font-family: inherit; font-size: 0.875rem; width: 100%;
  }
  .rcpt-select:focus { outline: none; border-color: var(--accent-primary); }

  .rcpt-section-title {
    font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;
    color: var(--text-primary);
  }

  .rcpt-products-table { width: 100%; border-collapse: collapse; }
  .rcpt-products-table th {
    text-align: left; padding: 0.6rem 0.75rem; font-size: 0.72rem;
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--text-muted); border-bottom: 1px solid var(--border-color);
  }
  .rcpt-products-table td {
    padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border-color);
  }
  .rcpt-products-table tbody tr:last-child td { border-bottom: none; }

  .rcpt-remove-btn {
    background: transparent; border: none; color: var(--text-muted);
    cursor: pointer; padding: 0.25rem; border-radius: 4px;
    transition: color 0.15s;
  }
  .rcpt-remove-btn:hover { color: var(--color-danger); }

  .rcpt-add-product-btn {
    display: flex; align-items: center; gap: 0.35rem;
    margin-top: 0.75rem; padding: 0.4rem 0.75rem; border-radius: 6px;
    border: 1px dashed var(--border-color); background: transparent;
    color: var(--accent-primary); font-family: inherit; font-size: 0.8rem;
    font-weight: 600; cursor: pointer; transition: all 0.15s;
  }
  .rcpt-add-product-btn:hover { background: rgba(33,150,243,0.05); border-color: var(--accent-primary); }

  @keyframes rcptFade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); }}
  .rcpt-animate { animation: rcptFade 0.35s ease forwards; }

  @media (max-width: 768px) {
    .rcpt-detail-topbar { flex-direction: column; align-items: flex-start; }
    .rcpt-detail-topbar-left { flex-wrap: wrap; }
    .rcpt-form-grid { grid-template-columns: 1fr; }
    .rcpt-detail-card { padding: 1rem; border-radius: 12px; }
    .rcpt-outline-btn { padding: 0.35rem 0.65rem; font-size: 0.75rem; }
    .rcpt-status-stepper { padding: 0.35rem 0.6rem; }
    .rcpt-step { font-size: 0.65rem; padding: 0.15rem 0.35rem; }
    .rcpt-products-table { min-width: 400px; }
  }
`;

const listStyles = `
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
  .kanban-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .kanban-col { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; min-height: 300px; }
  .kanban-col-header { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
  .kanban-col-count { background: var(--bg-primary); font-size: 0.7rem; padding: 0.1rem 0.45rem; border-radius: 4px; }
  .kanban-card { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem; transition: transform 0.15s; }
  .kanban-card:hover { transform: translateY(-2px); }
  .kanban-card-ref { font-weight: 600; color: var(--accent-primary); font-size: 0.85rem; margin-bottom: 0.25rem; }
  .kanban-card-info { color: var(--text-muted); font-size: 0.75rem; }
  @keyframes opsFade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); }}
  .ops-animate { animation: opsFade 0.4s ease forwards; }

  @media (max-width: 768px) {
    .ops-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; }
    .ops-page h1 { font-size: 1.4rem; }
    .ops-search-bar { border-radius: 10px; padding: 0.6rem 0.75rem; }
    .ops-table-card { border-radius: 12px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .ops-table { min-width: 600px; }
    .ops-table th { padding: 0.55rem 0.85rem; }
    .ops-table td { padding: 0.65rem 0.85rem; font-size: 0.8rem; }
    .kanban-board { grid-template-columns: 1fr !important; }
    .kanban-col { min-height: auto; }
  }
`;

export default Receipts;
