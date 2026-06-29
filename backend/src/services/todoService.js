const Todo = require("../models/Todo");

/**
 * Get all todos for a user, sorted newest first.
 * @param {string} userId
 * @returns {Array} todos
 */
const getTodos = async (userId) => {
  return Todo.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Create a new todo for a user.
 * @param {string} userId
 * @param {string} title
 * @returns {object} todo
 */
const createTodo = async (userId, title) => {
  const todo = await Todo.create({ title, user: userId });
  return todo;
};

/**
 * Delete a todo, ensuring the requesting user owns it.
 * @param {string} userId
 * @param {string} todoId
 * @returns {object} deleted todo
 */
const deleteTodo = async (userId, todoId) => {
  const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });
  if (!todo) {
    const error = new Error("Todo not found or not authorized");
    error.statusCode = 404;
    throw error;
  }
  return todo;
};

/**
 * Toggle completed status of a todo.
 * @param {string} userId
 * @param {string} todoId
 * @returns {object} updated todo
 */
const toggleTodo = async (userId, todoId) => {
  const todo = await Todo.findOne({ _id: todoId, user: userId });
  if (!todo) {
    const error = new Error("Todo not found or not authorized");
    error.statusCode = 404;
    throw error;
  }
  todo.completed = !todo.completed;
  await todo.save();
  return todo;
};

module.exports = { getTodos, createTodo, deleteTodo, toggleTodo };
