// src/App.jsx
import { useState, useEffect } from "react";
import StartMenu from "./components/menu/Startmenu";
import OptionsMenu from "./components/menu/OptionsMenu";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("menu"); // menu | settings | play | quit
  // Initialize theme state with a function to check localStorage immediately
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.theme || "dark"; // Default to 'dark' if theme is missing
      }
    } catch (e) {
      console.error("Could not load settings from localStorage", e);
    }
    return "dark"; // Default theme
  });

  // EFFECT TO SAVE SETTINGS WHEN THEME CHANGES
  useEffect(() => {
    const settingsToSave = {
      theme: theme,
      // Add other settings here later (e.g., sound volume, difficulty)
    };
    try {
      localStorage.setItem("settings", JSON.stringify(settingsToSave));
    } catch (e) {
      console.error("Could not save settings to localStorage", e);
    }
  }, [theme]); // Re-run this effect ONLY when the theme state changes

  // EFFECT TO APPLY THEME CLASS TO <body>
  useEffect(() => {
    document.body.className = ""; // clear old
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <>
      {screen === "menu" && (
        <StartMenu
          onPlay={() => setScreen("play")}
          onSettings={() => setScreen("settings")}
          onQuit={() => setScreen("quit")}
        />
      )}
      {screen === "settings" && (
        <OptionsMenu
          theme={theme}
          setTheme={setTheme} // <--- This is where you pass the setter function
          onBack={() => setScreen("menu")}
        />
      )}
      {screen === "play" && <h2>Game will start here...</h2>}
      {screen === "quit" && <h2>Thanks for playing Career Ascension!</h2>}
    </>
  );
}