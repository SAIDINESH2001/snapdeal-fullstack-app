const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')


router.post('/products/', productController.postProduct);
router.get('/products/:productMainCategory/:subCategory/:productType', productController.getProductsByCategory);


module.exports = router;