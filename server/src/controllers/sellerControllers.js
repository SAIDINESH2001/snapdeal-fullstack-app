const Products = require('../models/productSchema');

exports.getSellerProductsById = async(req, res, next) => {
    try {
        const sellerId = req.user.id;
        const products = await Products.find({sellerId});
        console.log(sellerId)
        if(!products) {
            return res.status(404).json({
                success: true,
                message: 'No Products available for this seller'
            })
        }
        return res.json({
            success: true,
            message: 'Products are available',
            products,
            count: products.length,
        })
    }
    catch(error) {
        next(error);
    }
}