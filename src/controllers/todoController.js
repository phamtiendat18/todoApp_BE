const SharedTodo = require("../models/sharedTodos");
const Todos = require("../models/todos");

const createTodo = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;

    const todo = await Todos.create({
      title,
      description,
      deadline,
      priority,
      owner_id: req.user?.id,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Không thể tạo todo" });
  }
};

const getTodos = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const { count, rows } = await Todos.findAndCountAll({
      offset: (page - 1) * limit,
      limit: limit,
      where: { owner_id: req.user.id },
    });

    res.json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      message: "Get todos success.",
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách todos" });
  }
};

const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const todo = await Todos.findOne({ where: { id } });

    if (!todo) {
      return res.status(404).json({ error: "Todo không tồn tại" });
    }

    if (todo.owner_id !== userId) {
      const shared = await SharedTodo.findOne({
        where: { todo_id: id, user_id: userId },
      });

      if (!shared) {
        return res
          .status(403)
          .json({ error: "Bạn không có quyền xem todo này" });
      }
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Không thể lấy todo" });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, priority } = req.body;
    const userId = req.user?.id;

    const todo = await Todos.findOne({ where: { id } });

    if (!todo) {
      return res.status(404).json({ error: "Todo không tồn tại" });
    }

    if (todo.owner_id !== userId) {
      const shared = await SharedTodo.findOne({
        where: { todo_id: id, user_id: userId },
      });

      if (!shared || !JSON.parse(shared.permission).includes("edit")) {
        return res
          .status(403)
          .json({ error: "Bạn không có quyền sửa todo này" });
      }
    }

    await todo.update({
      title: title ?? todo.title,
      description: description ?? todo.description,
      deadline: deadline ?? todo.deadline,
      priority: priority ?? todo.priority,
    });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Không thể cập nhật todo" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const todo = await Todos.findOne({ where: { id } });

    if (!todo) {
      return res.status(404).json({ error: "Todo không tồn tại" });
    }

    if (todo.owner_id !== userId) {
      return res.status(403).json({ error: "Bạn không có quyền xóa todo này" });
    }

    await todo.destroy();

    res.json({ message: "Todo đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: "Không thể xóa todo" });
  }
};

module.exports = { createTodo, getTodos, getTodo, updateTodo, deleteTodo };
