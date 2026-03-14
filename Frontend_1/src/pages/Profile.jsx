import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useInventory();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted mt-2">Manage your account information</p>
        </div>
      </div>

      <div className="card max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <div className="text-muted flex items-center gap-2"><UserIcon size={16} /> {user?.role}</div>
            <div className="text-muted text-sm mt-1">{user?.email}</div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

        <div className="flex justify-end">
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
