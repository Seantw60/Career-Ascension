// src/components/cards/EventCard.jsx
import { motion } from "framer-motion";
import "./styles/EventCard.css";

export default function EventCard({ id, title, description, effect }) {
  // accept either a full event object (spread) or an id + lookup handled by parent
  return (
    <motion.div
      className="event-card"
      whileHover={{ rotate: 1, scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <h4>{title || `Event ${id}`}</h4>
      <p>{description}</p>
      <span className="effect">{effect}</span>
    </motion.div>
  );
}
