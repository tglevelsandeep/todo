const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getTodos,
  createTodo,
  deleteTodo,
  toggleTodo,
} = require("../controllers/todoController");

// All todo routes are protected
router.use(protect);

router.route("/").get(getTodos).post(createTodo);
router.delete("/:id", deleteTodo);
router.patch("/:id/toggle", toggleTodo);

module.exports = router;
