import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
} from "../controllers/orderController.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import { createOrderValidation } from "../middlewares/validations/orderValidations.js";

const router = Router();

// @route   POST /orders
// @desc    Create a new order
// @access  Private

router.post(
  "/",
  authenticateToken,
  createOrderValidation,
  handleValidationErrors,
  createOrder
);

// @route   GET /orders
// @desc    Retrieve all orders for the authenticated user
// @access  Private

router.get("/", authenticateToken, getUserOrders);

// @route   GET /orders/:id
// @desc    Retrieve a specific order by ID
// @access  Private (User or Admin)a

router.get("/:id", authenticateToken, getOrderById);

export default router;
