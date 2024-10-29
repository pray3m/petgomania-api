import crypto from "crypto";
import { sendEmail } from "./emailService.js";
import prisma from "../config/db.js";
import AppError from "./AppError.js";
import { response } from "express";

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
export const generatePaymentForm = (order, user, shippingDetails) => {
  const {
    PAYU_API_KEY,
    PAYU_MERCHANT_ID,
    PAYU_ACCOUNT_ID,
    PAYU_BASE_URL,
    PAYU_TEST,
  } = process.env;

  if (
    !PAYU_API_KEY ||
    !PAYU_MERCHANT_ID ||
    !PAYU_ACCOUNT_ID ||
    !PAYU_BASE_URL
  ) {
    throw new AppError(500, "Payment configuration is incomplete.");
  }

  const { id, totalPrice } = order;
  const amount = totalPrice.toFixed(2);
  const currency = "COP";
  const referenceCode = `ORDER-${id}`;

  // calculate tax and tax return base
  const tax = 0;
  const taxReturnBase = 0;

  // Generate signature
  const signatureString = `${PAYU_API_KEY}~${PAYU_MERCHANT_ID}~${referenceCode}~${amount}~${currency}`;
  const signature = crypto
    .createHash("md5")
    .update(signatureString)
    .digest("hex");

  // Prepare the form data
  const formFields = {
    merchantId: PAYU_MERCHANT_ID,
    accountId: PAYU_ACCOUNT_ID,
    description: `Order #${id} - Petgomania`,
    referenceCode: referenceCode,
    amount: amount,
    tax: tax,
    taxReturnBase: taxReturnBase,
    currency: currency,
    signature: signature,
    test: PAYU_TEST === "true" ? "1" : "0",
    buyerEmail: user.email,
    responseUrl: `${PAYU_BASE_URL}/payments/response`,
    confirmationUrl: `${PAYU_BASE_URL}/payments/webhook`,
    shippingAddress: shippingDetails.addressLine1,
    shippingCity: shippingDetails.city,
    shippingCountry: shippingDetails.country,
  };

  const paymentUrl =
    PAYU_TEST === "true"
      ? "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
      : "https://checkout.payulatam.com/ppp-web-gateway-payu/";

  return { paymentUrl, formFields };
};
