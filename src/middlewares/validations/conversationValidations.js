import { body } from "express-validator";

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
