const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    pid: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: [
        {
            type: String,
            required: true
        }
    ],
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
    categories : [
        {
            type: String,
            trim: true,
            required: true,
        }
    ],
    crawledAt: {
        type: String,
        default: null,
    },
    discount: {
        type: String,
        required: true,
        trim: true,
    },
    isFkAdvantage: {
        type: Boolean,
        default: false,
    },
    mrp: {
        type: String,
        required: true,
        trim: true,
    },
    purl: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: String,
        required: true,
        trim: true,
    },
    reviewRatings: {
        type: String,
        required: true,
        trim: true,
    },
    ratingsCount: {
        type: String,
        required: true,
        trim: true,
    },
    reviewsCount: {
        type: String,
        required: true,
        trim: true,
    },
    specifications: {
        type: String,
        required: true,
        trim: true,
    }
});

const Products = mongoose.model('products', productSchema);
module.exports = Products;