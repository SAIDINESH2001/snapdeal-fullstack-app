const mongoose = require("mongoose");
const Review = require("../models/reviewSchema");
const Product = require("../models/productSchema");
async function recalcProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const ratingData = stats[0] || { avgRating: 0, count: 0 };

  await Product.findByIdAndUpdate(productId, {
    ratingAverage: Number(ratingData.avgRating.toFixed(1)),
    ratingCount: ratingData.count,
  });
}
module.exports = recalcProductRating;
