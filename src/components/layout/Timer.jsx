import { useState, useEffect } from "react";
import { useGame } from "../../utils/GameManager"; // import context
import "./styles/Timer.css";

export default function Timer({ duration = 30, onExpire = () => {}, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const { tutorialActive } = useGame(); // get flag from context
  

  useEffect(() => {
    if (tutorialActive) return; // 🧊 Pause timer when tutorial is active
    if (timeLeft <= 0) {
        setTimeLeft(0);
        onExpire();
        return;
      }


    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire, tutorialActive]); // add tutorialActive as dependency

  useEffect(() => {
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
