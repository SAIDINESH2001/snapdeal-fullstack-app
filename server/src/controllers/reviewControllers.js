const Review = require("../models/reviewSchema");
const Order = require("../models/orderSchema"); 
const Products = require("../models/productSchema");
const recalcProductRating = require('../utils/ratingCalculator');

exports.upsertReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment, images = [] } = req.body;
  const userId = req.user.id;

  try {
    const hasOrdered = await Order.findOne({
      user: userId,
      orderStatus: "Delivered",
      "items.productId": productId
    });

    if (!hasOrdered) {
      return res.status(403).json({ 
        success: false, 
        message: "Eligibility failed: You can only review products that have been delivered to you." 
      });
    }

    const review = await Review.findOneAndUpdate(
      { productId: productId, user: userId }, 
      { 
        rating, 
        title, 
        comment, 
        images,
        isVerifiedPurchase: true 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await recalcProductRating(productId);

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  try {
    const reviews = await Review.find({ productId: productId }) 
      .populate({ path: "user", model: "users", select: "name" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(`Found ${reviews.length} reviews for ID: ${productId}`); // Debug log

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  await Review.findOneAndDelete({ product: productId, user: userId });
  await recalcProductRating(productId);

  res.json({ success: true });
};


exports.checkEligibility = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const hasOrdered = await Order.findOne({
      user: userId,
      orderStatus: "Delivered",
      "items.productId": productId
    });

    const existingReview = await Review.findOne({ 
        productId: productId, 
        user: userId 
    });

    res.json({ 
      eligible: !!hasOrdered, 
      alreadyReviewed: !!existingReview 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};