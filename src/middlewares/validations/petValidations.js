import { body, param } from "express-validator";
import { PetGender, PetHealthStatus } from "@prisma/client";

export const createPetValidator = [
  body("name").trim().notEmpty().withMessage("Pet name is required."),

  body("breed").trim().notEmpty().withMessage("Pet breed is required."),

  body("age")
    .isInt({ min: 0 })
    .withMessage("Pet age must be a non-negative integer."),

  body("gender").isIn(PetGender).withMessage("Valid Pet gender is required."),

  body("healthStatus")
    .optional()
    .isIn(PetHealthStatus)
    .withMessage("Valid health status is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Pet description is required."),

  body("location").trim().notEmpty().withMessage("Pet location is required."),
];

export const deletePetValidator = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Pet ID must be a positive integer."),
];

export const getPetByIdValidator = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Pet ID must be a positive integer."),
];

export const getPetsByUserIdValidator = [
  param("userId")
    .isInt({ gt: 0 })
    .withMessage("User ID must be a positive integer."),
];
