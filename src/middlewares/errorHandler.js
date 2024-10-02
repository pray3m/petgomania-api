const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err.stack);

  res.status(500).json({ error: "An unexpected error occurred." });
};

export default errorHandler;
