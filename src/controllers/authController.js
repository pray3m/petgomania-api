import { validationResult } from "express-validator";
import prisma from "../config/db.js";
import {
  loginUser,
  registerUser,
  verifyUserEmail,
} from "../services/authService.js";
import {
  generateOtp,
  handleErrorResponse,
  sendOtpEmail,
} from "../utils/helpers.js";

export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    await registerUser({ name, email, password, role });

    res.status(201).json({
      status: "success",
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;

    await verifyUserEmail({ email, otpCode });
    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUser({ email, password });
    res.status(200).json({
      message: "Login successful.",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid email." });

    if (user.isVerified)
      return res.status(400).json({ error: "Email is already verified." });

    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode,
        otpExpiresAt,
        otpAttempts: 0,
      },
    });

    await sendOtpEmail(email, user.name, otpCode);

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    next(error);
  }
};
