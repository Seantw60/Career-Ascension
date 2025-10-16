// src/components/layout/ScoreBoard.jsx
import { useMemo } from "react";
import { useGame } from "../../utils/GameManager";
import "./styles/ScoreBoard.css";

export default function ScoreBoard() {
  const { score = 0, jobsCleared = 0, jobs = [] } = useGame();

  // Compute a simple "level" from jobs cleared (you can change logic later)
  const level = useMemo(() => {
    // Example: every 3 jobs = +1 level, start at 1
    return Math.floor(jobsCleared / 3) + 1;
  }, [jobsCleared]);

  // Optionally show current job tier/name
  const currentJob = jobs.length > 0 ? jobs[Math.min(jobsCleared, jobs.length - 1)] : null;

  return (
    <div className="scoreboard">
      <h3>Scoreboard</h3>

      <div className="scoreboard-stats">
        <p><span>Score:</span> {score}</p>
        <p><span>Jobs Won:</span> {jobsCleared}</p>
        <p><span>Level:</span> {level}</p>
        {currentJob && <p className="small"><span>Next:</span> {currentJob.title} ({currentJob.tier})</p>}
      </div>
    </div>
  );
}
