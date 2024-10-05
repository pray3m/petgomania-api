import cors from "cors";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

// Security
app.use(helmet());

// Logging Middleware
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// CORS Configuration
// const allowedOrigins = [
//   "https://petgomania.com.co",
//   "https://www.petgomania.com.co",
// ];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "The CORS policy for this site does not allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );

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
