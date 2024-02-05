import React from "react"
import { useState, forwardRef, useImperativeHandle } from "react"
import "./snackbar.css"

export const Snackbar = forwardRef((props, ref) => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  useImperativeHandle(ref, () => ({
    show() {
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);
    },
  }))
  
  return (
  <div className="snackbar" id={showSnackbar ? "show" : "hide"}>
    <div className="symbol">
      <h1>&#x270C;</h1>
    </div>
    <div className="message">
      <p>{props.message}</p>
    </div>
  </div>
  )
})