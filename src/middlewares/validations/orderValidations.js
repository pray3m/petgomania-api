import { body, param } from "express-validator";

export const createOrderValidation = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products array is required and cannot be empty."),
  body("products.*.productId")
    .isInt({ gt: 0 })
    .withMessage("Each product must have a valid productId."),
  body("products.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Each product must have a quantity greater than 0."),
];

export const updateOrderStatusValidator = [
  param("id").isInt().withMessage("Order ID must be an integer."),
  body("status")
    .isIn(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .withMessage("Invalid status value."),
];
