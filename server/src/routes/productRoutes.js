const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authHandler'); 
const { authorize } = require('../middlewares/roleHandler');

//Routes that can be accessed by everyone
router.get('/products/pending', productController.getProductByStatus);
router.get('/products/:productId', productController.getProductById);
router.get('/products/:productMainCategory/:subCategory/:productType', productController.getProductsByCategory);


//Routes that can be accessed by only seller and admin
router.post(
    '/products', 
    auth, 
    authorize('seller', 'admin'), 
    productController.postProduct
);

//Route that can be accessed by admin only
router.patch(
    '/products/:productId/status', 
    auth, 
    authorize('admin'), 
    productController.updateProductStatus
);

module.exports = router;