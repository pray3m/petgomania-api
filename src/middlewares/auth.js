import prisma from "../config/db.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Authorization token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found. Please check your credentials and try again.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "error",
        message:
          "Invalid or expired token. Please log in again to obtain a new token.",
      });
    }
    next(error);
  }
};
