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

module.exports = { createTodo, getTodos };
