// src/App.jsx
import { useState, useEffect } from "react";
import StartMenu from "./components/menu/StartMenu";
import OptionsMenu from "./components/menu/OptionsMenu";
import Tutorial from "./components/menu/Tutorial";
import PlayField from "./components/layout/PlayField";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("menu"); // menu | settings | play | quit
  const [showTutorial, setShowTutorial] = useState(false);

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

  // Apply theme to document body
  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // Check if tutorial should be shown when entering play screen
  useEffect(() => {
    if (screen === "play") {
      // Check if user has seen tutorial before
      const tutorialSeen = localStorage.getItem("tutorialSeen");
      if (!tutorialSeen) {
        setShowTutorial(true);
      }
    }
  }, [screen]);

  const handlePlayClick = () => {
    setScreen("play");
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    // Mark tutorial as seen
    localStorage.setItem("tutorialSeen", "true");
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };

  // Reset tutorial (for testing - can be removed in production)
  const resetTutorial = () => {
    localStorage.removeItem("tutorialSeen");
    alert("Tutorial reset! It will show again next time you play.");
  };

  return (
    <>
      {screen === "menu" && (
        <StartMenu
          onPlay={handlePlayClick}
          onSettings={() => setScreen("settings")}
          onQuit={() => setScreen("quit")}
        />
      )}

      {screen === "settings" && (
        <OptionsMenu
          theme={theme}
          setTheme={setTheme}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "play" && (
        <>
          <PlayField />
          {showTutorial && (
            <Tutorial
              onClose={handleTutorialClose}
              onSkip={handleTutorialSkip}
            />
          )}
        </>
      )}

      {screen === "quit" && (
        <div className="quit-screen">
          <h2>
            Thanks for playing <span className="highlight">Career Ascension</span>!
          </h2>
          <button onClick={() => setScreen("menu")} className="return-btn">
            Return to Menu
          </button>
          
          {/* Developer tool - remove in production */}
          <button 
            onClick={resetTutorial} 
            className="return-btn"
            style={{ marginTop: "10px", fontSize: "0.8rem", opacity: 0.5 }}
          >
            Reset Tutorial (Dev)
          </button>
        </div>
      )}
    </>
  );
}