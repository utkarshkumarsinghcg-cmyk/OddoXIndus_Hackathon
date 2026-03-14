const pool = require('../db/pool');

// GET all receipts
const getAllReceipts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Receipts ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
};

// GET single receipt
const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Receipts WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
};

// POST create receipt (Auto-validates and updates inventory immediately)
const createReceipt = async (req, res) => {
  const client = await pool.connect();
  try {
    const { product_id, warehouse_id, quantity, supplier } = req.body;
    if (!product_id || !warehouse_id || !quantity || quantity <= 0 || !supplier) {
        return res.status(400).json({ error: 'Missing required fields or invalid quantity for receipt' });
    }
    
    await client.query('BEGIN');

    // 1. Create Receipt as VALIDATED
    const receiptResult = await client.query(
      `INSERT INTO Receipts (product_id, warehouse_id, quantity, supplier, status) VALUES ($1, $2, $3, $4, 'VALIDATED') RETURNING *`,
      [product_id, warehouse_id, quantity, supplier]
    );
    const receipt = receiptResult.rows[0];

    // 2. Update Inventory
    const inventoryResult = await client.query(
      `UPDATE Inventory SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3 RETURNING *`,
      [quantity, product_id, warehouse_id]
    );

    // If no existing inventory record, insert one
    if (inventoryResult.rowCount === 0) {
      await client.query(
        `INSERT INTO Inventory (product_id, warehouse_id, quantity) VALUES ($1, $2, $3)`,
        [product_id, warehouse_id, quantity]
      );
    }

    // 3. Write Ledger Entry
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['RECEIPT', product_id, warehouse_id, quantity]
    );

    await client.query('COMMIT');
    res.status(201).json(receipt);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating receipt:', error);
    res.status(500).json({ error: 'Failed to create receipt' });
  } finally {
    client.release();
  }
};

// PUT update receipt (only if DRAFT)
const updateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, supplier } = req.body;
    
    // Check status first
    const check = await pool.query('SELECT status FROM Receipts WHERE id = $1', [id]);
    if (check.rowCount === 0) return res.status(404).json({ error: 'Receipt not found' });
    if (check.rows[0].status === 'VALIDATED') {
        return res.status(400).json({ error: 'Cannot edit a validated receipt' });
    }

    const result = await pool.query(
      'UPDATE Receipts SET quantity = COALESCE($1, quantity), supplier = COALESCE($2, supplier) WHERE id = $3 RETURNING *',
      [quantity, supplier, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating receipt:', error);
    res.status(500).json({ error: 'Failed to update receipt' });
  }
};

// DELETE receipt (only if DRAFT)
const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check status first
    const check = await pool.query('SELECT status FROM Receipts WHERE id = $1', [id]);
    if (check.rowCount === 0) return res.status(404).json({ error: 'Receipt not found' });
    if (check.rows[0].status === 'VALIDATED') {
        return res.status(400).json({ error: 'Cannot delete a validated receipt' });
    }

    await pool.query('DELETE FROM Receipts WHERE id = $1', [id]);
    res.status(200).json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    console.error('Error deleting receipt:', error);
    res.status(500).json({ error: 'Failed to delete receipt' });
  }
};

// POST validate receipt (moves to VALIDATED and updates Inventory)
const validateReceipt = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');

    // 1. Get receipt details
    const receiptResult = await client.query('SELECT * FROM Receipts WHERE id = $1 FOR UPDATE', [id]);
    if (receiptResult.rowCount === 0) throw new Error('NOT_FOUND');
    const receipt = receiptResult.rows[0];

    if (receipt.status === 'VALIDATED') {
        throw new Error('ALREADY_VALIDATED');
    }

    // 2. Mark as VALIDATED
    const updatedReceipt = await client.query(
        "UPDATE Receipts SET status = 'VALIDATED' WHERE id = $1 RETURNING *", [id]
    );

    // 3. Update Inventory
    const inventoryResult = await client.query(
      `UPDATE Inventory SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3 RETURNING *`,
      [receipt.quantity, receipt.product_id, receipt.warehouse_id]
    );

    // If no existing inventory record, insert one
    if (inventoryResult.rowCount === 0) {
      await client.query(
        `INSERT INTO Inventory (product_id, warehouse_id, quantity) VALUES ($1, $2, $3)`,
        [receipt.product_id, receipt.warehouse_id, receipt.quantity]
      );
    }

    // 4. Write Ledger Entry
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['RECEIPT', receipt.product_id, receipt.warehouse_id, receipt.quantity]
    );

    await client.query('COMMIT');
    res.status(200).json({ message: 'Receipt validated successfully', receipt: updatedReceipt.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.message === 'NOT_FOUND') return res.status(404).json({ error: 'Receipt not found' });
    if (error.message === 'ALREADY_VALIDATED') return res.status(400).json({ error: 'Receipt is already validated' });
    
    console.error('Error validating receipt:', error);
    res.status(500).json({ error: 'Failed to validate receipt' });
  } finally {
    client.release();
  }
};

module.exports = { getAllReceipts, getReceiptById, createReceipt, updateReceipt, deleteReceipt, validateReceipt };
