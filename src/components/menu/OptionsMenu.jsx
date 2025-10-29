// src/components/menu/OptionsMenu.jsx
import { useState, useEffect } from "react";
import AudioSettings from "./AudioSettings";
import ThemeSettings from "./ThemeSettings";
import "./OptionsMenu.css";

export default function OptionsMenu({ onBack, theme, setTheme, audio, setAudio }) {
  // Local state for audio if not provided by parent
  const [localAudio, setLocalAudio] = useState({
    master: 50,
    music: 50,
    sfx: 50,
  });

  // Use parent audio state if provided, otherwise use local
  const audioState = audio || localAudio;
  const audioSetter = setAudio || setLocalAudio;

  const handleSave = () => {
    alert("Settings Saved!");
    onBack();
  };

  return (
    <div className="options-menu">
      <h2 className="options-title">Settings</h2>

      <div className="settings-list">
        <AudioSettings audio={audioState} setAudio={audioSetter} />
        <ThemeSettings theme={theme} setTheme={setTheme} />
      </div>

      <div className="options-buttons">
        <button className="menu-btn" onClick={onBack}>
          Back
        </button>
        <button className="menu-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}