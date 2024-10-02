const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get token from headers
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Token is invalid or expired." });
  }
};
