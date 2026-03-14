const express = require('express');
const router = express.Router();
const adjustmentController = require('../controllers/adjustmentController');

router.get('/', adjustmentController.getAllAdjustments);
router.get('/:id', adjustmentController.getAdjustmentById);
router.post('/', adjustmentController.createAdjustment);
router.put('/:id', adjustmentController.updateAdjustment);
router.delete('/:id', adjustmentController.deleteAdjustment);

module.exports = router;
