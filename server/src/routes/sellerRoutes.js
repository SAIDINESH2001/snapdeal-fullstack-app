const express = require('express');
const router = express.Router();
const sellerControllers = require('../controllers/sellerControllers');
const auth = require('../middlewares/authHandler'); 
const { authorize } = require('../middlewares/roleHandler');


router.get('/seller/products', auth, authorize('seller'), sellerControllers.getSellerProductsById);


module.exports = router;