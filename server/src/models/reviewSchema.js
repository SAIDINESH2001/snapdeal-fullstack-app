const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SnapDeal-Products',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userName: {
        type: String, 
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxLength: [500, "Review cannot exceed 500 characters"]
    },
    images: [String],
    isVerifiedPurchase: {
        type: Boolean,
        default: true 
    }
}, { timestamps: true });


reviewSchema.index({ user: 1, productId: 1 }, { unique: true });
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;