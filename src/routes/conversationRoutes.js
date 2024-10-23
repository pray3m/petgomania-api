import { Router } from "express";
import {
  createConversationHandler,
  getConversationsHandler,
} from "../controllers/conversationController.js";
import { authenticate } from "../middlewares/auth.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import { createConversationValidator } from "../middlewares/validations/conversationValidations.js";

const router = Router();

/**
 * @route POST /conversations
 * @description Create  conversations
 * @access Private
 */
router.post(
  "/",
  authenticate,
  [...createConversationValidator, handleValidationErrors],
  createConversationHandler
);

/**
 * @route GET /conversations
 * @description get conversations
 * @access Private
 */
router.get("/", authenticate, getConversationsHandler);

/**
GET    /api/conversations                   - List all conversations
GET    /api/conversations/:id/messages      - Get conversation messages
 */

export default router;
