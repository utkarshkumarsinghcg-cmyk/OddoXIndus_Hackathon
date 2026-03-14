const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');

router.get('/', transferController.getAllTransfers);
router.get('/:id', transferController.getTransferById);
router.post('/', transferController.createTransfer);

module.exports = router;
