const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    categoryImage: {
        type: String, 
    },
    sections: [{
        sectionName: {
            type: String,
            required: true
        },
        items: [{
            itemName: { type: String, required: true },
            slug: { type: String } 
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);