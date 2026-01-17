const express = require('express');
const cartControllers = require('../controllers/cartControllers');
const router = express.Router();
const auth = require('../middlewares/authHandler');
const {authorize} = require('../middlewares/roleHandler');



router.post('/users/addToCart/:productId', auth, authorize('customer'), cartControllers.addProductToCart);
router.get('/users/getCart', auth, authorize('customer'), cartControllers.getCartProducts);



module.exports = router;