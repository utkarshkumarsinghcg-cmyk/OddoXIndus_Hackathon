const express = require('express');
const router = express.Router();
const inventoryStockController = require('../controllers/inventoryStockController');

router.get('/', inventoryStockController.getAllInventory);
router.get('/product/:productId', inventoryStockController.getInventoryByProduct);
router.get('/location/:locationId', inventoryStockController.getInventoryByLocation);

module.exports = router;
