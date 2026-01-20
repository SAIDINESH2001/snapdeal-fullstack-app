const express = require('express');
const router = express.Router();
const reviewControllers = require('../controllers/reviewControllers');
const authHandler = require('../middlewares/authHandler');

router.post("/reviews/upsert/:productId", authHandler, reviewControllers.upsertReview);
router.get("/products/:productId/reviews", reviewControllers.getProductReviews);
router.delete("/products/:productId/reviews", authHandler, reviewControllers.deleteReview);
router.get('/reviews/check-eligibility/:productId', authHandler, reviewControllers.checkEligibility);


module.exports = router;