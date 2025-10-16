import { useEffect } from "react";
import "./Tooltip.css";

export default function Tooltip({ children, visible = false, id }) {
  // Simple presentational tooltip; visibility controlled by parent
  useEffect(() => {
    // accessibility hook - could focus on open tooltip if needed
    return () => {};
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="ui-tooltip" role="tooltip" id={id}>
      {children}
    </div>
  );
}
