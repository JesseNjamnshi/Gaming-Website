const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

// 🔥 NEW
router.get("/verify/:token", authController.verifyEmail);

router.put("/reset-password", authController.resetPassword);

module.exports = router;