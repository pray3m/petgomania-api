import { log } from "console";
import {
  calculateTotalPrice,
  createOrderItems,
  generatePaymentForm,
} from "../utils/helpers.js";
import { AppError, handleServiceError, prisma } from "../utils/index.js";

export const initiateCheckoutService = async ({
  userId,
  cartItems,
  shippingDetails,
  paymentMethod,
}) => {
  try {
    if (!cartItems || cartItems.length === 0) {
      throw new AppError(400, "Cart is empty.");
    }
    if (!shippingDetails) {
      throw new AppError(400, "Shipping details are required");
    }

    const totalPrice = await calculateTotalPrice(cartItems);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: "PENDING",
          orderItems: {
            create: await createOrderItems(cartItems),
          },
          shippingAddress: {
            create: {
              ...shippingDetails,
            },
          },
        },
      });

      const { paymentUrl, formFields } = generatePaymentForm(
        order,
        user,
        shippingDetails
      );

      log(paymentUrl);
      log(formFields);

      const payment = await tx.payment.create({
        data: {
          payuOrderId: formFields.referenceCode,
          state: "CREATED",
          orderId: order.id,
        },
      });

      return { paymentUrl, formFields, orderId: order.id };
    });

    return result;
  } catch (error) {
    handleServiceError(error, "initiating checkout");
  }
};

export const validateCartService = async (items) => {
  let isValid = true;
  let total = 0;
  const updatedItems = [];
  const invalidItems = [];
  const priceChanges = [];
  const stockIssues = [];

  try {
    for (const item of items) {
      const { productId, quantity, price } = item;

      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      // Check if product exists and is active
      if (!existingProduct) {
        invalidItems.push({
          productId,
          quantity,
          reason: "Product not found or inactive",
        });
        isValid = false;
        continue;
      }

      // Check stock availability
      if (existingProduct.stock < quantity) {
        stockIssues.push({
          productId,
          quantity,
          availableStock: existingProduct.stock,
          reason: "Insufficient stock",
        });
        isValid = false;
      }

      // Check for price changes
      if (existingProduct.price !== price) {
        priceChanges.push({
          productId,
          quantity,
          currentPrice: existingProduct.price,
          priceDifference: Math.abs(existingProduct.price - price),
        });
        isValid = false;
      }

      // Calculate total for valid items
      total += existingProduct.price * quantity;
      updatedItems.push({
        productId,
        quantity,
        name: existingProduct.name,
        currentPrice: existingProduct.price,
        total: existingProduct.price * quantity,
      });
    }

    // Prepare the validation response
    const validationResponse = {
      isValid,
      updatedItems,
      invalidItems,
      priceChanges,
      stockIssues,
      total,
      message: isValid ? "Cart is valid." : "Cart requires updates",
    };

    if (!isValid) {
      throw new AppError(400, "Cart requires updates.", validationResponse);
    }

    return validationResponse;
  } catch (error) {
    handleServiceError(error, "validating cart");
  }
};
