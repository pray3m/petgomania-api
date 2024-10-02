import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { generateOtp, sendOtpEmail } from "../utils/helpers.js";

export const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists.");

  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(password, salt);

  const otpCode = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

  const user = await prisma.user.create({
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

  await sendOtpEmail(email, name, otpCode);

  return user;
};

export const verifyUserEmail = async ({ email, otpCode }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or OTP code.");

  if (user.isVerified) throw new Error("Email is already verified.");

  // Check if OTP is valid
  if (user.otpCode !== otpCode) {
    const attempts = user.otpAttempts + 1;

    if (attempts >= 5)
      throw new Error("Too many failed attempts. Please request a new OTP.");

    await prisma.user.update({
      where: { id: user.id },
      data: { otpAttempts: attempts },
    });

    throw new Error("Invalid OTP Code");
  }

  if (user.otpExpiresAt < new Date())
    throw new Error("OTP code has expired. Please request a new OTP");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      otpCode: null,
      otpExpiresAt: null,
      otpAttempts: 0,
    },
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  if (!user.isVerified)
    throw new Error("Please verify your email before logging in.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { user, token };
};
