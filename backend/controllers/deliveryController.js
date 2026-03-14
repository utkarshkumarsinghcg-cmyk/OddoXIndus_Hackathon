const pool = require('../db/pool');

// GET all deliveries
const getAllDeliveries = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Deliveries ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
};

// GET single delivery
const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Deliveries WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching delivery:', error);
    res.status(500).json({ error: 'Failed to fetch delivery' });
  }
};

// POST create delivery (Auto-validates, checks stock, and updates inventory immediately)
const createDelivery = async (req, res) => {
  const client = await pool.connect();
  try {
    const { product_id, warehouse_id, quantity, customer } = req.body;
    if (!product_id || !warehouse_id || !quantity || quantity <= 0 || !customer) {
        return res.status(400).json({ error: 'Missing required fields or invalid quantity for delivery' });
    }
    
    await client.query('BEGIN');

    // 1. Check Inventory bounds FIRST
    const inventoryResult = await client.query(
      `SELECT quantity FROM Inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE`,
      [product_id, warehouse_id]
    );

    if (inventoryResult.rowCount === 0 || inventoryResult.rows[0].quantity < quantity) {
      throw new Error('INSUFFICIENT_STOCK');
    }

    // 2. Create Delivery as VALIDATED
    const deliveryResult = await client.query(
      `INSERT INTO Deliveries (product_id, warehouse_id, quantity, customer, status) VALUES ($1, $2, $3, $4, 'VALIDATED') RETURNING *`,
      [product_id, warehouse_id, quantity, customer]
    );
    const delivery = deliveryResult.rows[0];

    // 3. Update Inventory
    await client.query(
      `UPDATE Inventory SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3`,
      [quantity, product_id, warehouse_id]
    );

    // 4. Write Ledger Entry (negative quantity for delivery)
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['DELIVERY', product_id, warehouse_id, -Math.abs(quantity)]
    );

    await client.query('COMMIT');
    res.status(201).json(delivery);
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.message === 'INSUFFICIENT_STOCK') {
      return res.status(400).json({ error: 'Insufficient stock to fulfill this delivery' });
    }
    console.error('Error creating delivery:', error);
    res.status(500).json({ error: 'Failed to create delivery' });
  } finally {
    client.release();
  }
};

// PUT update delivery (only if DRAFT)
const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, customer } = req.body;
    
    // Check status first
    const check = await pool.query('SELECT status FROM Deliveries WHERE id = $1', [id]);
    if (check.rowCount === 0) return res.status(404).json({ error: 'Delivery not found' });
    if (check.rows[0].status === 'VALIDATED') {
        return res.status(400).json({ error: 'Cannot edit a validated delivery' });
    }

    const result = await pool.query(
      'UPDATE Deliveries SET quantity = COALESCE($1, quantity), customer = COALESCE($2, customer) WHERE id = $3 RETURNING *',
      [quantity, customer, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
};

// DELETE delivery (only if DRAFT)
const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check status first
    const check = await pool.query('SELECT status FROM Deliveries WHERE id = $1', [id]);
    if (check.rowCount === 0) return res.status(404).json({ error: 'Delivery not found' });
    if (check.rows[0].status === 'VALIDATED') {
        return res.status(400).json({ error: 'Cannot delete a validated delivery' });
    }

    await pool.query('DELETE FROM Deliveries WHERE id = $1', [id]);
    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery:', error);
    res.status(500).json({ error: 'Failed to delete delivery' });
  }
};

// POST validate delivery (moves to VALIDATED and updates Inventory)
const validateDelivery = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');

    // 1. Get delivery details
    const deliveryResult = await client.query('SELECT * FROM Deliveries WHERE id = $1 FOR UPDATE', [id]);
    if (deliveryResult.rowCount === 0) throw new Error('NOT_FOUND');
    const delivery = deliveryResult.rows[0];

    if (delivery.status === 'VALIDATED') {
        throw new Error('ALREADY_VALIDATED');
    }

    // 2. Check Inventory bounds
    const inventoryResult = await client.query(
      `SELECT quantity FROM Inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE`,
      [delivery.product_id, delivery.warehouse_id]
    );

    if (inventoryResult.rowCount === 0 || inventoryResult.rows[0].quantity < delivery.quantity) {
      throw new Error('INSUFFICIENT_STOCK');
    }

    // 3. Mark as VALIDATED
    const updatedDelivery = await client.query(
        "UPDATE Deliveries SET status = 'VALIDATED' WHERE id = $1 RETURNING *", [id]
    );

    // 4. Update Inventory
    await client.query(
      `UPDATE Inventory SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3`,
      [delivery.quantity, delivery.product_id, delivery.warehouse_id]
    );

    // 5. Write Ledger Entry
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['DELIVERY', delivery.product_id, delivery.warehouse_id, -Math.abs(delivery.quantity)] // Deliveries are negative moves
    );

    await client.query('COMMIT');
    res.status(200).json({ message: 'Delivery validated successfully', delivery: updatedDelivery.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.message === 'NOT_FOUND') return res.status(404).json({ error: 'Delivery not found' });
    if (error.message === 'ALREADY_VALIDATED') return res.status(400).json({ error: 'Delivery is already validated' });
    if (error.message === 'INSUFFICIENT_STOCK') return res.status(400).json({ error: 'Insufficient stock to fulfill this delivery' });
    
    console.error('Error validating delivery:', error);
    res.status(500).json({ error: 'Failed to validate delivery' });
  } finally {
    client.release();
  }
};

module.exports = { getAllDeliveries, getDeliveryById, createDelivery, updateDelivery, deleteDelivery, validateDelivery };
