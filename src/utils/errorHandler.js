import AppError from "./AppError.js";

const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err.stack);

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export default errorHandler;
