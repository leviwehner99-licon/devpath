import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./oberflaeche/styles.css";
import "./oberflaeche/phase2.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
