import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home.jsx";
import ResumeBuilder from "./ResumeBuilder.jsx";
import Dashboard from "./Dashboard.jsx";
import ResumePreview from "./ResumePreview.jsx";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<ResumeBuilder />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preview" element={<ResumePreview />} />
      </Routes>
    </Router>
  );
}

export default App;