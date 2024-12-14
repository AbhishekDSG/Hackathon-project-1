const express = require('express');
const { registerUser, verifyOTP, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
