import { body } from "express-validator";

export const registerValidator = [
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
];

export const verifyEmailValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),
  body("otpCode")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP code must be 6 digits."),
];

export const resendOtpValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];
