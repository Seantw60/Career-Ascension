import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./styles/TurnLog.css";

export default function TurnLog({ logs = [] }) {
  const logEndRef = useRef(null);

  // Scroll to latest log entry whenever logs update
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <motion.div
      className="turn-log-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="turn-log-title">Turn Log</h3>

      <div className="turn-log-entries">
        {logs.length === 0 ? (
          <p className="empty-log">No activity yet...</p>
        ) : (
          logs.map((log, i) => (
            <motion.p
              key={i}
              className="turn-log-entry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {log}
            </motion.p>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </motion.div>
  );
}
