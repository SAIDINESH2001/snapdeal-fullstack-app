const express = require('express');
const router = express.Router();
const reviewControllers = require('../controllers/reviewControllers');
const authHandler = require('../middlewares/authHandler');

router.post("/products/:productId/reviews", authHandler, reviewControllers.upsertReview);
router.get("/products/:productId/reviews", reviewControllers.getProductReviews);
router.delete("/products/:productId/reviews", authHandler, reviewControllers.deleteReview);


module.exports = router;