import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createOrderValidation } from "../middlewares/validations/orderValidations.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import { createOrder } from "../controllers/orderController.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  createOrderValidation,
  handleValidationErrors,
  createOrder
);

export default router;
