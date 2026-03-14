const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

// Note: Assuming creating Categories shouldn't rely strictly on protect but the requirement says: "All product APIs must use JWT authentication". Category APIs might need it too. Let's add protect just to be safe or leave open if not specified. I'll add protect to be secure.
router.route('/').post(protect, createCategory).get(protect, getCategories);

module.exports = router;
