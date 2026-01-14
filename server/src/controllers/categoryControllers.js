const Category = require('../models/categoriesSchema');

exports.createCategory = async (req, res, next) => {
    try {
        const { categoryName, categoryImage, sections } = req.body;

        if (!categoryName || !sections) {
            return res.status(400).json({ message: "Category name and sections are required." });
        }


        const newCategory = new Category({
            categoryName,
            categoryImage,
            sections 
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({
            message: "Category created successfully",
            data: savedCategory
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCategories = async (req, res,next) => {
    try {
        const categories = await Category.find({});

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};
