import { useState, useEffect } from "react";
import "./styles/Timer.css";

export default function Timer({ duration = 30 }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="timer-container">
      <div className="timer-label">Turn Timer</div>
      <div className={`timer-count ${timeLeft < 10 ? "low" : ""}`}>
        {timeLeft}s
      </div>
    </div>
  );
}
