var express = require("express");
const {
  authenticateUser,
  verifyUser,
} = require("../middlewares/authMiddleware");
const { searchUsers } = require("../controllers/userController");
var router = express.Router();

router.get("/search", searchUsers);

module.exports = router;
