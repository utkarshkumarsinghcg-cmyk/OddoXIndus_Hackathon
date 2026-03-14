import React, { createContext, useContext, useState } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  // Warehouse Info
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

  // Locations (rooms, racks, zones inside warehouse)
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

  // Products
  const [products, setProducts] = useState([
    { id: '1', name: 'Steel Rods', sku: 'ST-001', category: 'Raw Materials', uom: 'kg', stock: 1500, costPerUnit: 250, reserved: 120, freeToUse: 1380 },
    { id: '2', name: 'Wooden Chairs', sku: 'CH-100', category: 'Finished Goods', uom: 'pcs', stock: 320, costPerUnit: 3000, reserved: 10, freeToUse: 310 },
    { id: '3', name: 'Aluminium Frames', sku: 'AL-200', category: 'Components', uom: 'pcs', stock: 45, costPerUnit: 1800, reserved: 5, freeToUse: 40 },
    { id: '4', name: 'Rubber Grips', sku: 'RG-050', category: 'Components', uom: 'pcs', stock: 1200, costPerUnit: 50, reserved: 0, freeToUse: 1200 },
    { id: '5', name: 'Desk', sku: 'DSK-001', category: 'Finished Goods', uom: 'pcs', stock: 50, costPerUnit: 3000, reserved: 5, freeToUse: 45 },
    { id: '6', name: 'Table', sku: 'TBL-001', category: 'Finished Goods', uom: 'pcs', stock: 50, costPerUnit: 3000, reserved: 0, freeToUse: 50 },
  ]);

  // Counters for auto-increment references
  const [refCounters, setRefCounters] = useState({ IN: 3, OUT: 3 });

  const getNextRef = (type) => {
    const key = type === 'Receipt' ? 'IN' : 'OUT';
    const num = refCounters[key];
    setRefCounters(prev => ({ ...prev, [key]: prev[key] + 1 }));
    return `${warehouse.code}/${key}/${String(num).padStart(4, '0')}`;
  };

  // Receipts (incoming stock)
  const [receipts, setReceipts] = useState([
    { id: 'r1', reference: 'WH/IN/0001', from: 'Vendor', to: 'WH/Stock1', contact: 'Azure Interior', scheduleDate: '2026-03-12', status: 'Ready', items: [{ productId: '1', name: 'Steel Rods', quantity: 500 }] },
    { id: 'r2', reference: 'WH/IN/0002', from: 'Vendor', to: 'WH/Stock1', contact: 'Azure Interior', scheduleDate: '2026-03-13', status: 'Ready', items: [{ productId: '2', name: 'Wooden Chairs', quantity: 100 }] },
  ]);

  const addReceipt = (receipt) => {
    const ref = getNextRef('Receipt');
    setReceipts(prev => [{ ...receipt, id: 'r' + Date.now(), reference: ref }, ...prev]);
  };

  // Deliveries (outgoing stock)
  const [deliveries, setDeliveries] = useState([
    { id: 'd1', reference: 'WH/OUT/0001', from: 'WH/Stock1', to: 'Vendor', contact: 'Azure Interior', scheduleDate: '2026-03-14', status: 'Ready', items: [{ productId: '2', name: 'Wooden Chairs', quantity: 10 }] },
    { id: 'd2', reference: 'WH/OUT/0002', from: 'WH/Stock1', to: 'Vendor', contact: 'Azure Interior', scheduleDate: '2026-03-15', status: 'Ready', items: [{ productId: '5', name: 'Desk', quantity: 5 }] },
  ]);

  const addDelivery = (delivery) => {
    const ref = getNextRef('Delivery');
    setDeliveries(prev => [{ ...delivery, id: 'd' + Date.now(), reference: ref }, ...prev]);
  };

  // Move History (all moves — IN is green, OUT is red)
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

  // Legacy operations (for dashboard)
  const [operations, setOperations] = useState([
    { id: 'RCPT-001', type: 'Receipt', date: '2026-03-12', status: 'Done', source: 'Vendor A', destination: 'Main Warehouse', items: [{ productId: '1', quantity: 500 }] },
    { id: 'DEL-001', type: 'Delivery', date: '2026-03-13', status: 'Ready', source: 'Main Warehouse', destination: 'Customer X', items: [{ productId: '2', quantity: 10 }] },
  ]);

  const [user, setUser] = useState(null);

  const login = (email, password) => {
    setUser({ name: 'Inventory Manager', email, role: 'admin' });
  };

  const logout = () => {
    setUser(null);
  };

  const addProduct = (product) => {
    const initialStock = Number(product.initialStock) || 0;
    const costPerUnit = Number(product.costPerUnit) || 0;
    setProducts(prev => [...prev, {
      ...product,
      id: String(Date.now()),
      stock: initialStock,
      costPerUnit,
      reserved: 0,
      freeToUse: initialStock
    }]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const updateStock = (id, newOnHand, newCostPerUnit) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const onHand = Number(newOnHand);
        const cost = Number(newCostPerUnit);
        const free = Math.max(0, onHand - p.reserved);
        return { ...p, stock: onHand, costPerUnit: cost, freeToUse: free };
      }
      return p;
    }));
  };

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

  return (
    <InventoryContext.Provider value={{
      products, locations, operations, user, warehouse,
      receipts, deliveries, moveHistory,
      login, logout,
      addProduct, updateProduct, updateStock,
      addOperation, validateOperation,
      updateWarehouse,
      addLocation, updateLocation, deleteLocation,
      addReceipt, addDelivery, addMove,
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
