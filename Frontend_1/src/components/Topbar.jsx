import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Search, Bell, Menu } from 'lucide-react';

const Topbar = ({ onMenuToggle }) => {
  const { user } = useInventory();

  return (
    <>
      <style>{`
        .topbar {
          height: var(--topbar-height);
          background: rgba(17, 34, 64, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 40;
          gap: 1rem;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
          max-width: 550px;
        }

        .topbar-menu-btn {
          background: none;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        .topbar-menu-btn:hover { background: var(--bg-hover); color: var(--text-primary); border-color: var(--text-muted); }

        .topbar-search {
          position: relative;
          flex: 1;
          min-width: 0;
        }
        .topbar-search-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0.85rem;
          color: var(--text-muted);
          display: flex;
          pointer-events: none;
        }
        .topbar-search-input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          border-radius: 999px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.82rem;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .topbar-search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
        }
        .topbar-search-input::placeholder { color: var(--text-muted); }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .topbar-bell-btn {
          background: none;
          border: 1px solid var(--border-color);
          cursor: pointer;
          color: var(--text-secondary);
          padding: 0.4rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all var(--transition-fast);
        }
        .topbar-bell-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

        .topbar-bell-dot {
          position: absolute;
          top: 3px; right: 4px;
          width: 7px; height: 7px;
          background: var(--color-danger);
          border-radius: 50%;
          border: 1.5px solid var(--bg-secondary);
        }

        .topbar-divider {
          width: 1px;
          height: 28px;
          background: var(--border-color);
        }

        .topbar-user {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: default;
        }

        .topbar-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1976D2, #42a5f5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .topbar-user-info { min-width: 0; }
        .topbar-user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .topbar-user-role {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        @media (min-width: 769px) {
          .topbar-menu-btn { display: none; }
        }

        @media (max-width: 768px) {
          .topbar { padding: 0 0.75rem; }
          .topbar-search-input { font-size: 0.78rem; }
          .topbar-divider { display: none; }
          .topbar-user-info { display: none; }
        }

        @media (max-width: 480px) {
          .topbar-search { display: none; }
        }
      `}</style>

      <div className="topbar">
        <div className="topbar-left">
          <button className="topbar-menu-btn" onClick={onMenuToggle} title="Toggle Menu">
            <Menu size={20} />
          </button>
          <div className="topbar-search">
            <span className="topbar-search-icon"><Search size={15} /></span>
            <input
              type="text"
              className="topbar-search-input"
              placeholder="Search SKUs, Receipts, Deliveries..."
            />
          </div>
        </div>

        <div className="topbar-right">
          <button className="topbar-bell-btn" title="Notifications">
            <Bell size={18} />
            <span className="topbar-bell-dot" />
          </button>
          <div className="topbar-divider" />
          <div className="topbar-user">
            <div className="topbar-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="topbar-user-info">
              <div className="topbar-user-name">{user?.name || 'User'}</div>
              <div className="topbar-user-role">{user?.role || 'Staff'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
