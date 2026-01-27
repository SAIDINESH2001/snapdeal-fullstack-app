const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authHandler'); 
const { authorize } = require('../middlewares/roleHandler');

router.get('/products/search', productController.getSearchProducts);
router.get('/products/pending', productController.getProductByStatus);
router.get('/products/:productId', productController.getProductById);
router.get('/products/trending/:keyword', productController.getProductsByTrending);
router.get('/products/mainCategory/:mainCategory', productController.getProductByMainCategory);
router.get('/products/:productMainCategory/:subCategory/:productType', productController.getProductsByCategory);
router.get('/products/admin/all', auth, authorize('admin'), productController.getAllProductsAdmin);

router.post('/products', auth, authorize('seller', 'admin'), productController.postProduct);
router.patch('/products/:productId/status', auth, authorize('admin'), productController.updateProductStatus);

module.exports = router;