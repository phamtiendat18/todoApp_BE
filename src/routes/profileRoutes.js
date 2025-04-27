var express = require("express");
const {
  authenticateUser,
  verifyUser,
} = require("../middlewares/authMiddleware");
const {
  getMyProfile,
  uploadAvatar,
  searchUsers,
} = require("../controllers/userController");
const upload = require("../middlewares/upload");
var router = express.Router();

router.get("/", authenticateUser, getMyProfile);
router.post(
  "/upload-avatar/:id",
  verifyUser,
  upload.single("avatar"),
  uploadAvatar
);
router.get("/search", searchUsers);

module.exports = router;
