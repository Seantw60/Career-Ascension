// src/components/cards/SkillCard.jsx
import { motion } from "framer-motion";
import { skillsData } from "../../data/data";
import "./styles/SkillCard.css";

export default function SkillCard({ id }) {
  const skill = skillsData[id];
  return (
    <motion.div
      className="skill-card"
      whileHover={{ y: -8, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <h4>{skill.name}</h4>
      <p>{skill.description}</p>
      <div className="skill-info">
        <span>Power: {skill.power}</span>
        <span>Cooldown: {skill.cooldown}</span>
      </div>
    </motion.div>
  );
}
