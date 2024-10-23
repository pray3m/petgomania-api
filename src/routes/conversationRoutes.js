import { Router } from "express";
import {
  createConversationHandler,
  getConversationMessagesHandler,
  getConversationsHandler,
} from "../controllers/conversationController.js";
import { authenticate } from "../middlewares/auth.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import {
  createConversationValidator,
  getConversationMessagesValidator,
} from "../middlewares/validations/conversationValidations.js";

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
 * @route GET    /conversations/:id/messages
 * @description Get conversation messages
 * @access Private
 */
router.get(
  "/:id/messages",
  authenticate,
  [...getConversationMessagesValidator, handleValidationErrors],
  getConversationMessagesHandler
);

export default router;
