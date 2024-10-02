import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { generateOtp, sendOtpEmail } from "../utils/helpers";

export const registerUser = async (name, email, password, role) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists.");
  }

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
