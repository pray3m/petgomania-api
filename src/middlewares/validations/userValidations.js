import { body } from "express-validator";

export const updateUserValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name can be at most 50 characters long"),
];
