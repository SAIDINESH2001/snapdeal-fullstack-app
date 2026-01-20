const mongoose = require("mongoose");
const Review = require("../models/reviewSchema");
const Product = require("../models/productSchema");

async function recalcProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } }, 
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const ratingData = stats[0] || { avgRating: 0, count: 0 };

  await Product.findByIdAndUpdate(productId, {
    rating: Number(ratingData.avgRating.toFixed(1)),
    ratingsCount: ratingData.count,
    reviewsCount: ratingData.count 
  });
}

module.exports = recalcProductRating;