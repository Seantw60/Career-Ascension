// src/components/menu/AudioSettings.jsx
import "./AudioSettings.css";

const volumeControls = [
  { key: "master", label: "Master Volume" },
  { key: "music", label: "Music Volume" },
  { key: "sfx", label: "SFX Volume" },
];

export default function AudioSettings({ audio, setAudio }) {
  const updateVolume = (key, value) => {
    const numericValue = parseInt(value, 10); 
    setAudio({ ...audio, [key]: numericValue });
  };

  return (
    <div className="settings-section">
      <h3>Audio</h3>
      {volumeControls.map(({ key, label }) => (
        <label key={key}>
          {label}: {audio[key]}
          <input
            type="range"
            min="0"
            max="100"
            value={audio[key]}
            onChange={(e) => updateVolume(key, e.target.value)}
            role="slider"
            aria-valuenow={audio[key]}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </label>
      ))}
    </div>
  );
}