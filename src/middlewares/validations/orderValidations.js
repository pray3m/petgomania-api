import { body, param } from "express-validator";
import { orderStatuses } from "../../utils/constants.js";

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

export const updateOrderStatusValidation = [
  param("id").isInt({ gt: 0 }).withMessage("Order ID must be an integer."),
  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(orderStatuses)
    .withMessage("Invalid status value."),
];
