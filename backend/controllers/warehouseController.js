const pool = require('../db/pool');

// GET all warehouses
const getAllWarehouses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Warehouses ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
};

// GET single warehouse by id
const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Warehouses WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    res.status(500).json({ error: 'Failed to fetch warehouse' });
  }
};

// POST create warehouse
const createWarehouse = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: 'name and location are required' });
    }
    const result = await pool.query(
      'INSERT INTO Warehouses (name, location) VALUES ($1, $2) RETURNING *',
      [name, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating warehouse:', error);
    res.status(500).json({ error: 'Failed to create warehouse' });
  }
};

// PUT update warehouse
const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const result = await pool.query(
      'UPDATE Warehouses SET name = COALESCE($1, name), location = COALESCE($2, location) WHERE id = $3 RETURNING *',
      [name, location, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating warehouse:', error);
    res.status(500).json({ error: 'Failed to update warehouse' });
  }
};

// DELETE warehouse
const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Warehouses WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    res.status(500).json({ error: 'Failed to delete warehouse' });
  }
};

module.exports = { getAllWarehouses, getWarehouseById, createWarehouse, updateWarehouse, deleteWarehouse };
