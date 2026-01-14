const express = require('express');
const router = express.Router();
const categoryControllers = require('../controllers/categoryControllers');


router.post('/categories', categoryControllers.createCategory);
router.get('/categories', categoryControllers.getAllCategories);

module.exports = router;