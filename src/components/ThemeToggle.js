import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  );
}
