import { body } from "express-validator";

export const validateCartValidator = [
  body("items").isArray().notEmpty().withMessage("Cart is empty."),
  body("items.*.productId")
    .isInt({ gt: 0 })
    .withMessage("Valid product ID is required."),
  body("items.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than 0."),
  body("items.*.price")
    .isFloat({ min: 0 })
    .withMessage("Valid price is required"),
];

export const checkoutValidator = [
  body("cartItems")
    .isArray({ min: 1 })
    .withMessage("Cart items are required.")
    .bail()
    .custom((items) => {
      for (const item of items) {
        if (!item.productId || !item.quantity) {
          throw new Error("Each cart item must have a productId and quantity.");
        }
        if (typeof item.quantity !== "number" || item.quantity <= 0) {
          throw new Error("Quantity must be a positive number.");
        }
      }
      return true;
    }),

  body("shippingDetails").custom((value) => {
    if (typeof value !== "object" || value === null) {
      throw new Error("Shipping details must be provided.");
    }
    return true;
  }),

  body("shippingDetails.fullName")
    .notEmpty()
    .withMessage("Full name is required."),
  body("shippingDetails.addressLine1")
    .notEmpty()
    .withMessage("Address Line 1 is required."),
  body("shippingDetails.addressLine2").optional().trim(),
  body("shippingDetails.city").notEmpty().withMessage("City is required."),
  body("shippingDetails.state").notEmpty().withMessage("State is required."),
  body("shippingDetails.postalCode")
    .notEmpty()
    .withMessage("Postal code is required."),
  body("shippingDetails.country")
    .notEmpty()
    .withMessage("Country is required."),
  body("shippingDetails.contactNumber")
    .notEmpty()
    .withMessage("Contact number is required."),
  body("shippingDetails.email")
    .isEmail()
    .withMessage("Enter valid email")
    .normalizeEmail(),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required.")
    .bail()
    .isIn(["VISA", "MASTERCARD", "AMEX", "PAYU"]) // TODO: Include supported payments
    .withMessage("Invalid payment method."),
];
