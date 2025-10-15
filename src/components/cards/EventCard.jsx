// src/components/cards/EventCard.jsx
import { motion } from "framer-motion";
import { eventsData } from "../../data/data";
import "./styles/EventCard.css";

export default function EventCard({ id }) {
  const event = eventsData[id];
  return (
    <motion.div
      className="event-card"
      whileHover={{ rotate: 1, scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <h4>{event.title}</h4>
      <p>{event.description}</p>
      <span className="effect">{event.effect}</span>
    </motion.div>
  );
}
