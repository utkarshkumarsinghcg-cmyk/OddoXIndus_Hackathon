import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Plus, Search, Warehouse, MapPin, User, Maximize, Tag, Edit3, Save, X, Pencil, Filter, Trash2 } from 'lucide-react';

const Products = () => {
  const { products, warehouse, addProduct, updateStock, updateProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ costPerUnit: 0, stock: 0 });

  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', category: 'Raw Materials', uom: 'pcs', initialStock: 0, costPerUnit: 0
  });

  const handleSave = (e) => {
    e.preventDefault();
    addProduct(newProduct);
    setShowModal(false);
    setNewProduct({ name: '', sku: '', category: 'Raw Materials', uom: 'pcs', initialStock: 0, costPerUnit: 0 });
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditValues({ costPerUnit: product.costPerUnit, stock: product.stock });
  };

  const saveEdit = (id) => {
    updateStock(id, editValues.stock, editValues.costPerUnit);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.costPerUnit), 0);

  return (
    <>
      <style>{`
        .stock-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.75rem;
        }
        .stock-page-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .stock-page-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        /* Warehouse Info Card */
        .wh-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .wh-info {
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }

        .wh-primary {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .wh-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .wh-code {
          font-size: 0.7rem;
          background: rgba(33, 150, 243, 0.12);
          color: var(--accent-primary);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .wh-detail {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .wh-detail svg { flex-shrink: 0; }

        .wh-stats {
          display: flex;
          gap: 1.5rem;
        }

        .wh-stat {
          text-align: center;
          padding: 0.5rem 1rem;
          background: var(--bg-primary);
          border-radius: 10px;
          border: 1px solid var(--border-color);
          min-width: 100px;
        }

        .wh-stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .wh-stat-label {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          font-weight: 600;
          margin-top: 0.15rem;
        }

        /* Search & Filter Bar */
        .stock-search-bar {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .stock-search-wrapper {
          flex: 1;
          position: relative;
        }

        .stock-search-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .stock-search-input {
          width: 100%;
          padding: 0.6rem 0.85rem 0.6rem 2.5rem;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .stock-search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.15);
        }

        .stock-search-input::placeholder { color: var(--text-muted); }

        /* Stock Table */
        .stock-table-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          overflow: hidden;
        }

        .stock-table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .stock-table-header h3 {
          font-size: 1.05rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stock-table {
          width: 100%;
          border-collapse: collapse;
        }

        .stock-table th {
          background: var(--bg-primary);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          text-align: left;
        }

        .stock-table td {
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.875rem;
          color: var(--text-primary);
          vertical-align: middle;
        }

        .stock-table tbody tr {
          transition: background 0.15s;
        }

        .stock-table tbody tr:hover {
          background: rgba(33, 150, 243, 0.03);
        }

        .stock-table tbody tr:last-child td {
          border-bottom: none;
        }

        .stock-product-name {
          font-weight: 600;
        }

        .stock-product-sku {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .stock-cost {
          font-weight: 600;
          color: var(--text-primary);
        }

        .stock-cost-currency {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 1px;
        }

        .stock-on-hand {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .stock-free {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--color-success);
        }

        /* Inline edit input */
        .stock-edit-input {
          width: 90px;
          padding: 0.35rem 0.5rem;
          border: 1.5px solid var(--accent-primary);
          border-radius: 6px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          text-align: center;
        }

        .stock-edit-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
        }

        .stock-action-btns {
          display: flex;
          gap: 0.35rem;
        }

        .stock-action-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }

        .stock-action-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: rgba(33, 150, 243, 0.08);
        }

        .stock-action-btn.save-btn {
          border-color: var(--color-success);
          color: var(--color-success);
        }

        .stock-action-btn.save-btn:hover {
          background: rgba(16, 185, 129, 0.1);
        }

        .stock-action-btn.cancel-btn {
          border-color: var(--color-danger);
          color: var(--color-danger);
        }

        .stock-action-btn.cancel-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .stock-editing-row {
          background: rgba(33, 150, 243, 0.05) !important;
        }

        /* Status Badge */
        .stock-status {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .stock-status.in-stock { background: rgba(16, 185, 129, 0.1); color: var(--color-success); border: 1px solid rgba(16, 185, 129, 0.2); }
        .stock-status.low-stock { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); border: 1px solid rgba(245, 158, 11, 0.2); }
        .stock-status.out-of-stock { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); border: 1px solid rgba(239, 68, 68, 0.2); }

        @keyframes stockFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stock-animate { animation: stockFadeIn 0.4s ease forwards; }

        @media (max-width: 1024px) {
          .wh-kpis { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .stock-page-header { flex-direction: column; gap: 0.75rem; align-items: flex-start; }
          .stock-page-header h1 { font-size: 1.4rem; }
          .wh-card { border-radius: 12px; padding: 1rem; }
          .wh-info { flex-direction: column; gap: 0.75rem; }
          .wh-kpis { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
          .wh-kpi-card { padding: 0.75rem; border-radius: 8px; }
          .wh-kpi-value { font-size: 1.1rem; }
          .stock-table-card { border-radius: 12px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .stock-table { min-width: 700px; }
          .stock-table th { padding: 0.6rem 0.85rem; }
          .stock-table td { padding: 0.7rem 0.85rem; font-size: 0.8rem; }
          .stock-search-bar { border-radius: 10px; }
        }

        @media (max-width: 480px) {
          .wh-kpis { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="stock-animate">
        <div className="stock-page-header">
          <div>
            <h1>Stock Overview</h1>
            <p>Warehouse details, location & live stock levels</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Warehouse Info */}
        <div className="wh-card">
          <div className="wh-info">
            <div className="wh-primary">
              <div className="wh-name">
                <Warehouse size={20} style={{ color: 'var(--accent-primary)' }} />
                {warehouse.name}
                <span className="wh-code">{warehouse.code}</span>
              </div>
              <div className="wh-detail">
                <MapPin size={14} /> {warehouse.location}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
                <div className="wh-detail"><User size={14} /> {warehouse.manager}</div>
                <div className="wh-detail"><Maximize size={14} /> {warehouse.capacity}</div>
                <div className="wh-detail"><Tag size={14} /> {warehouse.type}</div>
              </div>
            </div>
          </div>
          <div className="wh-stats">
            <div className="wh-stat">
              <div className="wh-stat-value">{products.length}</div>
              <div className="wh-stat-label">Products</div>
            </div>
            <div className="wh-stat">
              <div className="wh-stat-value">{products.reduce((s, p) => s + p.stock, 0).toLocaleString()}</div>
              <div className="wh-stat-label">Total Units</div>
            </div>
            <div className="wh-stat">
              <div className="wh-stat-value" style={{ fontSize: '1rem' }}>&#8377;{totalStockValue.toLocaleString()}</div>
              <div className="wh-stat-label">Stock Value</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="stock-search-bar">
          <div className="stock-search-wrapper">
            <Search size={16} className="stock-search-icon" />
            <input
              type="text"
              className="stock-search-input"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary"><Filter size={16} /> Filters</button>
        </div>

        {/* Stock Table */}
        <div className="stock-table-card">
          <div className="stock-table-header">
            <h3>
              <Warehouse size={18} style={{ color: 'var(--accent-primary)' }} />
              Stock ({filteredProducts.length} items)
            </h3>
          </div>

          <table className="stock-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Per Unit Cost</th>
                <th>On Hand</th>
                <th>Reserved</th>
                <th>Free to Use</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className={editingId === product.id ? 'stock-editing-row' : ''}>
                  <td>
                    <div className="stock-product-name">{product.name}</div>
                    <div className="stock-product-sku">{product.sku} &middot; {product.category}</div>
                  </td>
                  <td>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        className="stock-edit-input"
                        value={editValues.costPerUnit}
                        onChange={(e) => setEditValues({ ...editValues, costPerUnit: e.target.value })}
                      />
                    ) : (
                      <span className="stock-cost">
                        &#8377;{product.costPerUnit.toLocaleString()}<span className="stock-cost-currency"> Rs</span>
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        className="stock-edit-input"
                        value={editValues.stock}
                        onChange={(e) => setEditValues({ ...editValues, stock: e.target.value })}
                      />
                    ) : (
                      <span className="stock-on-hand">{product.stock}</span>
                    )}
                  </td>
                  <td style={{ color: product.reserved > 0 ? 'var(--color-warning)' : 'var(--text-muted)' }}>
                    {product.reserved}
                  </td>
                  <td>
                    <span className="stock-free">{product.freeToUse}</span>
                  </td>
                  <td>
                    {product.stock > 100 ? (
                      <span className="stock-status in-stock">In Stock</span>
                    ) : product.stock > 0 ? (
                      <span className="stock-status low-stock">Low Stock</span>
                    ) : (
                      <span className="stock-status out-of-stock">Out of Stock</span>
                    )}
                  </td>
                  <td>
                    {editingId === product.id ? (
                      <div className="stock-action-btns">
                        <button className="stock-action-btn save-btn" onClick={() => saveEdit(product.id)} title="Save">
                          <Save size={14} />
                        </button>
                        <button className="stock-action-btn cancel-btn" onClick={cancelEdit} title="Cancel">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="stock-action-btns">
                        <button className="stock-action-btn" onClick={() => startEdit(product)} title="Edit stock">
                          <Pencil size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card animate-fade-in" style={{ width: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input required type="text" className="form-input" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">SKU / Code</label>
                <input required type="text" className="form-input" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                  <option>Raw Materials</option>
                  <option>Components</option>
                  <option>Finished Goods</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-select" value={newProduct.uom} onChange={e => setNewProduct({ ...newProduct, uom: e.target.value })}>
                    <option>pcs</option>
                    <option>kg</option>
                    <option>liters</option>
                    <option>boxes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Stock</label>
                  <input type="number" className="form-input" value={newProduct.initialStock} onChange={e => setNewProduct({ ...newProduct, initialStock: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Cost/Unit (₹)</label>
                  <input type="number" className="form-input" value={newProduct.costPerUnit} onChange={e => setNewProduct({ ...newProduct, costPerUnit: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
