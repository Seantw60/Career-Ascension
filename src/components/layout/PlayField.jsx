// src/components/layout/PlayField.jsx
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "../../utils/GameManager";
import JobCard from "../cards/JobCard";
import PlayerHand from "./PlayerHand";
import EventCard from "../cards/EventCard";
import Deck from "./Deck";
import Timer from "./Timer";
import TurnLog from "./TurnLog";
import ScoreBoard from "./ScoreBoard";
import "./styles/PlayField.css";

export default function PlayField() {
  const {
    jobs,
    skills,
    events,
    currentJobIndex,
    currentEvent,
    skillCooldowns,
    useSkill,
    nextJob,
    tickCooldowns,
    triggerEvent,
    gameOver,
    score,
    jobsCleared,
    logs,
    dispatch,
  } = useGame();

  const currentJob = jobs[currentJobIndex];

  // reduce cooldowns every second (or could be per turn later)
  useEffect(() => {
    const interval = setInterval(() => tickCooldowns(), 1000);
    return () => clearInterval(interval);
  }, [tickCooldowns]);

  // when job defeated -> trigger event and then advance
  useEffect(() => {
    if (currentJob && currentJob.hp <= 0) {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      triggerEvent(randomEvent);
      const delay = setTimeout(() => nextJob(), 2000);
      return () => clearTimeout(delay);
    }
  }, [currentJob?.hp]);

  if (gameOver)
    return (
      <motion.div
        className="game-over-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2>🎉 Career Ascension Complete!</h2>
        <p>You cleared all jobs with a score of {score}.</p>
      </motion.div>
    );

  return (
    <motion.div
      className="playfield-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* HEADER */}
      <header className="playfield-header">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Career Ascension
        </motion.h2>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Battle through careers using your skills!
        </motion.p>
      </header>

      {/* LEFT SIDE — Turn Log occupies the entire left column */}
      <section className="left-area">
        <TurnLog logs={logs} />
      </section>

      {/* MAIN FIELD */}
      <section className="mainplay-area">
        <div className="job-event-stack">
          {/* Event Card */}
          {currentEvent && (
            <motion.div
              key={currentEvent.id}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <EventCard {...currentEvent} />
            </motion.div>
          )}

          {/* Job Card */}
          {currentJob && (
            <motion.div
              key={currentJob.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <JobCard
                title={currentJob.title}
                hp={currentJob.hp}
                maxHp={currentJob.maxHp}
                tier={currentJob.tier}
                onDefeat={() => {
                  // log and advance
                  triggerEvent(events[Math.floor(Math.random() * events.length)]);
                  // slight delay before advancing so player sees event
                  setTimeout(() => nextJob(), 800);
                }}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* RIGHT SIDE — Timer + Scoreboard */}
      <aside className="sidebar-area">
        <Timer key={currentJobIndex} duration={30} onExpire={() => dispatch({ type: "TIMEOUT" })} />
        <ScoreBoard />
      </aside>

      {/* BOTTOM — Deck pushed into hand area + Player Hand */}
      <section className="skill-hand">
        <Deck />
        <PlayerHand />
      </section>
    </motion.div>
  );
}
