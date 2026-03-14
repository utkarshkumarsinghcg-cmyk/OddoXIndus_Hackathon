const pool = require('../db/pool');

// GET all reorder rules
const getAllReorderRules = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ReorderRules ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching reorder rules:', error);
    res.status(500).json({ error: 'Failed to fetch reorder rules' });
  }
};

// POST create reorder rule
const createReorderRule = async (req, res) => {
  try {
    const { product_id, warehouse_id, min_quantity, max_quantity } = req.body;
    if (!product_id || !warehouse_id || min_quantity === undefined || max_quantity === undefined) {
      return res.status(400).json({ error: 'product_id, warehouse_id, min_quantity, and max_quantity are required' });
    }
    const result = await pool.query(
      'INSERT INTO ReorderRules (product_id, warehouse_id, min_quantity, max_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [product_id, warehouse_id, min_quantity, max_quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
       return res.status(409).json({ error: 'A reorder rule for this product and warehouse already exists' });
    }
    console.error('Error creating reorder rule:', error);
    res.status(500).json({ error: 'Failed to create reorder rule' });
  }
};

// PUT update reorder rule
const updateReorderRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { min_quantity, max_quantity } = req.body;
    const result = await pool.query(
      'UPDATE ReorderRules SET min_quantity = COALESCE($1, min_quantity), max_quantity = COALESCE($2, max_quantity) WHERE id = $3 RETURNING *',
      [min_quantity, max_quantity, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reorder rule not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating reorder rule:', error);
    res.status(500).json({ error: 'Failed to update reorder rule' });
  }
};

// DELETE reorder rule
const deleteReorderRule = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM ReorderRules WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reorder rule not found' });
    }
    res.status(200).json({ message: 'Reorder rule deleted successfully' });
  } catch (error) {
    console.error('Error deleting reorder rule:', error);
    res.status(500).json({ error: 'Failed to delete reorder rule' });
  }
};

module.exports = { getAllReorderRules, createReorderRule, updateReorderRule, deleteReorderRule };
