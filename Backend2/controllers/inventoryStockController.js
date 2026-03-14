const pool = require('../db/pool');

// GET all inventory stock levels (/api/v1/inventory)
const getAllInventory = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Inventory ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory stock' });
  }
};

// GET inventory by product (/api/v1/inventory/product/:productId)
const getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query('SELECT * FROM Inventory WHERE product_id = $1 ORDER BY warehouse_id ASC', [productId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching inventory by product:', error);
    res.status(500).json({ error: 'Failed to fetch product stock' });
  }
};

// GET inventory by location/warehouse (/api/v1/inventory/location/:locationId)
const getInventoryByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const result = await pool.query('SELECT * FROM Inventory WHERE warehouse_id = $1 ORDER BY product_id ASC', [locationId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching inventory by location:', error);
    res.status(500).json({ error: 'Failed to fetch location stock' });
  }
};

module.exports = { getAllInventory, getInventoryByProduct, getInventoryByLocation };
