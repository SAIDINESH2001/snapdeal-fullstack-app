const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authHandler");
const { getMe } = require("../controllers/authControllers");

router.get("/auth/refresh", auth, getMe);

module.exports = router;