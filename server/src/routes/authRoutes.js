const express = require("express");
const router = express.Router();
const {
  firebaseLogin,
} = require("../controllers/fireAuthControllers");

router.post("/firebase-login", firebaseLogin);

module.exports = router;
