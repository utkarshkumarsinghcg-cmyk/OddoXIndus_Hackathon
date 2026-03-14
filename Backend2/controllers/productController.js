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

// GET product by sku (/search?sku=...)
const searchProductBySku = async (req, res) => {
  try {
    const { sku } = req.query;
    if (!sku) {
      return res.status(400).json({ error: 'sku query parameter is required' });
    }
    const result = await pool.query('SELECT * FROM Products WHERE sku = $1', [sku]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found with given SKU' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error searching product by SKU:', error);
    res.status(500).json({ error: 'Failed to search product' });
  }
};

// GET products by category (/category/:categoryId)
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await pool.query('SELECT * FROM Products WHERE category_id = $1 ORDER BY id ASC', [categoryId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
};


// POST create product
const createProduct = async (req, res) => {
  try {
    const { sku, name, description, price, category_id } = req.body;
    if (!sku || !name || price === undefined || price < 0) {
      return res.status(400).json({ error: 'sku, name and a valid price are required' });
    }
    const result = await pool.query(
      'INSERT INTO Products (sku, name, description, price, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [sku, name, description || null, price, category_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
       return res.status(409).json({ error: 'SKU already exists' });
    }
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// PUT update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, name, description, price, category_id } = req.body;
    const result = await pool.query(
      'UPDATE Products SET sku = COALESCE($1, sku), name = COALESCE($2, name), description = COALESCE($3, description), price = COALESCE($4, price), category_id = COALESCE($5, category_id) WHERE id = $6 RETURNING *',
      [sku, name, description, price, category_id, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
       return res.status(409).json({ error: 'SKU already exists' });
    }
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

module.exports = { 
    getAllProducts, 
    getProductById, 
    searchProductBySku, 
    getProductsByCategory, 
    createProduct, 
    updateProduct, 
    deleteProduct 
};
