const Review = require("../models/reviewSchema");
const Products = require("../models/productSchema");
const recalcProductRating = require('../utils/ratingCalculator')

exports.upsertReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment, images = [] } = req.body;
  const userId = req.user.id;

  const review = await Review.findOneAndUpdate(
    { product: productId, user: userId },
    { rating, title, comment, images },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await recalcProductRating(productId);

  res.status(200).json({ success: true, review });
};

exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const reviews = await Review.find({ product: productId })
    .populate({ path: "user", model: "users", select: "name" })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ success: true, reviews });
};

exports.deleteReview = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  await Review.findOneAndDelete({ product: productId, user: userId });
  await recalcProductRating(productId);

  res.json({ success: true });
};

