import "./TodoItem.css";

const priorityColors = { high: "#ff6b6b", medium: "#ffd93d", low: "#6bcb77" };

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const due = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  }) : null;

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <button className="toggle-btn" onClick={() => onToggle(todo._id)}>
        <span className={`checkbox ${todo.completed ? "checked" : ""}`}>
          {todo.completed && "✓"}
        </span>
      </button>

      <div className="todo-body">
        <div className="todo-top">
          <span className="todo-title">{todo.title}</span>
          <span
            className="priority-badge"
            style={{ color: priorityColors[todo.priority], borderColor: priorityColors[todo.priority] + "40" }}
          >
            {todo.priority}
          </span>
        </div>

        {todo.description && (
          <p className="todo-desc">{todo.description}</p>
        )}

        <div className="todo-meta">
          {due && (
            <span className={`due-date ${isOverdue ? "overdue" : ""}`}>
              📅 {due}
            </span>
          )}
          {todo.tags?.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>

      <div className="todo-actions">
        <button className="action-btn" onClick={() => onEdit(todo)} title="Edit">✏️</button>
        <button className="action-btn delete" onClick={() => onDelete(todo._id)} title="Delete">🗑️</button>
      </div>
    </div>
  );
}
