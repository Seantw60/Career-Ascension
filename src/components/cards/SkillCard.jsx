// src/components/cards/SkillCard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import Tooltip from "../ui/Tooltip";
import "./styles/SkillCard.css";

export default function SkillCard({
  skillId,
  name = "Unknown Skill",
  power = 1,
  points = 1,
  cooldown = 0,
  description = "A mysterious skill...",
  onUse = () => {},
}) {
  const handleUse = () => {
    if (points <= 0 || (cooldown || 0) > 0) return;
    onUse(skillId);
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      className={`skill-card ${cooldown > 0 ? "cooldown" : ""}`}
      whileHover={{ y: -10, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleUse}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleUse();
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <h4>{name}</h4>
      <p>Power: {power}</p>
      <p>Uses: {points}</p>
      {cooldown > 0 && <p>Cooldown: {cooldown}s</p>}

      <Tooltip visible={showTooltip} id={`tooltip-${skillId}`}>
        {description}
      </Tooltip>
    </motion.div>
  );
}
