const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { register, login, profile } = require("../controller/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);

module.exports = router;
