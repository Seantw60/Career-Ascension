import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/JobCard.css";
import Tooltip from "../ui/Tooltip";

export default function JobCard({
  title = "Unknown Job",
  hp = 10,
  maxHp = 10,
  onDefeat = () => {},
  description = "",
}) {
  const [isHit, setIsHit] = useState(false);
  const [hover, setHover] = useState(false);
  const cardRef = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (hp <= 0) {
      onDefeat(title);
    }
  }, [hp]);

  // flash when incoming damage is applied (basic heuristic)
  useEffect(() => {
    if (hp < maxHp) {
      setIsHit(true);
      const t = setTimeout(() => setIsHit(false), 200);
      return () => clearTimeout(t);
    }
  }, [hp]);

  const hpPercent = (hp / maxHp) * 100;

  return (
  <motion.div
    className={`job-card ${isHit ? "hit" : ""}`}
    ref={cardRef}
    onMouseEnter={() => {
      setHover(true);
      if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect();
        setPos({ left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width });
      }
    }}
    onMouseLeave={() => setHover(false)}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <h3>{title}</h3>

    <div className="hp-bar">
      <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
    </div>

    <p>HP: {hp} / {maxHp}</p>

    <AnimatePresence>
      {isHit && (
        <motion.div
          className="hit-flash"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* 🔥 Critical flare */}
      {hpPercent <= 20 && !isHit &&
        <motion.div
          key="critical-flare"
          className="critical-flare"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1.2, 1], opacity: [1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          CRITICAL!
        </motion.div>
      }
    </AnimatePresence>

    <Tooltip
      visible={hover}
      usePortal={true}
      positionStyle={pos ? { left: pos.left + pos.width + 12 + "px", top: pos.top + "px" } : {}}
    >
      <div style={{ maxWidth: 260 }}>
        <strong>{title}</strong>
        <div style={{ marginTop: 6 }}>{description}</div>
      </div>
    </Tooltip>
  </motion.div>
 );
}
