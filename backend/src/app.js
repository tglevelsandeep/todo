const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// --------------- Health Check ---------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// --------------- Routes ---------------
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// --------------- 404 Handler ---------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// --------------- Error Handler ---------------
app.use(errorHandler);

module.exports = app;
