import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { updateUserValidator } from "../middlewares/validations/userValidations.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";

const router = Router();

/**
 * @route GET /users/me
 * @description Get authenticated user's profile
 * @access Private
 */
router.get("/me", authenticate, getUserProfile);

/**
 * @route PUT /users/me
 * @description Update authenticated user's name
 * @access Private
 */
router.put(
  "/me",
  authenticate,
  [...updateUserValidator, handleValidationErrors],
  updateUserProfile
);

export default router;
