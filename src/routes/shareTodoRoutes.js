const express = require("express");
const {
  shareTodo,
  deleteUserPermission,
} = require("../controllers/shareController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:id", authenticateUser, shareTodo);
router.delete(
  "/delete-user-permission/:id",
  authenticateUser,
  deleteUserPermission
);

module.exports = router;
