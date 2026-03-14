import "./StatsBar.css";

export default function StatsBar({ stats }) {
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-num">{stats.total}</div>
        <div className="stat-lbl">Total</div>
      </div>
      <div className="stat-card">
        <div className="stat-num" style={{ color: "#6bcb77" }}>{stats.completed}</div>
        <div className="stat-lbl">Done</div>
      </div>
      <div className="stat-card">
        <div className="stat-num" style={{ color: "#ffd93d" }}>{stats.incomplete}</div>
        <div className="stat-lbl">Pending</div>
      </div>
      <div className="stat-card">
        <div className="stat-num" style={{ color: "#ff6b6b" }}>{stats.high}</div>
        <div className="stat-lbl">High priority</div>
      </div>
      <div className="stat-card progress-card">
        <div className="progress-label">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
