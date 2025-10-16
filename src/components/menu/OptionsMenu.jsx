// src/components/menu/OptionsMenu.jsx
import { useState } from "react";
import AudioSettings from "./AudioSettings";
import ThemeSettings from "./ThemeSettings";
import "./OptionsMenu.css";

export default function OptionsMenu({ onBack, theme, setTheme, audio, setAudio }) {
  const handleSave = () => {
    alert("Settings Saved!");
    onBack();
  };


  return (
    <div className="options-menu">
      <h2 className="options-title">Settings</h2>

      <div className="settings-list">
        <AudioSettings audio={audio} setAudio={setAudio} />
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