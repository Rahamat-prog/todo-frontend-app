import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getTodos, getTodoStats, createTodo, updateTodo, toggleTodo, deleteTodo } from "../api";
import { useAuth } from "../context/AuthContext";
import TodoItem from "../components/TodoItem";
import TodoModal from "../components/TodoModal";
import StatsBar from "../components/StatsBar";
import "./Dashboard.css";
import ThemeToggle from "../components/ThemeToggle";

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState({ priority: "", completed: "", search: "" });

  const fetchTodos = useCallback(async () => {
    try {
      const params = {};
      if (filter.priority) params.priority = filter.priority;
      if (filter.completed !== "") params.completed = filter.completed;
      if (filter.search) params.search = filter.search;
      const res = await getTodos(params);
      setTodos(res.data.data.todos);
    } catch {
      toast.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getTodoStats();
      setStats(res.data.data.stats);
    } catch {}
  }, []);

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [fetchTodos, fetchStats]);

  const handleSave = async (data) => {
    try {
      if (editingTodo) {
        await updateTodo(editingTodo._id, data);
        toast.success("Todo updated!");
      } else {
        await createTodo(data);
        toast.success("Todo created!");
      }
      setModalOpen(false);
      setEditingTodo(null);
      fetchTodos();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTodo(id);
      fetchTodos();
      fetchStats();
    } catch {
      toast.error("Failed to toggle todo");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      toast.success("Todo deleted");
      fetchTodos();
      fetchStats();
    } catch {
      toast.error("Failed to delete todo");
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">✓ Todos</div>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${filter.completed === "" ? "active" : ""}`}
            onClick={() => setFilter({ ...filter, completed: "" })}
          >
            <span>📋</span> All Todos
          </button>
          <button
            className={`nav-item ${filter.completed === "false" ? "active" : ""}`}
            onClick={() => setFilter({ ...filter, completed: "false" })}
          >
            <span>⏳</span> Incomplete
          </button>
          <button
            className={`nav-item ${filter.completed === "true" ? "active" : ""}`}
            onClick={() => setFilter({ ...filter, completed: "true" })}
          >
            <span>✅</span> Completed
          </button>
        </nav>

        <div className="priority-filters">
          <div className="filter-label">Priority</div>
          {["", "high", "medium", "low"].map((p) => (
            <button
              key={p}
              className={`priority-btn ${filter.priority === p ? "active" : ""} ${p}`}
              onClick={() => setFilter({ ...filter, priority: p })}
            >
              {p === "" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <ThemeToggle />
        <button className="logout-btn" onClick={logoutUser}>
          Sign out
        </button>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="main-header">
          <div>
            <h1>My Todos</h1>
            <p className="main-sub">
              {todos.length} {todos.length === 1 ? "task" : "tasks"}
              {filter.priority && ` · ${filter.priority} priority`}
              {filter.completed === "true" && " · completed"}
              {filter.completed === "false" && " · incomplete"}
            </p>
          </div>
          <button
            className="add-btn"
            onClick={() => { setEditingTodo(null); setModalOpen(true); }}
          >
            + New Todo
          </button>
        </div>

        {stats && <StatsBar stats={stats} />}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search todos..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </div>

        <div className="todo-list">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No todos found</p>
              <button
                className="add-btn small"
                onClick={() => { setEditingTodo(null); setModalOpen(true); }}
              >
                + Add your first todo
              </button>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>

      {modalOpen && (
        <TodoModal
          todo={editingTodo}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingTodo(null); }}
        />
      )}
    </div>
  );
}
