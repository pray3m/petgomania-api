import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createOrderValidation } from "../middlewares/validations/orderValidations.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import { createOrder, getUserOrders } from "../controllers/orderController.js";

const router = Router();

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

export default router;
