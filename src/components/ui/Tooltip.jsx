import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Tooltip.css";

// Tooltip can render inline (default) or into document.body when usePortal is true.
export default function Tooltip({ children, visible = false, id, usePortal = false, positionStyle = {} }) {
  useEffect(() => {
    return () => {};
  }, [visible]);

  if (!visible) return null;

  const node = (
    <div className="ui-tooltip" role="tooltip" id={id} style={positionStyle}>
      {children}
    </div>
  );

  if (usePortal && typeof document !== "undefined") {
    return createPortal(node, document.body);
  }

  return node;
}
