const inventoryService = require('../services/inventoryService');

const addReceipt = async (req, res) => {
  try {
    const { product_id, warehouse_id, quantity, supplier } = req.body;
    
    if (!product_id || !warehouse_id || !quantity || quantity <= 0 || !supplier) {
        return res.status(400).json({ error: 'Missing required fields or invalid quantity for receipt' });
    }

    const result = await inventoryService.addReceipt(product_id, warehouse_id, quantity, supplier);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding receipt:', error);
    res.status(500).json({ error: 'Failed to record receipt' });
  }
};

const addDelivery = async (req, res) => {
  try {
    const { product_id, warehouse_id, quantity, customer } = req.body;

    if (!product_id || !warehouse_id || !quantity || quantity <= 0 || !customer) {
        return res.status(400).json({ error: 'Missing required fields or invalid quantity for delivery' });
    }

    const result = await inventoryService.addDelivery(product_id, warehouse_id, quantity, customer);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding delivery:', error);
    if (error.message === 'Insufficient stock') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to record delivery' });
  }
};

const addTransfer = async (req, res) => {
  try {
    const { product_id, from_warehouse, to_warehouse, quantity } = req.body;

     if (!product_id || !from_warehouse || !to_warehouse || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Missing required fields or invalid quantity for transfer' });
    }

    if (from_warehouse === to_warehouse) {
         return res.status(400).json({ error: 'Source and destination warehouses cannot be the same' });
    }

    const result = await inventoryService.addTransfer(product_id, from_warehouse, to_warehouse, quantity);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding transfer:', error);
     if (error.message === 'Insufficient stock in source warehouse') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to record transfer' });
  }
};

const addAdjustment = async (req, res) => {
  try {
    const { product_id, warehouse_id, new_quantity, reason } = req.body;

    if (!product_id || !warehouse_id || new_quantity === undefined || new_quantity < 0 || !reason) {
         return res.status(400).json({ error: 'Missing required fields or invalid quantity for adjustment' });
    }

    const result = await inventoryService.addAdjustment(product_id, warehouse_id, new_quantity, reason);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding adjustment:', error);
    res.status(500).json({ error: 'Failed to record adjustment' });
  }
};

const getInventoryHistory = async (req, res) => {
  try {
    const { product_id, warehouse_id, startDate, endDate } = req.query;
    
    const history = await inventoryService.getInventoryHistory(product_id, warehouse_id, startDate, endDate);
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching inventory history:', error);
    res.status(500).json({ error: 'Failed to fetch inventory history' });
  }
};

module.exports = {
  addReceipt,
  addDelivery,
  addTransfer,
  addAdjustment,
  getInventoryHistory
};
