import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOtp, sendOtpEmail } from "../utils/helpers.js";
import { AppError, handleServiceError, prisma } from "../utils/index.js";

export const registerUser = async ({ name, email, password, role }) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError(400, "User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        otpCode,
        otpExpiresAt,
        isVerified: false,
      },
    });

    await sendOtpEmail(email, name, otpCode);
    return user;
  } catch (error) {
    handleServiceError(error, "registering user");
  }
};

export const verifyUserEmail = async ({ email, otpCode }) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(400, "Invalid email or OTP code.");
    }

    if (user.isVerified) {
      throw new AppError(400, "Email is already verified.");
    }

    // Check if OTP is valid
    if (user.otpCode !== otpCode) {
      const attempts = user.otpAttempts + 1;

      if (attempts >= 5) {
        throw new AppError(
          400,
          "Too many failed attempts. Please request a new OTP."
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: attempts },
      });

      throw new AppError(400, "Invalid OTP Code");
    }

    if (user.otpExpiresAt < new Date()) {
      throw new AppError(
        400,
        "OTP code has expired. Please request a new OTP."
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
    });
  } catch (error) {
    handleServiceError(error, "verifying user email");
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(400, "Invalid email or password.");
    }

    if (!user.isVerified) {
      throw new AppError(403, "Please verify your email before logging in.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(400, "Invalid email or password.");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "17d" } // TODO: change the expiry to 1d
    );

    return { user, token };
  } catch (error) {
    handleServiceError(error, "logging in user");
  }
};

export const resendOtp = async ({ email }) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(400, "Invalid email.");
    }

    if (user.isVerified) {
      throw new AppError(400, "Email is already verified.");
    }

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
    return { message: "A new OTP has been sent to your email." };
  } catch (error) {
    handleServiceError(error, "resending OTP");
  }
};
