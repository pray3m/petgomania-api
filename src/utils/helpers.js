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

// Extracts the Cloudinary publicId from a given imageUrl
export const extractPublicId = (url) => {
  try {
    // Extract the public ID from Cloudinary URL
    // Example URL: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/folder/public-id.jpg
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];
    // Remove the file extension
    return filename.split(".")[0];
  } catch (error) {
    console.error("Error extracting public ID :", error);
    return null;
  }
};
