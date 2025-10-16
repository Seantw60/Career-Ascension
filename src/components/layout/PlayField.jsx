// src/components/layout/PlayField.jsx
import { motion } from "framer-motion";
import JobCard from "../cards/JobCard";
import SkillCard from "../cards/SkillCard";
import EventCard from "../cards/EventCard";
import "./styles/PlayField.css";

export default function PlayField() {
  return (
    <motion.div
      className="playfield-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="playfield-header">
        <h2>Career Ascension</h2>
        <p>Battle through careers using your skills!</p>
      </header>

      <section className="job-area">
        <JobCard id={0} />
      </section>

      <section className="event-area">
        <EventCard id={1} />
      </section>

      <section className="skill-hand">
        <SkillCard id={0} />
        <SkillCard id={1} />
        <SkillCard id={2} />
      </section>
    </motion.div>
  );
}
