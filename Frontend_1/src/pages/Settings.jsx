import React, { useState, useEffect } from 'react';
import { fetchWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../services/api';
import { Warehouse, MapPin, Plus, Edit3, Trash2, X, Building2 } from 'lucide-react';


const Settings = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create / Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', location: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchWarehouses();
      setWarehouses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveWarehouse = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateWarehouse(form.id, { name: form.name, location: form.location });
      } else {
        await createWarehouse({ name: form.name, location: form.location });
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save warehouse');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this warehouse?')) return;
    try {
      await deleteWarehouse(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete warehouse');
    }
  };

  const openNew = () => {
    setForm({ id: null, name: '', location: '' });
    setShowModal(true);
  };

  const openEdit = (wh) => {
    setForm({ id: wh.id, name: wh.name, location: wh.location || '' });
    setShowModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-gray-500 mt-1">Manage warehouses, locations, and global configurations.</p>
      </div>

      {loading ? (
        <div className="text-gray-500 py-12 text-center">Loading settings...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden col-span-1 md:col-span-2">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700">
                  <Warehouse size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Warehouses</h2>
              </div>
              <button onClick={openNew} className="btn btn-primary text-sm px-4 py-2 flex items-center gap-2">
                <Plus size={16} /> Add Location
              </button>
            </div>
            
            <div className="p-0">
              {warehouses.map(wh => (
                <div key={wh.id} className="flex justify-between items-center p-6 border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Building2 size={16} className="text-cyan-600" />
                      {wh.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      {wh.location || 'No location defined'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(wh)} className="p-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:border-cyan-500 hover:text-cyan-600 transition shadow-sm">
                      <Edit3 size={16} />
                    </button>
                    {warehouses.length > 1 && (
                      <button onClick={() => handleDelete(wh.id)} className="p-2 bg-gray-50 border border-gray-200 text-gray-400 rounded-lg hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {warehouses.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No warehouses defined. Add one to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">{form.id ? 'Edit Warehouse' : 'New Warehouse'}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveWarehouse} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="e.g. Main Hub"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address / Coordinates</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                    value={form.location}
                    onChange={e => setForm({...form, location: e.target.value})}
                    placeholder="e.g. Section 4, Sector B"
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-sm transition">
                  {form.id ? 'Save Changes' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
