const productValidation = (data) => {
    const{
            pid,
            name,
            image,
            description,
            brand,
            productMainCategory,
            subCategory,
            productType,
            genderCategory,
            sizes,
            stockQuantity,
            mrp,
            discount,
            sellingPrice,
            purl,
            rating,
            ratingsCount,
            reviewsCount,
            specifications
        } = data;

    const errors = [];

    const requiredStrings = { pid, name, description, brand, productMainCategory, subCategory, productType, genderCategory, purl };
    
    for (const [key, value] of Object.entries(requiredStrings)) {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
            errors.push(`${key} is required and must be a non-empty string.`);
        }
    }

    if (!Array.isArray(image) || image.length === 0) {
        errors.push("At least one product image URL is required in an array.");
    }
    if (!Array.isArray(sizes) || sizes.length === 0) {
        errors.push("Product sizes must be provided as an array.");
    }

    if (typeof stockQuantity !== 'number' || stockQuantity < 0) {
        errors.push("Stock quantity must be a positive number.");
    }
    if (typeof mrp !== 'number' || mrp <= 0) {
        errors.push("MRP must be a number greater than zero.");
    }
    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
        errors.push("Discount must be a percentage between 0 and 100.");
    }
    if (typeof sellingPrice !== 'number' || sellingPrice > mrp) {
        errors.push("Selling price cannot exceed the MRP.");
    }

    if (rating && (rating < 0 || rating > 5)) {
        errors.push("Rating must be between 0 and 5.");
    }

    if (specifications && (typeof specifications !== 'object' || Array.isArray(specifications))) {
        errors.push("Specifications must be a key-value object.");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

module.exports = productValidation;