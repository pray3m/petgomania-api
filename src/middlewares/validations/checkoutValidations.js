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
