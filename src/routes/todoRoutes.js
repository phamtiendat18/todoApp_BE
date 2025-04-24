const express = require("express");
const { createTodo, getTodos } = require("../controllers/todoController");
const {
  authenticateUser,
  verifyUser,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createTodo);
router.get("/:id", verifyUser, getTodos);

module.exports = router;
