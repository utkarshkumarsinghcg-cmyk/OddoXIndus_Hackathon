const pool = require('../db/pool');

// GET all adjustments
const getAllAdjustments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Adjustments ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching adjustments:', error);
    res.status(500).json({ error: 'Failed to fetch adjustments' });
  }
};

// GET single adjustment
const getAdjustmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Adjustments WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Adjustment not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching adjustment:', error);
    res.status(500).json({ error: 'Failed to fetch adjustment' });
  }
};

// POST create adjustment (This immediately updates inventory, just like the old /inventory/adjustment)
const createAdjustment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { product_id, warehouse_id, new_quantity, reason } = req.body;

    if (!product_id || !warehouse_id || new_quantity === undefined || new_quantity < 0 || !reason) {
         return res.status(400).json({ error: 'Missing required fields or invalid quantity for adjustment' });
    }

    await client.query('BEGIN');

    // Fetch current quantity
    const inventoryResult = await client.query(
      `SELECT quantity FROM Inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE`,
      [product_id, warehouse_id]
    );

    let current_quantity = 0;
    if (inventoryResult.rowCount > 0) {
        current_quantity = inventoryResult.rows[0].quantity;
    }

    const difference = new_quantity - current_quantity;

    // Update or Insert Inventory
    if (inventoryResult.rowCount > 0) {
        await client.query(
            `UPDATE Inventory SET quantity = $1 WHERE product_id = $2 AND warehouse_id = $3`,
            [new_quantity, product_id, warehouse_id]
        );
    } else {
         await client.query(
            `INSERT INTO Inventory (product_id, warehouse_id, quantity) VALUES ($1, $2, $3)`,
            [product_id, warehouse_id, new_quantity]
        );
    }

    // Insert Adjustment Record
    const result = await client.query(
      `INSERT INTO Adjustments (product_id, warehouse_id, old_quantity, new_quantity, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [product_id, warehouse_id, current_quantity, new_quantity, reason]
    );

    // Insert Ledger Entry
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['ADJUSTMENT', product_id, warehouse_id, difference]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating adjustment:', error);
    res.status(500).json({ error: 'Failed to create adjustment' });
  } finally {
    client.release();
  }
};

// PUT update adjustment (only updates the reason, cannot change quantities retroactively)
const updateAdjustment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
        return res.status(400).json({ error: 'Reason is required to update' });
    }

    const result = await pool.query(
      'UPDATE Adjustments SET reason = $1 WHERE id = $2 RETURNING *',
      [reason, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Adjustment not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating adjustment:', error);
    res.status(500).json({ error: 'Failed to update adjustment' });
  }
};

// DELETE adjustment 
// Note: In real systems, deleting a posted adjustment is bad practice. We just delete the record here to satisfy the generic REST spec, but we DO NOT revert the inventory.
const deleteAdjustment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Adjustments WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Adjustment not found' });
    }
    res.status(200).json({ message: 'Adjustment record deleted successfully (Note: Inventory level was not reverted)' });
  } catch (error) {
    console.error('Error deleting adjustment:', error);
    res.status(500).json({ error: 'Failed to delete adjustment' });
  }
};

module.exports = { getAllAdjustments, getAdjustmentById, createAdjustment, updateAdjustment, deleteAdjustment };
