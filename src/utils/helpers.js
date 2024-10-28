import crypto from "crypto";
import { sendEmail } from "./emailService.js";
import prisma from "../config/db.js";
import AppError from "./AppError.js";

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

/**
 * @description Calculate the total price of cart Items
 * @param {Array} cartItems - List of cart items
 * @returns {Number} - Total Price
 */
export const calculateTotalPrice = async (cartItems) => {
  let totalPrice = 0;

  for (const item of cartItems) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new AppError(404, `Product ID ${item.productId} not found.`);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        400,
        `Insufficient stock for product ID ${item.productId}, Available: ${product.stock}`
      );
    }

    totalPrice += product.price * item.quantity;
  }

  return totalPrice;
};

/**
 * @description Create order items data for the order creation
 * @param {Array} cartItems - List of cart items
 * @returns {Array} - List of order items data
 */
export const createOrderItems = async (cartItems) => {
  const orderItemsData = [];

  for (const item of cartItems) {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new AppError(404, `Product ID ${item.productId}`);
    }

    orderItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    });
  }

  return orderItemsData;
};

/**
 * @desc    Initiate payment with PayULatam
 * @param   {Object} order - Order object
 */
const generatePaymentForm = async (order, user, shippingDetails) => {
  const { id, totalAmount } = order;

  const amount = tota;
};
