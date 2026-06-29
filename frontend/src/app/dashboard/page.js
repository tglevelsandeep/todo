"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function DashboardPage() {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }, [router]);

  // ── Fetch todos ──
  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 401) return logout();
      const data = await res.json();
      if (data.success) setTodos(data.data);
    } catch {
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // ── Auth check + initial fetch ──
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        // Run asynchronously to avoid set-state-in-effect lint error
        Promise.resolve().then(() => setUser(JSON.parse(stored)));
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
  }, [fetchTodos, router]);

  // ── Create todo ──
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setAdding(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title: newTodo.trim() }),
      });
      if (res.status === 401) return logout();
      const data = await res.json();
      if (data.success) {
        setTodos((prev) => [data.data, ...prev]);
        setNewTodo("");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to create todo");
    } finally {
      setAdding(false);
    }
  };

  // ── Delete todo ──
  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 401) return logout();
      const data = await res.json();
      if (data.success) {
        setTodos((prev) => prev.filter((t) => t._id !== id));
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to delete todo");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Toggle todo ──
  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/todos/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 401) return logout();
      const data = await res.json();
      if (data.success) {
        setTodos((prev) =>
          prev.map((t) => (t._id === id ? data.data : t))
        );
      }
    } catch {
      setError("Failed to update todo");
    }
  };

  // ── Format date ──
  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // ── Stats ──
  const activeTodos = todos.filter((t) => !t.completed).length;
  const completedTodos = todos.filter((t) => t.completed).length;

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="glass-card glass-card-wide">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="page-title" style={{ textAlign: "left", fontSize: "1.5rem", marginBottom: "0.25rem" }}>
              Taskflow
            </h1>
            <p className="greeting">
              Hello, <strong>{user?.name || "User"}</strong>
            </p>
          </div>
          <button id="logout-btn" className="btn btn-ghost" onClick={logout}>
            Sign Out →
          </button>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Add todo */}
        <form onSubmit={handleAdd} className="todo-input-row">
          <input
            id="new-todo-input"
            type="text"
            className="form-input"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            maxLength={200}
            autoComplete="off"
          />
          <button
            id="add-todo-btn"
            type="submit"
            className="btn btn-primary"
            disabled={adding || !newTodo.trim()}
          >
            {adding ? <span className="spinner"></span> : "+ Add"}
          </button>
        </form>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="stats-bar">
            <span>
              <span className="stats-dot active"></span>
              {activeTodos} active
            </span>
            <span>
              <span className="stats-dot done"></span>
              {completedTodos} completed
            </span>
          </div>
        )}

        {/* Todo list */}
        {todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <p>No todos yet. Add your first task above!</p>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo._id)}
                  aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
                />
                <span className="todo-text">{todo.title}</span>
                <span className="todo-date">{formatDate(todo.createdAt)}</span>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(todo._id)}
                  disabled={deletingId === todo._id}
                  aria-label={`Delete "${todo.title}"`}
                >
                  {deletingId === todo._id ? (
                    <span className="spinner"></span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
