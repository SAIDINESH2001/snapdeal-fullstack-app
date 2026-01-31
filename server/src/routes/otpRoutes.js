const express = require('express');
const router = express.Router();
const otpControllers = require('../controllers/otpControllers');



router.post('/auth/send-otp', otpControllers.sendOtp);
router.post('/auth/verify-otp', otpControllers.verifyOtp);
router.post('/users/password-validate', otpControllers.loginWithPassword);


module.exports = router;