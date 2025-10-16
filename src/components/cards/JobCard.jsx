import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/JobCard.css";

export default function JobCard({
  title = "Unknown Job",
  hp = 10,
  maxHp = 10,
  onDefeat = () => {},
}) {
  const [isHit, setIsHit] = useState(false);

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
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3>{title}</h3>

      <div className="hp-bar">
        <div
          className="hp-fill"
          style={{ width: `${hpPercent}%` }}
        />
      </div>

      <p>
        HP: {hp} / {maxHp}
      </p>

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
      </AnimatePresence>
    </motion.div>
  );
}
