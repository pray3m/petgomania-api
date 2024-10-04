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

// Extracts the Cloudinary publicId from a given imageUrl
export const extractPublicId = (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split("/");

    // Example URL pathSegments:
    // ['', 'image', 'upload', 'v1727982231', 'petgomania', 'products', 'nicmyzmtmezcu0u2ufgo.jpg']

    const uploadIndex = pathSegments.findIndex(
      (segment) => segment === "upload"
    );

    if (uploadIndex === -1 || uploadIndex + 1 >= pathSegments.length) {
      console.error("Unexpected imageUrl format:", imageUrl);
      return null;
    }

    const publicIdWithExtension = pathSegments.slice(uploadIndex + 1).join("/");
    const publicId = publicIdWithExtension.split(".").slice(0, -1).join(".");

    return publicId;
  } catch (error) {
    console.error("Error extracting publicId:", error);
    return null;
  }
};
