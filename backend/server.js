const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  credentials: true,
}));

app.options("*", cors());

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected ✅" });
});

app.listen(5000, () => console.log("API on http://localhost:5000"));
