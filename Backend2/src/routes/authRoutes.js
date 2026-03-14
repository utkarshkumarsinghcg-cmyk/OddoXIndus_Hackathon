const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  verifyPhoneOTP,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/verify-phone-otp', protect, verifyPhoneOTP);

module.exports = router;
