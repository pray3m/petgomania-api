import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import { createOrderValidation, updateOrderStatusValidation } from "../middlewares/validations/orderValidations.js";

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
// @access  Private (User or Admin)

router.get("/:id", authenticateToken, getOrderById);

/**
 * @route   PUT /orders/:id/status
 * @desc    Update the status of a specific order
 * @access  Private (Admin only)
 */

router.put(
  "/:id/status",
  authenticateToken,
  authorizeAdmin,
  updateOrderStatusValidation,
  handleValidationErrors,
  updateOrderStatus
);

export default router;
