import { motion } from "framer-motion";
import "./styles/SkillCard.css";

export default function SkillCard({ name, power, points, onUse }) {
  const handleClick = () => {
    if (points > 0) {
      onUse(name, power);
    }
  };

  return (
    <motion.div
      className="skill-card"
      whileHover={{ y: -10, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h4>{name}</h4>
      <p>Power: {power}</p>
      <p>Points: {points}</p>
    </motion.div>
  );
}
