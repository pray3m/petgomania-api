import { PetGender, PetHealthStatus } from "@prisma/client";
import { body } from "express-validator";

export const createPetValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be a string."),

  body("breed")
    .notEmpty()
    .withMessage("Breed is required.")
    .isString()
    .withMessage("Breed must be a string."),

  body("age")
    .notEmpty()
    .withMessage("Age is required.")
    .isInt({ gt: 0 })
    .withMessage("Age must be a positive integer."),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required.")
    .isIn(PetGender)
    .withMessage("Invalid gender."),

  body("healthStatus")
    .optional()
    .isIn(PetHealthStatus)
    .withMessage("Invalid health status."),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string.")
    .notEmpty()
    .withMessage("Description is required."),

  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
];
