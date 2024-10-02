import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the PetGoMania API 🚀!");
});

import authRoutes from "./routes/authRoutes.js";
app.use("/auth", authRoutes);

import errorHandler from "./middlewares/errorHandler.js";
app.use(errorHandler);

export default app;
