import prisma from "../config/db.js";
import jwt from "jsonwebtoken";

// TODO : Remove this file and use the auth.js and roleAuth.js files in the middlewares folder

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return res.status(401).json({ error: "User no longer exists." });

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: "Token is invalid or expired." });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  next();
};
