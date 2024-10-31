// src/controllers/paymentController.js

import crypto from "crypto";
import { AppError, prisma } from "../utils/index.js"; // Adjust the path accordingly

// Constants for payment states
const PAYMENT_STATES = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  DECLINED: "DECLINED",
  UNKNOWN: "UNKNOWN",
};

// Constants for order states
const ORDER_STATES = {
  PROCESSING: "PROCESSING",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
};

/**
 * @description Maps PayU transaction state to internal payment and order states
 * @param {String} polTransactionState - PayU transaction state
 * @returns {Object} Object containing payment and order states
 */
const mapTransactionState = (polTransactionState) => {
  const stateMap = {
    4: {
      payment: PAYMENT_STATES.APPROVED,
      order: ORDER_STATES.PROCESSING,
    },
    6: {
      payment: PAYMENT_STATES.DECLINED,
      order: ORDER_STATES.CANCELLED,
    },
    7: {
      payment: PAYMENT_STATES.PENDING,
      order: ORDER_STATES.PENDING,
    },
    // Add more mappings as needed
  };

  return (
    stateMap[polTransactionState] || {
      payment: PAYMENT_STATES.UNKNOWN,
      order: ORDER_STATES.PENDING,
    }
  );
};

/**
 * @description Verify the signature sent by PayU
 * @param {Object} params - Parameters required for signature verification
 * @returns {Boolean} True if signature is valid
 */
export const verifySignature = (params) => {
  const { signature, referenceCode, TX_VALUE, currency, polTransactionState } =
    params;

  const { PAYU_API_KEY, PAYU_MERCHANT_ID } = process.env;

  if (!PAYU_API_KEY || !PAYU_MERCHANT_ID) {
    throw new AppError(500, "PayU configuration is incomplete");
  }

  // Construct the signature string including polTransactionState
  const signatureString = `${PAYU_API_KEY}~${PAYU_MERCHANT_ID}~${referenceCode}~${TX_VALUE}~${currency}~${polTransactionState}`;
  const expectedSignature = crypto
    .createHash("md5")
    .update(signatureString)
    .digest("hex");

  // Debugging logs
  console.log("Signature String:", signatureString);
  console.log("Expected Signature:", expectedSignature);
  console.log("Received Signature:", signature);

  return signature === expectedSignature;
};

/**
 * @description Update product stock after successful payment
 * @param {Object} tx - Prisma transaction object
 * @param {Number} orderId - Order ID
 */
const updateProductStock = async (tx, orderId) => {
  const orderItems = await tx.orderItem.findMany({
    where: { orderId },
    include: { product: true },
  });

  for (const item of orderItems) {
    if (item.product.stock < item.quantity) {
      throw new AppError(
        400,
        `Insufficient stock for product ID ${item.productId}`
      );
    }

    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: { decrement: item.quantity },
      },
    });
  }
};

/**
 * @description Process payment status update
 * @param {Object} params - Payment parameters
 * @returns {Promise} Updated payment object
 */
const processPaymentUpdate = async ({
  referenceCode,
  polTransactionState,
  payment,
}) => {
  const { payment: paymentStatus, order: orderStatus } =
    mapTransactionState(polTransactionState);

  // Skip if payment status hasn't changed
  if (payment.state === paymentStatus) {
    console.log(
      `Payment for referenceCode ${referenceCode} already processed.`
    );
    return payment;
  }

  return await prisma.$transaction(async (tx) => {
    // Update payment status
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: { state: paymentStatus },
    });

    // Update order status
    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: orderStatus },
    });

    // Update stock if payment is approved
    if (paymentStatus === PAYMENT_STATES.APPROVED) {
      await updateProductStock(tx, payment.orderId);
    }

    return updatedPayment;
  });
};

/**
 * @description Validate payment parameters
 * @param {Object} params - Payment parameters
 * @throws {AppError} If parameters are invalid
 */
const validatePaymentParams = (params) => {
  let referenceCode, TX_VALUE, currency, polTransactionState, signature;

  if (params.referenceCode && params.TX_VALUE) {
    // Payment response
    referenceCode = params.referenceCode;
    TX_VALUE = params.TX_VALUE;
    currency = params.currency;
    polTransactionState = params.polTransactionState;
    signature = params.signature;
  } else if (params.reference_sale && params.value) {
    // Webhook
    referenceCode = params.reference_sale;
    TX_VALUE = params.value;
    currency = params.currency;
    polTransactionState = params.state_pol;
    signature = params.sign;
  } else {
    throw new AppError(400, "Missing required payment parameters");
  }

  if (
    !referenceCode ||
    !TX_VALUE ||
    !currency ||
    !polTransactionState ||
    !signature
  ) {
    throw new AppError(400, "Missing required payment parameters");
  }

  // Construct a new params object for signature verification
  const verificationParams = {
    signature: signature.trim(),
    referenceCode: referenceCode.trim(),
    TX_VALUE: TX_VALUE.trim(),
    currency: currency.trim(),
    polTransactionState: polTransactionState.trim(),
  };

  // Debugging logs
  console.log("----- Validating Payment Parameters -----");
  console.log("Reference Code:", verificationParams.referenceCode);
  console.log("TX_VALUE:", verificationParams.TX_VALUE);
  console.log("Currency:", verificationParams.currency);
  console.log("polTransactionState:", verificationParams.polTransactionState);
  console.log("Signature:", verificationParams.signature);
  console.log("------------------------------------------");

  if (!verifySignature(verificationParams)) {
    throw new AppError(400, "Invalid signature");
  }
};

/**
 * @description Handle PayU payment response (GET request)
 */
export const handlePaymentResponse = async (req, res, next) => {
  try {
    const params = req.query;
    console.log("Payment response received:", params);

    validatePaymentParams(params);

    const payment = await prisma.payment.findUnique({
      where: { payuOrderId: params.referenceCode },
      include: { order: true },
    });

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    await processPaymentUpdate({
      referenceCode: params.referenceCode,
      polTransactionState: params.polTransactionState,
      payment,
    });

    // Ensure FRONTEND_URL is set correctly
    if (!process.env.FRONTEND_URL) {
      throw new AppError(500, "FRONTEND_URL is not configured");
    }

    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/payment-status`);
    redirectUrl.searchParams.set("status", params.polTransactionState);
    redirectUrl.searchParams.set("orderId", payment.orderId.toString());

    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Payment response error:", error);
    // Ensure FRONTEND_URL is set correctly
    if (process.env.FRONTEND_URL) {
      res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
    } else {
      res.status(500).send("Payment processing error");
    }
  }
};

/**
 * @description Handle PayU webhook notification (POST request)
 */
export const handlePaymentWebhook = async (req, res, next) => {
  try {
    const params = req.body;
    console.log("Payment webhook received:", params);

    validatePaymentParams(params);

    const payment = await prisma.payment.findUnique({
      where: { payuOrderId: params.reference_sale },
      include: { order: true },
    });

    if (!payment) {
      console.warn(
        `Payment not found for referenceCode: ${params.reference_sale}`
      );
      return res.status(200).send("OK"); // Always respond 200 to prevent retries
    }

    await processPaymentUpdate({
      referenceCode: params.reference_sale,
      polTransactionState: params.state_pol,
      payment,
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("Payment webhook error:", error);
    // Always return 200 for webhooks to prevent retries
    res.status(200).send("OK");
  }
};
