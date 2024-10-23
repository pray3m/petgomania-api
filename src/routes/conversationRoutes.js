import { Router } from "express";
import { createConversationHandler } from "../controllers/conversationController";
import { authenticate } from "../middlewares/auth.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import { createConversationValidator } from "../middlewares/validations/conversationValidations.js";

const router = Router();

router.post(
  "/",
  authenticate,
  [...createConversationValidator, handleValidationErrors],
  createConversationHandler
);

export default router;
