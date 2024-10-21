import { AppError, handleServiceError, prisma } from "../utils/index.js"; // Ensure this path is correct

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
