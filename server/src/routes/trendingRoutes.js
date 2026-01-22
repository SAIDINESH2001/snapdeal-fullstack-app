const express = require('express');
const router = express.Router();
const { getTrendingByContext } = require('../controllers/trendingControllers');

router.get('/', getTrendingByContext);

module.exports = router;