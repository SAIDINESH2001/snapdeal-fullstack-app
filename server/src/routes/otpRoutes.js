const express = require('express');
const router = express.Router();
const otpControllers = require('../controllers/otpControllers');



router.post('/auth/send-otp', otpControllers.sendOtp);
router.post('/auth/verify-otp', otpControllers.verifyOtp);


module.exports = router;