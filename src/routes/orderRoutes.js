import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/roleAuth.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import {
  createOrderValidation,
  deleteOrderValidator,
  updateOrderStatusValidation,
} from "../middlewares/validations/orderValidations.js";

const router = Router();

/**
 * @route   POST /orders
 * @description Create a new order for the authenticated user
 * @access  Private
 */
router.post(
  "/",
  authenticate,
  createOrderValidation,
  handleValidationErrors,
  createOrder
);

/**
 * @route   GET /orders
 * @description Retrieve all orders for the authenticated user
 * @access  Private
 */
router.get("/", authenticate, getUserOrders);

/**
 * @route   GET /orders/:id
 * @description Retrieve a specific order by its ID
 * @access  Private (User or Admin)
 */
router.get("/:id", authenticate, getOrderById);

/**
 * @route   PUT /orders/:id/status
 * @description Update the status of a specific order (Admin only)
 * @access  Private (Admin only)
 */
router.put(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateOrderStatusValidation,
  handleValidationErrors,
  updateOrderStatus
);

/**
 * @route   DELETE /orders/:id
 * @description Delete a specific order (Admin only)
 * @access  Private (Admin only)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteOrderValidator,
  handleValidationErrors,
  deleteOrder
);

export default router;
