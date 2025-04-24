const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/authController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", authenticateUser, refreshToken);
router.post("/logout", authenticateUser, logout);

module.exports = router;
