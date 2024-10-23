import { body, param } from "express-validator";

export const createConversationValidator = [
  body("petId")
    .notEmpty()
    .withMessage("petId is required")
    .isInt({ gt: 0 })
    .withMessage("Invalid petId"),

  body("ownerId")
    .notEmpty()
    .withMessage("Pet OwnerId is required")
    .isInt({ gt: 0 })
    .withMessage("Invalid pet ownerId"),
];

export const getConversationMessagesValidator = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid conversation ID"),
];
