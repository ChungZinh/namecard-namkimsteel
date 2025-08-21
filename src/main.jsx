import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import VCardDetail from "./VCardDetail";
import "./index.css"; // Assuming you have a CSS file for styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:slug" element={<VCardDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
