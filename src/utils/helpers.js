import crypto from "crypto";
import { sendEmail } from "./emailService.js";

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOtpEmail = async (email, name, otpCode) => {
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
};

export const handleErrorResponse = (res, statusCode, errorMessage) => {
  return res.status(statusCode).json({ error: errorMessage });
};
