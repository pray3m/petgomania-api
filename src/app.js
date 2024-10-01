import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the PetGoMania API 🚀!");
});

export default app;
