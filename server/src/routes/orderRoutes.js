const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers');
const auth = require('../middlewares/authHandler');
const {authorize} = require('../middlewares/roleHandler');

router.post('/create', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/orders', auth, authorize('admin'), orderController.getAllOrders);
router.patch('/orders/:orderId/status', auth, authorize('admin'), orderController.updateOrderStatus);
router.get('/my-orders/:orderId', auth, orderController.getOrderDetail);
router.post('/my-orders/:orderId/:action', auth, orderController.handleOrderAction);


module.exports = router;