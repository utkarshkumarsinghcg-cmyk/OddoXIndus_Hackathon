const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

router.get('/', receiptController.getAllReceipts);
router.get('/:id', receiptController.getReceiptById);
router.post('/', receiptController.createReceipt);
router.put('/:id', receiptController.updateReceipt);
router.delete('/:id', receiptController.deleteReceipt);
router.post('/:id/validate', receiptController.validateReceipt);

module.exports = router;
