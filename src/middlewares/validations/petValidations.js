import { body } from "express-validator";

export const petValidator = [
  body("name")
    .optional() // Make optional for updates
    .isString()
    .withMessage("Name must be a string.")
    .notEmpty()
    .withMessage("Name is required."),

  body("breed")
    .optional()
    .isString()
    .withMessage("Breed must be a string.")
    .notEmpty()
    .withMessage("Breed is required."),

  body("age")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Age must be a positive integer."),

  body("gender")
    .optional()
    .isIn(["MALE", "FEMALE", "UNKNOWN"])
    .withMessage("Invalid gender."),

  body("healthStatus")
    .optional()
    .isIn(["HEALTHY", "SICK", "RECOVERING"])
    .withMessage("Invalid health status."),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string.")
    .notEmpty()
    .withMessage("Description is required."),

  body("status")
    .optional()
    .isIn(["AVAILABLE", "PENDING", "ADOPTED"])
    .withMessage("Invalid status."),

  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
];
