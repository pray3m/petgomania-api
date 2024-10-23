import { Router } from "express";
import {
  createConversationHandler,
  getConversationMessagesHandler,
  getConversationsHandler,
  sendMessageHandler,
} from "../controllers/conversationController.js";
import { authenticate } from "../middlewares/auth.js";
import {
  createConversationValidator,
  getConversationMessagesValidator,
  sendMessageValidator,
} from "../middlewares/validations/conversationValidations.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";

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

/**
 * @route POST conversations/:id/messages
 * @description Send the messages
 * @access Private
 */
router.post(
  "/:id/messages",
  authenticate,
  [...sendMessageValidator, handleValidationErrors],
  sendMessageHandler
);

export default router;
