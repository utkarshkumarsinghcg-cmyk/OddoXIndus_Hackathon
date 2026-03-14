import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Plus, Search, List, Columns3, ArrowUpFromLine, Printer, X, Check, ChevronRight, Trash2, AlertTriangle } from 'lucide-react';

const STATUS_COLS = ['Draft', 'Waiting', 'Ready', 'Done'];
const STATUS_COLORS = { Draft: '#8899b4', Waiting: '#f59e0b', Ready: '#2196F3', Done: '#10b981' };
const OP_TYPES = ['Delivery Orders', 'Internal Transfer', 'Dropship'];

const Deliveries = () => {
  const { deliveries, addDelivery, products, user } = useInventory();
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');

  // Detail view state
  const [showDetail, setShowDetail] = useState(false);
  const [detailMode, setDetailMode] = useState('new');
  const [activeDelivery, setActiveDelivery] = useState(null);

  const [form, setForm] = useState({
    deliveryAddress: '', scheduleDate: '', responsible: '',
    operationType: 'Delivery Orders', status: 'Draft',
    items: [{ productId: '', name: '', quantity: '' }]
  });

  const filtered = deliveries.filter(d =>
    d.reference.toLowerCase().includes(search.toLowerCase()) ||
    d.contact.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm({
      deliveryAddress: '', scheduleDate: '',
      responsible: user?.name || 'Inventory Manager',
      operationType: 'Delivery Orders', status: 'Draft',
      items: [{ productId: '', name: '', quantity: '' }]
    });
    setDetailMode('new');
    setActiveDelivery(null);
    setShowDetail(true);
  };

  const openExisting = (delivery) => {
    setForm({
      deliveryAddress: delivery.to || '', scheduleDate: delivery.scheduleDate,
      responsible: delivery.contact,
      operationType: 'Delivery Orders', status: delivery.status,
      items: delivery.items && delivery.items.length > 0
        ? delivery.items
        : [{ productId: '', name: '', quantity: '' }]
    });
    setDetailMode('view');
    setActiveDelivery(delivery);
    setShowDetail(true);
  };

  const handleSave = () => {
    const validItems = form.items.filter(i => i.productId || i.name);
    addDelivery({
      from: 'WH/Stock1', to: form.deliveryAddress,
      contact: form.responsible, scheduleDate: form.scheduleDate,
      status: form.status, items: validItems
    });
    setShowDetail(false);
  };

  const advanceStatus = () => {
    const order = STATUS_COLS;
    const idx = order.indexOf(form.status);
    if (idx < order.length - 1) setForm({ ...form, status: order[idx + 1] });
  };

  const addItemRow = () => {
    setForm({ ...form, items: [...form.items, { productId: '', name: '', quantity: '' }] });
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...form.items];
    newItems[idx] = { ...newItems[idx], [field]: value };
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

  const isOutOfStock = (productId) => {
    if (!productId) return false;
    const prod = products.find(p => p.id === productId);
    return prod && prod.stock <= 0;
  };

  const statusLabel = form.status === 'Draft' ? 'TODO' : form.status !== 'Done' ? 'Validate' : null;

  // ---------- DETAIL VIEW ----------
  if (showDetail) {
    return (
      <>
        <style>{`${detailStyles}`}</style>
        <div className="del-detail-page del-animate">
          {/* Top Bar */}
          <div className="del-detail-topbar">
            <div className="del-detail-topbar-left">
              <button className="del-outline-btn" onClick={openNew}><Plus size={14} /> New</button>
              {form.status !== 'Done' && statusLabel && (
                <button className="del-action-btn validate" onClick={advanceStatus}>
                  <Check size={14} /> {statusLabel}
                </button>
              )}
              <button className="del-outline-btn" onClick={() => window.print()} disabled={form.status !== 'Done'} style={form.status !== 'Done' ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                <Printer size={14} /> Print
              </button>
              <button className="del-outline-btn cancel" onClick={() => setShowDetail(false)}>
                <X size={14} /> Cancel
              </button>
            </div>
            <div className="del-status-stepper">
              {STATUS_COLS.map((s, i) => (
                <React.Fragment key={s}>
                  <span className={`del-step ${form.status === s ? 'active' : STATUS_COLS.indexOf(form.status) > i ? 'completed' : ''}`}>
                    {s}
                  </span>
                  {i < STATUS_COLS.length - 1 && <ChevronRight size={14} className="del-step-arrow" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="del-detail-title">Delivery</h1>
          <div className="del-detail-ref">{activeDelivery?.reference || 'New Delivery'}</div>

          {/* Form Fields */}
          <div className="del-detail-card">
            <div className="del-form-grid">
              <div className="del-form-group">
                <label className="del-label">Delivery Address</label>
                <input className="del-input" value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })} placeholder="e.g. Vendor / Customer" />
              </div>
              <div className="del-form-group">
                <label className="del-label">Schedule Date</label>
                <input type="date" className="del-input" value={form.scheduleDate} onChange={e => setForm({ ...form, scheduleDate: e.target.value })} />
              </div>
              <div className="del-form-group">
                <label className="del-label">Responsible</label>
                <input className="del-input" value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })} placeholder="Auto-filled" />
              </div>
              <div className="del-form-group">
                <label className="del-label">Operation Type</label>
                <select className="del-select" value={form.operationType} onChange={e => setForm({ ...form, operationType: e.target.value })}>
                  {OP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="del-detail-card">
            <h3 className="del-section-title">Products</h3>
            {/* Out of stock notification */}
            {form.items.some(i => isOutOfStock(i.productId)) && (
              <div className="del-oos-alert">
                <AlertTriangle size={16} /> Some products are out of stock. The order will stay in <strong>Waiting</strong> until restocked.
              </div>
            )}
            <table className="del-products-table">
              <thead>
                <tr>
                  <th style={{ width: '60%' }}>Product</th>
                  <th>Quantity</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, idx) => {
                  const oos = isOutOfStock(item.productId);
                  return (
                    <tr key={idx} className={oos ? 'del-oos-row' : ''}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select className="del-select" value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)} style={oos ? { borderColor: 'var(--color-danger)' } : {}}>
                            <option value="">Select product...</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
                            ))}
                          </select>
                          {oos && <AlertTriangle size={14} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />}
                        </div>
                      </td>
                      <td>
                        <input type="number" className="del-input" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} placeholder="0" style={oos ? { borderColor: 'var(--color-danger)' } : {}} />
                      </td>
                      <td>
                        <button className="del-remove-btn" onClick={() => removeItem(idx)} title="Remove">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button className="del-add-product-btn" onClick={addItemRow}><Plus size={14} /> New Product</button>
            <div className="del-add-new-link" onClick={addItemRow}>Add New product</div>
          </div>

          {detailMode === 'new' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={handleSave}>Create Delivery</button>
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
            <h1>Delivery</h1>
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
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No delivery orders found</td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id} onClick={() => openExisting(d)} style={{ cursor: 'pointer' }}>
                    <td><span className="ops-ref">{d.reference}</span></td>
                    <td>{d.from}</td><td>{d.to}</td><td>{d.contact}</td><td>{d.scheduleDate}</td>
                    <td><span className="ops-status-badge" style={{ background: `${STATUS_COLORS[d.status]}18`, color: STATUS_COLORS[d.status], border: `1px solid ${STATUS_COLORS[d.status]}33` }}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="kanban-board">
            {STATUS_COLS.map(status => {
              const items = filtered.filter(d => d.status === status);
              return (
                <div className="kanban-col" key={status}>
                  <div className="kanban-col-header" style={{ color: STATUS_COLORS[status] }}>{status} <span className="kanban-col-count">{items.length}</span></div>
                  {items.map(d => (
                    <div className="kanban-card" key={d.id} onClick={() => openExisting(d)} style={{ cursor: 'pointer' }}>
                      <div className="kanban-card-ref">{d.reference}</div>
                      <div className="kanban-card-info">{d.from} → {d.to}</div>
                      <div className="kanban-card-info">{d.contact} · {d.scheduleDate}</div>
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
  .del-detail-page { max-width: 900px; }
  .del-detail-page h1 { font-size: 1.75rem; font-weight: 700; }
  .del-detail-topbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;
  }
  .del-detail-topbar-left { display: flex; align-items: center; gap: 0.5rem; }
  .del-outline-btn {
    padding: 0.4rem 0.85rem; border-radius: 7px;
    border: 1.5px solid var(--border-color); background: transparent;
    color: var(--text-secondary); font-weight: 600; font-size: 0.8rem;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .del-outline-btn:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
  .del-outline-btn.cancel:hover { border-color: var(--color-danger); color: var(--color-danger); }

  .del-action-btn {
    padding: 0.4rem 0.85rem; border-radius: 7px; border: none;
    font-weight: 600; font-size: 0.8rem; cursor: pointer;
    font-family: inherit; transition: all 0.2s;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .del-action-btn.validate { background: var(--accent-primary); color: white; }
  .del-action-btn.validate:hover { background: #1976d2; }

  .del-status-stepper {
    display: flex; align-items: center; gap: 0.3rem;
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    border-radius: 8px; padding: 0.45rem 0.85rem;
  }
  .del-step {
    font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.04em; padding: 0.2rem 0.5rem; border-radius: 4px;
    color: var(--text-muted);
  }
  .del-step.active { background: var(--accent-primary); color: white; }
  .del-step.completed { background: rgba(16,185,129,0.15); color: #10b981; }
  .del-step-arrow { color: var(--text-muted); }

  .del-detail-title { margin-bottom: 0.15rem; }
  .del-detail-ref {
    font-size: 1rem; font-weight: 600; color: var(--accent-primary);
    margin-bottom: 1.25rem;
  }

  .del-detail-card {
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    border-radius: 14px; padding: 1.5rem; margin-bottom: 1.25rem;
  }
  .del-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .del-form-group { display: flex; flex-direction: column; }
  .del-label {
    font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.04em; color: var(--text-muted); margin-bottom: 0.4rem;
  }
  .del-input {
    padding: 0.55rem 0.75rem; border: 1px solid var(--border-color);
    border-radius: 8px; background: var(--bg-primary); color: var(--text-primary);
    font-family: inherit; font-size: 0.875rem; transition: border-color 0.2s;
  }
  .del-input:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 2px rgba(33,150,243,0.12); }
  .del-select {
    padding: 0.55rem 0.75rem; border: 1px solid var(--border-color);
    border-radius: 8px; background: var(--bg-primary); color: var(--text-primary);
    font-family: inherit; font-size: 0.875rem; width: 100%;
  }
  .del-select:focus { outline: none; border-color: var(--accent-primary); }

  .del-section-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem; }

  .del-oos-alert {
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px; padding: 0.6rem 1rem;
    color: var(--color-danger); font-size: 0.82rem; font-weight: 500;
    margin-bottom: 0.75rem;
  }

  .del-products-table { width: 100%; border-collapse: collapse; }
  .del-products-table th {
    text-align: left; padding: 0.6rem 0.75rem; font-size: 0.72rem;
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--text-muted); border-bottom: 1px solid var(--border-color);
  }
  .del-products-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border-color); }
  .del-products-table tbody tr:last-child td { border-bottom: none; }

  .del-oos-row {
    background: rgba(239,68,68,0.04) !important;
  }
  .del-oos-row td { border-bottom-color: rgba(239,68,68,0.15) !important; }

  .del-remove-btn {
    background: transparent; border: none; color: var(--text-muted);
    cursor: pointer; padding: 0.25rem; border-radius: 4px; transition: color 0.15s;
  }
  .del-remove-btn:hover { color: var(--color-danger); }

  .del-add-product-btn {
    display: flex; align-items: center; gap: 0.35rem;
    margin-top: 0.75rem; padding: 0.4rem 0.75rem; border-radius: 6px;
    border: 1px dashed var(--border-color); background: transparent;
    color: var(--accent-primary); font-family: inherit; font-size: 0.8rem;
    font-weight: 600; cursor: pointer; transition: all 0.15s;
  }
  .del-add-product-btn:hover { background: rgba(33,150,243,0.05); border-color: var(--accent-primary); }

  .del-add-new-link {
    margin-top: 0.5rem; color: var(--accent-primary); font-size: 0.8rem;
    font-weight: 500; cursor: pointer; transition: opacity 0.15s;
  }
  .del-add-new-link:hover { opacity: 0.8; text-decoration: underline; }

  @keyframes delFade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); }}
  .del-animate { animation: delFade 0.35s ease forwards; }

  @media (max-width: 768px) {
    .del-detail-topbar { flex-direction: column; align-items: flex-start; }
    .del-detail-topbar-left { flex-wrap: wrap; }
    .del-form-grid { grid-template-columns: 1fr; }
    .del-detail-card { padding: 1rem; border-radius: 12px; }
    .del-outline-btn { padding: 0.35rem 0.65rem; font-size: 0.75rem; }
    .del-status-stepper { padding: 0.35rem 0.6rem; }
    .del-step { font-size: 0.65rem; padding: 0.15rem 0.35rem; }
    .del-products-table { min-width: 400px; }
    .del-oos-alert { font-size: 0.75rem; padding: 0.5rem 0.75rem; }
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
  .kanban-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .kanban-col { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; min-height: 300px; }
  .kanban-col-header { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
  .kanban-col-count { background: var(--bg-primary); font-size: 0.7rem; padding: 0.1rem 0.45rem; border-radius: 4px; }
  .kanban-card { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem; transition: transform 0.15s; }
  .kanban-card:hover { transform: translateY(-2px); }
  .kanban-card-ref { font-weight: 600; color: var(--accent-primary); font-size: 0.85rem; margin-bottom: 0.25rem; }
  .kanban-card-info { color: var(--text-muted); font-size: 0.75rem; }
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
    .ops-table { min-width: 600px; }
    .ops-table th { padding: 0.55rem 0.85rem; }
    .ops-table td { padding: 0.65rem 0.85rem; font-size: 0.8rem; }
    .kanban-board { grid-template-columns: 1fr !important; }
    .kanban-col { min-height: auto; }
  }
`;

export default Deliveries;
