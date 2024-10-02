import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { validationResult } from "express-validator";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;
  try {
    // check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hasedPassword,
        role, // default role is user
        otpCode,
        otpExpiresAt,
        isVerified: false,
      },
    });

    const emailSubject = "Verify Your Petgomania Account";
    const emailBody = `
      <p>Hi ${name},</p>
      <p>Thank you for registering at Petgomania!</p>
      <p>Your verification code is: <strong>${otpCode}</strong></p>
      <p>This code will expire in 15 minutes.</p>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <p>Best regards,<br>Petgomania Team</p>
    `;

    await sendEmail(email, emailSubject, emailBody);

    // Return success message
    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });

    // const payload = { userId: user.id, role: user.role };
    // const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //   expiresIn: "1d",
    // });

    // res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or OTP code." });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified." });
    }

    // Check if OTP is valid
    if (user.otpCode !== otpCode) {
      // Increment OTP attempts
      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: user.otpAttempts + 1 },
      });

      // Lock account after 5 failed attempts
      if (user.otpAttempts + 1 >= 5) {
        return res.status(403).json({
          error: "Too many failed attempts. Please request a new OTP.",
        });
      }

      return res.status(400).json({ error: "Invalid OTP code." });
    }

    // Check if OTP is expired
    if (user.otpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ error: "OTP code has expired. Please request a new OTP." });
    }

    // Update user to set isVerified to true and reset OTP fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
    });

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email." });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified." });
    }

    // Generate new OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

    // Update user with new OTP and reset attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode,
        otpExpiresAt,
        otpAttempts: 0,
      },
    });

    // Send OTP to user's email
    const emailSubject = "Your New Petgomania Verification Code";
    const emailBody = `
        <p>Hi ${user.name},</p>
        <p>Your new verification code is: <strong>${otpCode}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you did not request a new code, please contact support.</p>
        <p>Best regards,<br>Petgomania Team</p>
      `;

    await sendEmail(email, emailSubject, emailBody);

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const login = async (req, res) => {
  // Input validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return user data and token
    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
