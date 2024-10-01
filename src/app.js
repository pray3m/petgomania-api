import express from "express";
import morgan from "morgan";

const app = express();

// Middleware
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the PetGoMania API 🚀!");
});

export default app;
