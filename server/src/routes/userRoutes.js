const express = require('express');
const userControllers = require('../controllers/userControllers');
const router = express.Router();


router.post('/users/check', userControllers.checkUser);
router.post('/users/register', userControllers.postUser);

module.exports = router;