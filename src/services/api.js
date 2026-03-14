// Placeholder API service returning dummy data
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchProducts = async () => {
    await delay(500);
    return [
        { id: 1, name: 'Lumber - Oak', sku: 'LUM-OAK-001', category: 'Raw Materials', stock: 1500, uom: 'Board Feet', warehouse: 'Main Warehouse' },
        { id: 2, name: 'Screws - 2"', sku: 'SCR-2IN-001', category: 'Hardware', stock: 10000, uom: 'Box', warehouse: 'Local Store 1' },
        { id: 3, name: 'Paint - White', sku: 'PNT-WHT-001', category: 'Consumables', stock: 50, uom: 'Gallon', warehouse: 'Paint Facility' },
    ];
};

export const fetchReceipts = async () => {
    await delay(500);
    return [
        { id: 'REC-1001', supplier: 'Timber Co.', product: 'Lumber - Oak', quantity: 500, status: 'Done', date: '2026-03-10' },
        { id: 'REC-1002', supplier: 'Fasteners Inc.', product: 'Screws - 2"', quantity: 2000, status: 'Waiting', date: '2026-03-15' },
        { id: 'REC-1003', supplier: 'ColorMax', product: 'Paint - White', quantity: 100, status: 'Draft', date: '2026-03-16' },
    ];
};

export const fetchDeliveryOrders = async () => {
    await delay(500);
    return [
        { id: 'DO-2001', customer: 'BuildIt Corp', product: 'Lumber - Oak', quantity: 200, status: 'Done', date: '2026-03-11' },
        { id: 'DO-2002', customer: 'DIY Supplies', product: 'Screws - 2"', quantity: 500, status: 'Waiting', date: '2026-03-14' },
    ];
};

export const fetchTransfers = async () => {
    await delay(500);
    return [
        { id: 'TRF-3001', fromLocation: 'Main Warehouse', toLocation: 'Local Store 1', product: 'Screws - 2"', quantity: 1000, status: 'Done' },
        { id: 'TRF-3002', fromLocation: 'Paint Facility', toLocation: 'Main Warehouse', product: 'Paint - White', quantity: 20, status: 'Draft' },
    ];
};

export const fetchAdjustments = async () => {
    await delay(500);
    return [
        { id: 'ADJ-4001', product: 'Lumber - Oak', systemQty: 1550, actualQty: 1500, difference: -50, date: '2026-03-01' },
    ];
};
