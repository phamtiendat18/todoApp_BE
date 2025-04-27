const express = require("express");
const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const {
  authenticateUser,
  verifyUser,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createTodo);
router.get("/", authenticateUser, getTodos);
router.get("/todos/:id", authenticateUser, getTodo);
router.put("/todos/:id", authenticateUser, updateTodo);
router.delete("/todos/:id", authenticateUser, deleteTodo);

module.exports = router;
