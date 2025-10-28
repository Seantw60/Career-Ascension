// src/components/menu/Tutorial.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Tutorial.css";

export default function Tutorial({ onClose, onSkip }) {
  const [currentPage, setCurrentPage] = useState(0);

  const tutorialPages = [
    {
      title: "Welcome to Career Ascension!",
      content: "Battle through careers using your skills. Defeat job challenges to climb the corporate ladder!",
      icon: "🎯"
    },
    {
      title: "Job Cards",
      content: "Each job has HP (Health Points). Reduce it to 0 to complete the job and earn rewards!",
      icon: "💼"
    },
    {
      title: "Skill Cards",
      content: "Use skill cards from your hand to attack jobs. Each skill has Power (damage) and Points (uses).",
      icon: "⚡"
    },
    {
      title: "Timer & Resources",
      content: "You have 30 seconds per job. When a skill runs out of points, it's exhausted. Manage wisely!",
      icon: "⏱️"
    },
    {
      title: "Events",
      content: "Random events can help or hinder you. They might restore skills, give bonuses, or create challenges!",
      icon: "✨"
    },
    {
      title: "Win Condition",
      content: "Complete as many jobs as possible before all your skills are exhausted. Good luck!",
      icon: "🏆"
    }
  ];

  const handleNext = () => {
    if (currentPage < tutorialPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSkipAll = () => {
    // Mark tutorial as seen so it doesn't show again
    localStorage.setItem("tutorialSeen", "true");
    onSkip();
  };

  return (
    <motion.div
      className="tutorial-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleSkipAll}
    >
      <motion.div
        className="tutorial-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="tutorial-close" onClick={handleSkipAll}>
          ✕
        </button>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="tutorial-content"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="tutorial-icon">{tutorialPages[currentPage].icon}</div>
            <h2 className="tutorial-title">{tutorialPages[currentPage].title}</h2>
            <p className="tutorial-text">{tutorialPages[currentPage].content}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="tutorial-progress">
          {tutorialPages.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentPage ? "active" : ""} ${
                index < currentPage ? "completed" : ""
              }`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="tutorial-buttons">
          <button
            className="tutorial-btn secondary"
            onClick={handlePrevious}
            disabled={currentPage === 0}
          >
            Previous
          </button>

          <button className="tutorial-btn skip" onClick={handleSkipAll}>
            Skip Tutorial
          </button>

          <button className="tutorial-btn primary" onClick={handleNext}>
            {currentPage === tutorialPages.length - 1 ? "Start Playing!" : "Next"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}