import { body, param, query } from "express-validator";
import { PetGender, PetHealthStatus, PetStatus } from "@prisma/client";

export const getAllPetsValidator = [
  query("breed")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Breed cannot be empty if provided"),

  query("gender")
    .optional()
    .isIn(PetGender)
    .withMessage("Gender must be valid if provided"),

  query("status")
    .optional()
    .isIn(PetStatus)
    .withMessage("Status must be valid if provided"),

  query("healthStatus")
    .optional()
    .isIn(PetHealthStatus)
    .withMessage("Invalid health status"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),

  query("sortBy")
    .optional()
    .isIn(["name", "breed", "gender", "status", "healthStatus", "createdAt"])
    .withMessage(
      "Invalid sortBy field. Allowed fields are: name, breed, gender, status, healthStatus, createdAt"
    ),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be either 'asc' or 'desc'"),

  query("search")
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage("Search must be a valid string"),
];

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

  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
];

export const updatePetValidator = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Pet ID must be a positive integer."),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Pet name is required."),

  body("breed")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Pet breed is required."),

  body("age")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Pet age must be a non-negative integer."),

  body("gender").optional().isIn(PetGender).withMessage(" Invalid pet gender "),

  body("healthStatus")
    .optional()
    .isIn(PetHealthStatus)
    .withMessage("Invalid health status"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Pet description is required."),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Pet location is required."),

  body("status")
    .optional()
    .isIn(PetStatus)
    .withMessage("Status must be valid if provided"),
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

export const updatePetStatusValidator = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Pet ID must be a positive integer."),

  body("status")
    .isIn(PetStatus)
    .withMessage("Status must be valid if provided"),
];
