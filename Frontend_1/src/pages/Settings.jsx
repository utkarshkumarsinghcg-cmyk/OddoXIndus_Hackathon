import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Warehouse, MapPin, Plus, Edit3, Trash2, Save, X, Building2 } from 'lucide-react';

const Settings = () => {
  const { warehouse, updateWarehouse, locations, addLocation, updateLocation, deleteLocation } = useInventory();
  const [editingWH, setEditingWH] = useState(false);
  const [whForm, setWhForm] = useState({ ...warehouse });
  const [showLocModal, setShowLocModal] = useState(false);
  const [editLocId, setEditLocId] = useState(null);
  const [locForm, setLocForm] = useState({ name: '', shortCode: '', warehouseCode: warehouse.code });

  const handleSaveWH = () => { updateWarehouse(whForm); setEditingWH(false); };
  const handleCancelWH = () => { setWhForm({ ...warehouse }); setEditingWH(false); };

  const openAddLoc = () => { setLocForm({ name: '', shortCode: '', warehouseCode: warehouse.code }); setEditLocId(null); setShowLocModal(true); };
  const openEditLoc = (loc) => { setLocForm({ name: loc.name, shortCode: loc.shortCode, warehouseCode: loc.warehouseCode }); setEditLocId(loc.id); setShowLocModal(true); };
  const handleSaveLoc = (e) => {
    e.preventDefault();
    if (editLocId) { updateLocation(editLocId, locForm); }
    else { addLocation(locForm); }
    setShowLocModal(false);
  };

  return (
    <>
      <style>{`
        .settings-page h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
        .settings-page > p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem; }

        .settings-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          margin-bottom: 1.75rem;
          overflow: hidden;
        }

        .settings-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .settings-section-header h2 {
          font-size: 1.1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .settings-section-body {
          padding: 1.5rem;
        }

        .wh-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .wh-form-grid .full-width { grid-column: 1 / -1; }

        .wh-field-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }

        .wh-field-value {
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 500;
          padding: 0.6rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .wh-field-input {
          width: 100%;
          padding: 0.6rem 0.85rem;
          background: var(--bg-primary);
          border: 1.5px solid var(--accent-primary);
          border-radius: 8px;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.9rem;
        }

        .wh-field-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.15);
        }

        .wh-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.25rem;
          justify-content: flex-end;
        }

        /* Location Table */
        .loc-table { width: 100%; border-collapse: collapse; }

        .loc-table th {
          background: var(--bg-primary);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.7rem 1.25rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .loc-table td {
          padding: 0.85rem 1.25rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .loc-table tbody tr { transition: background 0.15s; }
        .loc-table tbody tr:hover { background: rgba(33, 150, 243, 0.03); }
        .loc-table tbody tr:last-child td { border-bottom: none; }

        .loc-code-badge {
          background: rgba(33, 150, 243, 0.1);
          color: var(--accent-primary);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .loc-wh-badge {
          background: rgba(245, 158, 11, 0.1);
          color: var(--color-warning);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .loc-action-btns { display: flex; gap: 0.35rem; }

        .loc-action-btn {
          width: 30px; height: 30px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }

        .loc-action-btn:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
        .loc-action-btn.danger:hover { border-color: var(--color-danger); color: var(--color-danger); }

        .loc-empty {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        /* Modal */
        .settings-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 100;
          display: flex; align-items: center; justify-content: center;
        }

        @keyframes settingsFade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .settings-animate { animation: settingsFade 0.4s ease forwards; }

        @media (max-width: 768px) {
          .settings-page h1 { font-size: 1.4rem; }
          .settings-section { border-radius: 12px; }
          .settings-section-header { padding: 1rem; flex-wrap: wrap; gap: 0.5rem; }
          .settings-section-header h2 { font-size: 0.95rem; }
          .settings-section-body { padding: 1rem; }
          .wh-form-grid { grid-template-columns: 1fr; gap: 1rem; }
          .loc-table th { padding: 0.55rem 0.75rem; font-size: 0.68rem; }
          .loc-table td { padding: 0.65rem 0.75rem; font-size: 0.8rem; }
          .settings-modal-overlay { padding: 1rem; }
        }
      `}</style>

      <div className="settings-page settings-animate">
        <h1>Settings</h1>
        <p>Manage warehouse details and storage locations</p>

        {/* Warehouse Section */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h2><Warehouse size={20} style={{ color: 'var(--accent-primary)' }} /> Warehouse</h2>
            {!editingWH && (
              <button className="btn btn-secondary" onClick={() => { setWhForm({ ...warehouse }); setEditingWH(true); }}>
                <Edit3 size={15} /> Edit
              </button>
            )}
          </div>
          <div className="settings-section-body">
            <div className="wh-form-grid">
              <div>
                <span className="wh-field-label">Name</span>
                {editingWH ? (
                  <input className="wh-field-input" value={whForm.name} onChange={e => setWhForm({ ...whForm, name: e.target.value })} />
                ) : (
                  <div className="wh-field-value">{warehouse.name}</div>
                )}
              </div>
              <div>
                <span className="wh-field-label">Short Code</span>
                {editingWH ? (
                  <input className="wh-field-input" value={whForm.code} onChange={e => setWhForm({ ...whForm, code: e.target.value })} />
                ) : (
                  <div className="wh-field-value">{warehouse.code}</div>
                )}
              </div>
              <div className="full-width">
                <span className="wh-field-label">Address</span>
                {editingWH ? (
                  <input className="wh-field-input" value={whForm.address} onChange={e => setWhForm({ ...whForm, address: e.target.value })} />
                ) : (
                  <div className="wh-field-value">{warehouse.address}</div>
                )}
              </div>
            </div>
            {editingWH && (
              <div className="wh-actions">
                <button className="btn btn-secondary" onClick={handleCancelWH}><X size={15} /> Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveWH}><Save size={15} /> Save</button>
              </div>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h2><MapPin size={20} style={{ color: 'var(--accent-primary)' }} /> Locations</h2>
            <button className="btn btn-primary" onClick={openAddLoc}><Plus size={15} /> Add Location</button>
          </div>
          <p style={{ padding: '0.75rem 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            This holds the multiple locations of warehouse, rooms etc.
          </p>
          {locations.length === 0 ? (
            <div className="loc-empty">No locations added yet.</div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="loc-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Short Code</th>
                  <th>Warehouse</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(loc => (
                  <tr key={loc.id}>
                    <td style={{ fontWeight: 600 }}>{loc.name}</td>
                    <td><span className="loc-code-badge">{loc.shortCode}</span></td>
                    <td><span className="loc-wh-badge">{loc.warehouseCode}</span></td>
                    <td>
                      <div className="loc-action-btns">
                        <button className="loc-action-btn" onClick={() => openEditLoc(loc)} title="Edit"><Edit3 size={14} /></button>
                        <button className="loc-action-btn danger" onClick={() => deleteLocation(loc.id)} title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Location Modal */}
      {showLocModal && (
        <div className="settings-modal-overlay" onClick={() => setShowLocModal(false)}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '440px', margin: '0 1rem' }} onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editLocId ? 'Edit Location' : 'Add Location'}</h2>
            <form onSubmit={handleSaveLoc}>
              <div className="form-group">
                <label className="form-label">Location Name</label>
                <input required className="form-input" value={locForm.name} onChange={e => setLocForm({ ...locForm, name: e.target.value })} placeholder="e.g. Stock Room 1" />
              </div>
              <div className="form-group">
                <label className="form-label">Short Code</label>
                <input required className="form-input" value={locForm.shortCode} onChange={e => setLocForm({ ...locForm, shortCode: e.target.value })} placeholder="e.g. SR1" />
              </div>
              <div className="form-group">
                <label className="form-label">Warehouse</label>
                <input className="form-input" value={locForm.warehouseCode} onChange={e => setLocForm({ ...locForm, warehouseCode: e.target.value })} placeholder="WH" />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLocModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Save size={15} /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
