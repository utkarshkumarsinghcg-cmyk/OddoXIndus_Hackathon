const pool = require('../db/pool');

// GET all transfers
const getAllTransfers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Transfers ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching transfers:', error);
    res.status(500).json({ error: 'Failed to fetch transfers' });
  }
};

// GET single transfer
const getTransferById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Transfers WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transfer not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching transfer:', error);
    res.status(500).json({ error: 'Failed to fetch transfer' });
  }
};

// POST create transfer (Auto-validates and updates inventory immediately)
const createTransfer = async (req, res) => {
  const client = await pool.connect();
  try {
    const { product_id, from_warehouse, to_warehouse, quantity } = req.body;

    if (!product_id || !from_warehouse || !to_warehouse || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Missing required fields or invalid quantity for transfer' });
    }
    if (from_warehouse === to_warehouse) {
         return res.status(400).json({ error: 'Source and destination warehouses cannot be the same' });
    }

    await client.query('BEGIN');

    // 1. Check Source Stock bounds FIRST
    const sourceInventoryResult = await client.query(
      `SELECT quantity FROM Inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE`,
      [product_id, from_warehouse]
    );

    if (sourceInventoryResult.rowCount === 0 || sourceInventoryResult.rows[0].quantity < quantity) {
      throw new Error('INSUFFICIENT_STOCK');
    }

    // 2. Create Transfer 
    const transferResult = await client.query(
      `INSERT INTO Transfers (product_id, from_warehouse, to_warehouse, quantity) VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_id, from_warehouse, to_warehouse, quantity]
    );
    const transfer = transferResult.rows[0];

    // 3. Deduct from Source Inventory
    await client.query(
      `UPDATE Inventory SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3`,
      [quantity, product_id, from_warehouse]
    );

    // 4. Add to Destination Inventory
    const destInventoryResult = await client.query(
      `UPDATE Inventory SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3 RETURNING *`,
      [quantity, product_id, to_warehouse]
    );

    if (destInventoryResult.rowCount === 0) {
       await client.query(
        `INSERT INTO Inventory (product_id, warehouse_id, quantity) VALUES ($1, $2, $3)`,
        [product_id, to_warehouse, quantity]
      );
    }

    // 5. Write Ledger Entries (One OUT, One IN)
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['TRANSFER_OUT', product_id, from_warehouse, -Math.abs(quantity)]
    );
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['TRANSFER_IN', product_id, to_warehouse, quantity]
    );

    await client.query('COMMIT');
    res.status(201).json(transfer);
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.message === 'INSUFFICIENT_STOCK') {
      return res.status(400).json({ error: 'Insufficient stock in source warehouse to fulfill this transfer' });
    }
    console.error('Error creating transfer:', error);
    res.status(500).json({ error: 'Failed to create transfer' });
  } finally {
    client.release();
  }
};

module.exports = { getAllTransfers, getTransferById, createTransfer };
