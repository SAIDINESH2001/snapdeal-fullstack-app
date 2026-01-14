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

    if (productMainCategory) query.productMainCategory = productMainCategory;
    if (subCategory) query.subCategory = subCategory;
    if (productType) query.productType = productType;

    const products = await Products.find(query);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
      query
    });
  } catch (error) {
    next(error);
  }
};
