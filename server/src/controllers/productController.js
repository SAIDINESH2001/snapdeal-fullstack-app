const Products = require('../models/productSchema');
const productValidation = require('../validations/productValidation');

exports.postProduct = async (req, res, next) => {
  try {
    const validationResult = productValidation(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.errors,
      });
    }

    const { pid } = req.body;

    const existingProduct = await Products.findOne({ pid });
    if (existingProduct) {
      return res.status(409).json({
        error: "Product already exists",
      });
    }

    const createdProduct = await Products.create(req.body);

    return res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { productMainCategory, subCategory, productType } = req.params;

    const query = {};

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


exports.getProductById = async(req,res,next) => {
  try {
    const {productId} = req.params;
    if(!productId) {
      res.status(400).json({
        success: false,
        message: 'Bad Request'
      })
    }

    const product = await Products.findById({_id : productId});
    if(!product) {
      return res.status(400).json({
        success: false,
        message: 'No Product Found with this id'
      })
    }
    return res.json({
      success: true,
      message: 'Product is available',
      data: product,
    })

  }
  catch(error) {
    next(err);
  }
}