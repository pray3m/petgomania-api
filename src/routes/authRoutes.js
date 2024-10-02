import { Router } from "express";
import { body } from "express-validator";
import {
  login,
  register,
  resendOtp,
  verifyEmail,
} from "../controllers/authController.js";

const router = Router();

// Registration route
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email")
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/\d/)
      .withMessage("Password must contain at least one number.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .trim(),
  ],
  register
);

// Email verification route
router.post(
  "/verify-email",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
    body("otpCode")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP code must be 6 digits."),
  ],
  verifyEmail
);

// Resend OTP route
router.post(
  "/resend-otp",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
  ],
  resendOtp
);

// Login route
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  login
);

export default router;
