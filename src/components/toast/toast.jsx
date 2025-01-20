import { useState, forwardRef, useImperativeHandle } from "react";
import "./toast.css";

export const Toast = forwardRef(({ children }, ref) => {
  const [showToast, setShowToast] = useState(false);

  useImperativeHandle(ref, () => ({
    show() {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    },
  }));

  return (
    <div className="toast" data-state={showToast ? "visible" : "invisible"}>
      <div className="symbol">
        <h1>&#x270C;</h1>
      </div>
      <div className="message">{children}</div>
    </div>
  );
});
