import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  // ─── Auth State ──────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    // Fake login since there's no backend auth endpoint yet
    const dummyUser = { id: 1, name: 'Inventory Manager', email, role: 'Admin' };
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify(dummyUser));
    setUser(dummyUser);
    return dummyUser;
  };

  const signup = async (name, email, password) => {
    // Fake signup
    const dummyUser = { id: 1, name, email, role: 'Admin' };
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify(dummyUser));
    setUser(dummyUser);
    return dummyUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ─── Categories ──────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const addCategory = async (name, description = '') => {
    const res = await axiosInstance.post('/categories', { name, description });
    setCategories(prev => [res.data, ...prev]);
    return res.data;
  };

  // ─── Products ────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/products');
      // Normalise API shape → frontend shape
      const normalised = res.data.map(p => ({
        id: String(p.id),
        name: p.name,
        sku: p.sku,
        category: p.category?.name || '',
        categoryId: p.categoryId,
        uom: p.unit,
        stock: p.stock ?? 0,
        costPerUnit: p.costPerUnit ?? 0,
        reserved: p.reserved ?? 0,
        freeToUse: (p.stock ?? 0) - (p.reserved ?? 0),
      }));
      setProducts(normalised);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const addProduct = async (product) => {
    const payload = {
      name: product.name,
      sku: product.sku,
      unit: product.uom || product.unit || 'pcs',
      stock: Number(product.initialStock) || 0,
      categoryId: product.categoryId || 1,
    };
    const res = await axiosInstance.post('/products', payload);
    const p = res.data;
    setProducts(prev => [{
      id: String(p.id),
      name: p.name,
      sku: p.sku,
      category: p.category?.name || '',
      categoryId: p.categoryId,
      uom: p.unit,
      stock: p.stock ?? 0,
      costPerUnit: p.costPerUnit ?? 0,
      reserved: 0,
      freeToUse: p.stock ?? 0,
    }, ...prev]);
    return res.data;
  };

  const updateProduct = async (id, updatedFields) => {
    const res = await axiosInstance.put(`/products/${id}`, updatedFields);
    const p = res.data;
    setProducts(prev => prev.map(pr => pr.id === String(id) ? {
      ...pr,
      name: p.name,
      sku: p.sku,
      category: p.category?.name || pr.category,
      uom: p.unit || pr.uom,
      stock: p.stock ?? pr.stock,
      costPerUnit: p.costPerUnit ?? pr.costPerUnit,
      freeToUse: (p.stock ?? pr.stock) - pr.reserved,
    } : pr));
    return res.data;
  };

  const updateStock = async (id, newStock, newCostPerUnit) => {
    try {
      await updateProduct(id, { stock: Number(newStock), costPerUnit: Number(newCostPerUnit) });
    } catch {
      // Fallback: update locally if backend doesn't support costPerUnit
      setProducts(prev => prev.map(p => {
        if (p.id === id) {
          const onHand = Number(newStock);
          const cost = Number(newCostPerUnit);
          return { ...p, stock: onHand, costPerUnit: cost, freeToUse: Math.max(0, onHand - p.reserved) };
        }
        return p;
      }));
    }
  };

  const deleteProduct = async (id) => {
    await axiosInstance.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== String(id)));
  };

  // ─── Warehouse Info (local state, not yet backed by API) ─────────────────────
  const [warehouse, setWarehouse] = useState({
    name: 'Main Warehouse',
    code: 'WH',
    address: 'Sector 42, Industrial Area, New Delhi, 110001',
    manager: 'Rajesh Kumar',
    capacity: '10,000 sq ft',
    type: 'Central Hub',
  });

  const updateWarehouse = (fields) => {
    setWarehouse(prev => ({ ...prev, ...fields }));
  };

  // ─── Locations ───────────────────────────────────────────────────────────────
  const [locations, setLocations] = useState([
    { id: 'L1', name: 'Stock Room 1', shortCode: 'SR1', warehouseCode: 'WH' },
    { id: 'L2', name: 'Stock Room 2', shortCode: 'SR2', warehouseCode: 'WH' },
    { id: 'L3', name: 'Rack A', shortCode: 'RA', warehouseCode: 'WH' },
    { id: 'L4', name: 'Rack B', shortCode: 'RB', warehouseCode: 'WH' },
    { id: 'L5', name: 'Production Floor', shortCode: 'PF', warehouseCode: 'WH' },
  ]);

  const addLocation = (loc) => {
    setLocations(prev => [...prev, { ...loc, id: 'L' + (prev.length + 1) }]);
  };
  const updateLocation = (id, fields) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...fields } : l));
  };
  const deleteLocation = (id) => {
    setLocations(prev => prev.filter(l => l.id !== id));
  };

  // ─── Counters & Operations (local state) ─────────────────────────────────────
  const [refCounters, setRefCounters] = useState({ IN: 3, OUT: 3 });

  const getNextRef = (type) => {
    const key = type === 'Receipt' ? 'IN' : 'OUT';
    const num = refCounters[key];
    setRefCounters(prev => ({ ...prev, [key]: prev[key] + 1 }));
    return `${warehouse.code}/${key}/${String(num).padStart(4, '0')}`;
  };

  const [receipts, setReceipts] = useState([
    { id: 'r1', reference: 'WH/IN/0001', from: 'Vendor', to: 'WH/Stock1', contact: 'Azure Interior', scheduleDate: '2026-03-12', status: 'Ready', items: [{ productId: '1', name: 'Steel Rods', quantity: 500 }] },
    { id: 'r2', reference: 'WH/IN/0002', from: 'Vendor', to: 'WH/Stock1', contact: 'Azure Interior', scheduleDate: '2026-03-13', status: 'Ready', items: [{ productId: '2', name: 'Wooden Chairs', quantity: 100 }] },
  ]);

  const addReceipt = (receipt) => {
    const ref = getNextRef('Receipt');
    setReceipts(prev => [{ ...receipt, id: 'r' + Date.now(), reference: ref }, ...prev]);
  };

  const [deliveries, setDeliveries] = useState([
    { id: 'd1', reference: 'WH/OUT/0001', from: 'WH/Stock1', to: 'Vendor', contact: 'Azure Interior', scheduleDate: '2026-03-14', status: 'Ready', items: [{ productId: '2', name: 'Wooden Chairs', quantity: 10 }] },
    { id: 'd2', reference: 'WH/OUT/0002', from: 'WH/Stock1', to: 'Vendor', contact: 'Azure Interior', scheduleDate: '2026-03-15', status: 'Ready', items: [{ productId: '5', name: 'Desk', quantity: 5 }] },
  ]);

  const addDelivery = (delivery) => {
    const ref = getNextRef('Delivery');
    setDeliveries(prev => [{ ...delivery, id: 'd' + Date.now(), reference: ref }, ...prev]);
  };

  const [moveHistory, setMoveHistory] = useState([
    { id: 'm1', reference: 'WH/IN/0001', date: '2026-03-12', contact: 'Azure Interior', from: 'Vendor', to: 'WH/Stock1', quantity: 500, status: 'Ready', direction: 'IN' },
    { id: 'm2', reference: 'WH/OUT/0002', date: '2026-03-12', contact: 'Azure Interior', from: 'WH/Stock1', to: 'Vendor', quantity: 10, status: 'Ready', direction: 'OUT' },
    { id: 'm3', reference: 'WH/OUT/0002', date: '2026-03-12', contact: 'Azure Interior', from: 'WH/Stock2', to: 'Vendor', quantity: 5, status: 'Ready', direction: 'OUT' },
    { id: 'm4', reference: 'WH/IN/0002', date: '2026-03-13', contact: 'Azure Interior', from: 'Vendor', to: 'WH/Stock1', quantity: 100, status: 'Done', direction: 'IN' },
    { id: 'm5', reference: 'WH/OUT/0001', date: '2026-03-14', contact: 'Azure Interior', from: 'WH/Stock1', to: 'Vendor', quantity: 20, status: 'Draft', direction: 'OUT' },
  ]);

  const addMove = (move) => {
    setMoveHistory(prev => [{ ...move, id: 'm' + Date.now() }, ...prev]);
  };

  const [operations, setOperations] = useState([
    { id: 'RCPT-001', type: 'Receipt', date: '2026-03-12', status: 'Done', source: 'Vendor A', destination: 'Main Warehouse', items: [{ productId: '1', quantity: 500 }] },
    { id: 'DEL-001', type: 'Delivery', date: '2026-03-13', status: 'Ready', source: 'Main Warehouse', destination: 'Customer X', items: [{ productId: '2', quantity: 10 }] },
  ]);

  const addOperation = (operation) => {
    const newOp = { ...operation, id: `${operation.type.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`, date: new Date().toISOString().split('T')[0] };
    if (newOp.status === 'Done') executeOperation(newOp);
    setOperations(prev => [newOp, ...prev]);
  };

  const validateOperation = (id) => {
    const opIndex = operations.findIndex(o => o.id === id);
    if (opIndex > -1 && operations[opIndex].status !== 'Done') {
      const op = operations[opIndex];
      const updatedOp = { ...op, status: 'Done' };
      const newOps = [...operations];
      newOps[opIndex] = updatedOp;
      setOperations(newOps);
      executeOperation(updatedOp);
    }
  };

  const executeOperation = (op) => {
    setProducts(currentProducts => {
      const newProducts = [...currentProducts];
      op.items.forEach(item => {
        const pIndex = newProducts.findIndex(p => p.id === item.productId);
        if (pIndex > -1) {
          const qty = Number(item.quantity);
          if (op.type === 'Receipt') {
            newProducts[pIndex].stock += qty;
            newProducts[pIndex].freeToUse += qty;
          } else if (op.type === 'Delivery') {
            newProducts[pIndex].stock -= qty;
            newProducts[pIndex].freeToUse = Math.max(0, newProducts[pIndex].stock - newProducts[pIndex].reserved);
          } else if (op.type === 'Adjustment') {
            newProducts[pIndex].stock += qty;
            newProducts[pIndex].freeToUse = Math.max(0, newProducts[pIndex].stock - newProducts[pIndex].reserved);
          }
        }
      });
      return newProducts;
    });
  };

  // ─── Load products & categories when user logs in ────────────────────────────
  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchCategories();
    }
  }, [user]);

  return (
    <InventoryContext.Provider value={{
      // Auth
      user, login, logout, signup,
      // Products
      products, fetchProducts, addProduct, updateProduct, updateStock, deleteProduct,
      // Categories
      categories, fetchCategories, addCategory,
      // Warehouse & Locations
      warehouse, updateWarehouse,
      locations, addLocation, updateLocation, deleteLocation,
      // Operations
      operations, receipts, deliveries, moveHistory,
      addOperation, validateOperation,
      addReceipt, addDelivery, addMove,
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
