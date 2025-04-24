const SharedTodo = require("../models/sharedTodos");
const Todo = require("../models/todos");

const shareTodo = async (req, res) => {
  const todo_id = req.params.id;
  const { shared_with, permission } = req.body;

  try {
    const todo = await Todo.findOne({
      where: { id: todo_id, owner_id: req.user.id },
    });

    if (!todo) {
      return res
        .status(403)
        .json({ error: "You do not have permission to share!" });
    }

    let sharedTodo = await SharedTodo.findOne({
      where: { todo_id, shared_with },
    });

    let newPermissions = new Set(["view"]); // ✅ Luôn có "view"

    if (Array.isArray(permission) && permission.includes("edit")) {
      newPermissions.add("edit"); // ✅ Thêm "edit" nếu có
    }

    if (sharedTodo) {
      sharedTodo.permission = Array.from(newPermissions);
      await sharedTodo.save();
      return res
        .status(200)
        .json({
          message: "Permissions updated successfully.",
          updatedPermissions: sharedTodo.permission,
        });
    }

    await SharedTodo.create({
      todo_id,
      shared_with,
      permission: Array.from(newPermissions),
    });

    return res
      .status(201)
      .json({
        message: "Shared successfully.",
        permission: Array.from(newPermissions),
      });
  } catch (error) {
    console.error("Error while sharing:", error);
    return res.status(500).json({ error: "Error: Sharing failed!" });
  }
};

const deleteUserPermission = async (req, res) => {
  const todo_id = req.params.id;
  const { user_id } = req.body;

  try {
    const todo = await Todo.findOne({
      where: { id: todo_id, owner_id: req.user.id },
    });

    if (!todo) {
      return res
        .status(403)
        .json({ error: "You do not have permission to share!" });
    }

    const sharedTodo = await SharedTodo.findOne({
      where: { todo_id: todo_id, shared_with: user_id },
    });
    if (!sharedTodo) {
      return res
        .status(400)
        .json({ error: "You have not shared for this user!" });
    }
    await SharedTodo.destroy();
    res.status(200).json({
      message: `Deleted success!`,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports = { shareTodo, deleteUserPermission };
