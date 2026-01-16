const Products = require('../models/productSchema');
const productValidation = require('../validations/productValidation');


exports.postProduct = async (req, res, next) => {
  try {
    const validation = productValidation(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "We couldn't save your product. Please check the details.",
        details: validation.errors, 
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false, 
        error: "Session expired. Please log in again." 
      });
    }

    const productData = { 
        ...req.body,
        sellerId: req.user.id,
        status: req.user.role === 'admin' ? 'approved' : 'pending'
    };

    const createdProduct = await Products.create(productData);

    return res.status(201).json({
      success: true,
      message: req.user.role === 'admin' 
        ? "Product created and is now live!" 
        : "Product submitted! It will appear on the site once an admin approves it.",
      product: createdProduct,
    });

  } catch (error) {
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A product with this unique ID already exists."
        });
    }
    next(error);
  }
};
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { productMainCategory, subCategory, productType } = req.params;
    const query = { status: 'approved' };

    if (productMainCategory && productMainCategory !== 'undefined') {
        query.productMainCategory = productMainCategory;
    }
    
    if (subCategory && subCategory !== 'undefined') {
        query.subCategory = subCategory;
    }
    
    if (productType && productType !== 'undefined') {
        query.productType = productType;
    }

    const products = await Products.find(query);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
      appliedFilters: query
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async(req, res, next) => {
  try {
    const { productId } = req.params;
    
    if(!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    const product = await Products.findOne({ _id: productId, status: 'approved' });
    
    if(!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not yet approved'
      });
    }

    return res.json({
      success: true,
      message: 'Product is available',
      data: product,
    });

  }
  catch(error) {
    next(error); 
  }
}

exports.updateProductStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { status } = req.body; 

    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { status },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: `Product status updated to ${status}`,
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductByStatus = async(req,res,next) => {
  try {
    const products = await Products.find({status: 'pending'});
    res.json({
      success: true,
      message: 'Products with Pending Status are available',
      data: products,
    })
  }
  catch(error) {
    next(error);
  }
}