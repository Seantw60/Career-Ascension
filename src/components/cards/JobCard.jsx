// src/components/cards/JobCard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { jobsData } from "../../data/data";
import "./styles/JobCard.css";

export default function JobCard({ id }) {
  const job = jobsData[id];
  const [hp, setHp] = useState(job.hp);
  const [isHit, setIsHit] = useState(false);

  const takeDamage = (amount) => {
    setIsHit(true);
    setHp((prev) => Math.max(prev - amount, 0));
    setTimeout(() => setIsHit(false), 200);
  };

  const hpPercent = (hp / job.maxHp) * 100;

  return (
    <motion.div
      className={`job-card ${isHit ? "hit" : ""}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <h3>{job.title}</h3>
      <p className="tier">{job.tier}</p>
      <div className="hp-bar">
        <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
      </div>
      <p className="hp-text">HP: {hp} / {job.maxHp}</p>
      <p className="skills-list">
        <strong>Skills:</strong> {job.skills.join(", ")}
      </p>
    </motion.div>
  );
}
