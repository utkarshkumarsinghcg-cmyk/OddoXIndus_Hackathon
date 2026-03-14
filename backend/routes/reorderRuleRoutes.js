const express = require('express');
const router = express.Router();
const reorderRuleController = require('../controllers/reorderRuleController');

// All routes are prepended with /api/v1/reorder-rules in index.js
router.get('/', reorderRuleController.getAllReorderRules);
router.post('/', reorderRuleController.createReorderRule);
router.put('/:id', reorderRuleController.updateReorderRule);
router.delete('/:id', reorderRuleController.deleteReorderRule);

module.exports = router;
