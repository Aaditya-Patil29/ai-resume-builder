const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/resume-builder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// Import Controllers
const resumeController = require("./controllers/resumeController");
const aiController = require("./controllers/aiController");

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected ✅" });
});

// Resume Routes
app.post("/api/resumes", resumeController.createResume);
app.get("/api/resumes/user/:userId", resumeController.getResumes);
app.get("/api/resumes/:id", resumeController.getResume);
app.put("/api/resumes/:id", resumeController.updateResume);
app.delete("/api/resumes/:id", resumeController.deleteResume);
app.get("/api/resumes/stats/:userId", resumeController.getStats);

// AI Routes
app.post("/api/ai/analyze", aiController.analyzeResume);
app.post("/api/ai/improve", aiController.improveSuggestion);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));