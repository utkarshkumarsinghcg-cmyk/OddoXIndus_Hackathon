const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// 1️⃣ POST /receipts
router.post('/receipts', inventoryController.addReceipt);

// 2️⃣ POST /delivery
router.post('/delivery', inventoryController.addDelivery);

// 3️⃣ POST /transfer
router.post('/transfer', inventoryController.addTransfer);

// 4️⃣ POST /adjustment
router.post('/adjustment', inventoryController.addAdjustment);

// 5️⃣ GET /inventory-history
router.get('/inventory-history', inventoryController.getInventoryHistory);

module.exports = router;
