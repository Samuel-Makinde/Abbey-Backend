const express = require("express");
const router = express.Router();
const authController = require("../controller/Authentication/auth")

router.post("/user/signup", authController.signUp);
router.post("/user/login", authController.login);
module.exports = router;