const express = require('express');
const userControllers = require('../controllers/userControllers');
const router = express.Router();
const auth = require('../middlewares/authHandler');
const razorPayController = require('../controllers/paymentControllers');


router.post('/users/check', userControllers.checkUser);
router.post('/users/register', userControllers.postUser);
router.get('/users/profile', auth, userControllers.getUserProfile);
router.post('/add-address', auth, userControllers.addAddress);
router.post('/users/create-order', auth, razorPayController.createRazorpayOrder);
router.post('/users/verify-payment', auth, razorPayController.verifyPayment);
router.post('/seller/auth/register', userControllers.registerSeller);
router.post('/users/reset-password', userControllers.resetPassword);


module.exports = router;