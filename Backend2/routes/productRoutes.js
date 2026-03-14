const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// All routes are prepended with /api/v1/products in index.js
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProductBySku); // Must be before /:id to prevent matching
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
