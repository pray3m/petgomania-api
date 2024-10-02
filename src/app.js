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
import router from "./routes/index.js";
app.use("/", router);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

import errorHandler from "./middlewares/errorHandler.js";
app.use(errorHandler);

// Handle Uncaught Exceptions and Rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default app;
