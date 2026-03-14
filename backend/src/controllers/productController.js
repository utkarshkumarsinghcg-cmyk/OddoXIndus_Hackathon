const productService = require('../services/productService');

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, unit, stock, categoryId } = req.body;
    if (!name || !sku || !unit || stock === undefined || !categoryId) {
      res.status(400);
      throw new Error('Please add all required fields (name, sku, unit, stock, categoryId)');
    }
    const product = await productService.createProduct(name, sku, unit, stock, categoryId);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const response = await productService.deleteProduct(req.params.id);
    res.json(response);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
