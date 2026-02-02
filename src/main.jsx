import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";   // 🔥 THIS LINE MUST EXIST
import { RepoProvider } from "./context/RepoContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RepoProvider>
      <App />
    </RepoProvider>
  </React.StrictMode>
);
