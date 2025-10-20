// src/components/cards/SkillCard.jsx
import { useState, useRef } from "react";
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
    onUse();
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);

  const getTooltipStyle = () => {
    if (!ref.current) return {};
    const rect = ref.current.getBoundingClientRect();
    // place tooltip centered above the card with some offset
    return {
      position: 'absolute',
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top - 8}px`,
      transform: 'translate(-50%, -100%)',
    };
  };

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
      ref={ref}
    >
      <h4>{name}</h4>
      <p>Power: {power}</p>
      <p>Uses: {points}</p>
      {cooldown > 0 && <p>Cooldown: {cooldown}s</p>}

      <Tooltip visible={showTooltip} id={`tooltip-${skillId}`} usePortal={true} positionStyle={getTooltipStyle()}>
        {description}
      </Tooltip>
    </motion.div>
  );
}
