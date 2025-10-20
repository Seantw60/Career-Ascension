// src/App.jsx
import { useState, useEffect } from "react";
import StartMenu from "./components/menu/StartMenu";
import OptionsMenu from "./components/menu/OptionsMenu";
import PlayField from "./components/layout/Playfield";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("menu"); // menu | settings | play | quit

  // Initialize theme state
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.theme || "dark"; // default
      }
    } catch (e) {
      console.error("Could not load settings from localStorage", e);
    }
    return "dark";
  });

  // Save theme to localStorage
  useEffect(() => {
    const settingsToSave = { theme };
    try {
      localStorage.setItem("settings", JSON.stringify(settingsToSave));
    } catch (e) {
      console.error("Could not save settings to localStorage", e);
    }
  }, [theme]);

  // audio settings
  const [audio, setAudio] = useState(() => {
    try {
      const saved = localStorage.getItem("settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.audio || { master: 50, music: 50, sfx: 50 };
      }
    } catch (e) {
      console.error("Could not load audio settings", e);
    }
    return { master: 50, music: 50, sfx: 50 };
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("settings");
      const parsed = saved ? JSON.parse(saved) : {};
      parsed.audio = audio;
      parsed.theme = theme;
      localStorage.setItem("settings", JSON.stringify(parsed));
    } catch (e) {
      console.error("Could not save settings to localStorage", e);
    }
  }, [audio, theme]);

  // Apply theme to document body
  useEffect(() => {
    document.body.className = "";
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
          setTheme={setTheme}
          audio={audio}
          setAudio={setAudio}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "play" && <PlayField />}

      {screen === "quit" && (
        <div className="quit-screen">
          <h2>Thanks for playing <span className="highlight">Career Ascension</span>!</h2>
          <button onClick={() => setScreen("menu")} className="return-btn">
            Return to Menu
          </button>
        </div>
      )}
    </>
  );
}
