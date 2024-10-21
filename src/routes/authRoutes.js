import { Router } from "express";
import {
  login,
  register,
  resendOtp,
  verifyEmail,
} from "../controllers/authController.js";
import {
  loginValidator,
  registerValidator,
  resendOtpValidator,
  verifyEmailValidator,
} from "../middlewares/validations/authValidations.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";

const router = Router();

/**
 * @route POST /auth/register
 * @description Register a new user
 * @access Public
 */
router.post(
  "/register",
  [...registerValidator, handleValidationErrors],
  register
);

/**
 * @route POST /auth/verify-email
 * @description Verify user email with OTP
 * @access Public
 */
router.post(
  "/verify-email",
  [...verifyEmailValidator, handleValidationErrors],
  verifyEmail
);

/**
 * @route POST /auth/resend-otp
 * @description Resend OTP for email verification
 * @access Public
 */
router.post(
  "/resend-otp",
  [...resendOtpValidator, handleValidationErrors],
  resendOtp
);

/**
 * @route POST /auth/login
 * @description User login
 * @access Public
 */
router.post("/login", [...loginValidator, handleValidationErrors], login);

// TODO : forgot password, reset password API routes

export default router;
