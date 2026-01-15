const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        trim: true,
        required: true,
    },
    brand: {
        type: String,
        trim: true,
        required: true,
    },
    productMainCategory: {
        type: String,
        required: true,
        enum: ["Men's Fashion", "Women's Fashion", "Home & Kitchen", "Kid's Fashion", "Beauty & Health", "Electronics"], 
        index: true
    },
    productType: {
        type: String, 
        required: true,
        trim: true,
        index: true
    },
    genderCategory: {
        type: String,
        required: true,
        enum: ["Men", "Women", "Unisex", "Boys", "Girls"],
        default: "Unisex",
        index:true
    },
    subCategory: {
        type: String,
        required: true,
        trim: true,
        index:true
    },
    sizes: [{
        type: String, 
        trim: true
    }],
    stockQuantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    discount: {
        type: Number,
        required: true,
        index: true
    },
    mrp: {
        type: Number,
        required: true,
    },
    sellingPrice: { 
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewRatings: {
        type: String,
        trim: true,
    },
    ratingsCount: {
        type: Number,
        default: 0
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    specifications: {
        type: Map, 
        of: String
    }
}, { 
    timestamps: true
});

const Products = mongoose.model('SnapDeal-Products', productSchema);
module.exports = Products;


