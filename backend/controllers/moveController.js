const pool = require('../db/pool');

// GET all moves (/api/v1/moves)
const getAllMoves = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Ledger ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching moves:', error);
    res.status(500).json({ error: 'Failed to fetch moves' });
  }
};

// GET moves by product (/api/v1/moves/product/:productId)
const getMovesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query('SELECT * FROM Ledger WHERE product_id = $1 ORDER BY created_at DESC', [productId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching moves by product:', error);
    res.status(500).json({ error: 'Failed to fetch tracking history' });
  }
};

// GET moves by location/warehouse (/api/v1/moves/location/:locationId)
const getMovesByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const result = await pool.query('SELECT * FROM Ledger WHERE warehouse_id = $1 ORDER BY created_at DESC', [locationId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching moves by location:', error);
    res.status(500).json({ error: 'Failed to fetch warehouse history' });
  }
};

module.exports = { getAllMoves, getMovesByProduct, getMovesByLocation };
