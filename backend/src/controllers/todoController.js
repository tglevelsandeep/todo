const todoService = require("../services/todoService");

/**
 * GET /api/todos
 */
const getTodos = async (req, res, next) => {
  try {
    const todos = await todoService.getTodos(req.user.id);
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/todos
 */
const createTodo = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a todo title",
      });
    }

    const todo = await todoService.createTodo(req.user.id, title.trim());
    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/todos/:id
 */
const deleteTodo = async (req, res, next) => {
  try {
    await todoService.deleteTodo(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/todos/:id/toggle
 */
const toggleTodo = async (req, res, next) => {
  try {
    const todo = await todoService.toggleTodo(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodos, createTodo, deleteTodo, toggleTodo };
