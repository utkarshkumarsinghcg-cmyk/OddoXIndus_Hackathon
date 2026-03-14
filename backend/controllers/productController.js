const pool = require('../db/pool');

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Products ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// GET single product by id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Products WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// POST create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || price === undefined || price < 0) {
      return res.status(400).json({ error: 'name and a valid price are required' });
    }
    const result = await pool.query(
      'INSERT INTO Products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description || null, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// PUT update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const result = await pool.query(
      'UPDATE Products SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price) WHERE id = $4 RETURNING *',
      [name, description, price, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Products WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
