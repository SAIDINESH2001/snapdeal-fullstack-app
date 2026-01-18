const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers');
const auth = require('../middlewares/authHandler');

router.post('/create', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);

module.exports = router;