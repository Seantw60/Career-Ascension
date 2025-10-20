import { useState, useEffect } from "react";
import "./styles/Timer.css";

export default function Timer({ duration = 30, onExpire = () => {}, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      // call once when expired
      onExpire();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  useEffect(() => {
    // reset when duration prop changes or when resetKey changes (new job)
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (typeof resetKey !== "undefined") setTimeLeft(duration);
  }, [resetKey, duration]);

  return (
    <div className="timer-container">
      <div className="timer-label">Turn Timer</div>
      <div className={`timer-count ${timeLeft < 10 ? "low" : ""}`}>
        {timeLeft}s
      </div>
    </div>
  );
}
