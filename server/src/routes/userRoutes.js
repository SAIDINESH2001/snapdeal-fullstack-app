const express = require('express');
const userControllers = require('../controllers/userControllers');
const router = express.Router();
const auth = require('../middlewares/authHandler');


router.post('/users/check', userControllers.checkUser);
router.post('/users/register', userControllers.postUser);
router.get('/users/profile', auth, userControllers.getUserProfile);
router.post('/add-address', auth, userControllers.addAddress);

module.exports = router;