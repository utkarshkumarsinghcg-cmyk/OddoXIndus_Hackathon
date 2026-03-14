import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowDownToLine, ArrowUpFromLine, RefreshCw, GitCommit, Settings, User, History, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background: linear-gradient(180deg, var(--bg-secondary) 0%, #0d1b30 100%);
          border-right: 1px solid var(--border-color);
          height: 100vh;
          position: fixed;
          display: flex;
          flex-direction: column;
          z-index: 50;
          transition: transform var(--transition-smooth);
          overflow: hidden;
        }

        .sidebar-header {
          padding: 1.15rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .sidebar-logo-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 8px;
        }

        .sidebar-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
          flex: 1;
          min-width: 0;
        }

        .sidebar-brand-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: #e8edf5;
          letter-spacing: 0.04em;
        }

        .sidebar-brand-sub {
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--accent-primary);
          font-weight: 600;
          margin-top: 2px;
        }

        .sidebar-close-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: all var(--transition-fast);
        }
        .sidebar-close-btn:hover { color: var(--text-primary); background: var(--bg-hover); }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0.75rem;
        }

        .sidebar-section-title {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 0.5rem;
          margin-top: 1.5rem;
          padding-left: 0.75rem;
        }

        .sidebar-section-title:first-child { margin-top: 0; }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.85rem;
          transition: all var(--transition-fast);
          margin-bottom: 2px;
          position: relative;
        }

        .sidebar-link:hover {
          background-color: var(--bg-hover);
          color: var(--text-primary);
        }

        .sidebar-link.active {
          background: rgba(33, 150, 243, 0.1);
          color: var(--accent-primary);
        }

        .sidebar-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3px;
          background: var(--accent-primary);
          border-radius: 0 4px 4px 0;
        }

        .sidebar-footer {
          padding: 0.75rem;
          border-top: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .sidebar-close-btn { display: flex; }
          .sidebar {
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
          }
        }

        @media (max-width: 1024px) {
          .sidebar-link { font-size: 0.82rem; padding: 0.55rem 0.7rem; }
          .sidebar-section-title { font-size: 0.62rem; }
        }
      `}</style>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="WareNova" className="sidebar-logo-img" />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">WARENOVA</span>
            <span className="sidebar-brand-sub">Digital Solutions</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} title="Close Menu">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          <NavLink to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/products" className={`sidebar-link ${isActive('/products') ? 'active' : ''}`}>
            <Package size={18} /> Products
          </NavLink>

          <div className="sidebar-section-title">Operations</div>
          <NavLink to="/operations/receipts" className={`sidebar-link ${isActive('/operations/receipts') ? 'active' : ''}`}>
            <ArrowDownToLine size={18} /> Receipts
          </NavLink>
          <NavLink to="/operations/deliveries" className={`sidebar-link ${isActive('/operations/deliveries') ? 'active' : ''}`}>
            <ArrowUpFromLine size={18} /> Delivery Orders
          </NavLink>
          <NavLink to="/operations/adjustments" className={`sidebar-link ${isActive('/operations/adjustments') ? 'active' : ''}`}>
            <RefreshCw size={18} /> Adjustments
          </NavLink>
          <NavLink to="/operations/transfers" className={`sidebar-link ${isActive('/operations/transfers') ? 'active' : ''}`}>
            <GitCommit size={18} /> Internal Transfers
          </NavLink>
          <NavLink to="/operations/history" className={`sidebar-link ${isActive('/operations/history') ? 'active' : ''}`}>
            <History size={18} /> Move History
          </NavLink>

          <div className="sidebar-section-title">System</div>
          <NavLink to="/settings" className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}>
            <Settings size={18} /> Settings
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <NavLink to="/profile" className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}>
            <User size={18} /> Profile Menu
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
