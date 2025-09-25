// src/components/menu/ThemeSettings.jsx
import "./ThemeSettings.css";

export default function ThemeSettings({ theme, setTheme }) {
  const themes = ["light", "dark", "retro"];

  return (
    <div className="theme-settings">
      <h3>Theme</h3>
      <div className="theme-options">
        {themes.map((t) => (
          <div
            key={t}
            className={`theme-preview ${theme === t ? "selected" : ""} ${t}`}
            onClick={() => setTheme(t)}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
