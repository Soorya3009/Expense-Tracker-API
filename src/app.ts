import express from "express";
import cors from "cors";
import Router from "./routes/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API is running",
  });
});

app.use("/api",Router);
export default app;