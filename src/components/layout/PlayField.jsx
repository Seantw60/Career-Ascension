import { motion } from "framer-motion";
import { useState } from "react";
import JobCard from "../cards/JobCard";
import SkillCard from "../cards/SkillCard";
import EventCard from "../cards/EventCard";
import TurnLog from "./TurnLog";
import "./styles/PlayField.css";

export default function PlayField() {
  const [logs, setLogs] = useState([]);
  const [sampleSkills, setSampleSkills] = useState([
    { name: "Python", power: 3, points: 2 },
    { name: "Excel", power: 2, points: 3 },
    { name: "Communication", power: 1, points: 4 },
  ]);

  const handleSkillUse = (name, power) => {
    setLogs((prev) => [...prev, `Used ${name} — dealt ${power} damage!`]);
    setSampleSkills((prev) =>
      prev.map((s) =>
        s.name === name && s.points > 0
          ? { ...s, points: s.points - 1 }
          : s
      )
    );
  };

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
        <JobCard title="Data Analyst" hp={7} maxHp={10} />
      </section>

      <section className="event-area">
        <EventCard />
      </section>

      <section className="skill-hand">
        {sampleSkills.map((skill, i) => (
          <SkillCard
            key={i}
            name={skill.name}
            power={skill.power}
            points={skill.points}
            onUse={handleSkillUse}
          />
        ))}
      </section>

      <TurnLog logs={logs} />
    </motion.div>
  );
}
