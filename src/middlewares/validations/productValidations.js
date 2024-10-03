import { body, param, query } from "express-validator";

export const getAllProductsValidation = [
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer."),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer."),
    query("category")
      .optional()
      .isString()
      .withMessage("Category must be a string."),
    query("sortBy")
      .optional()
      .isIn(["name", "price", "createdAt", "updatedAt"])
      .withMessage("Invalid sortBy field."),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("SortOrder must be 'asc' or 'desc'."),
    query("search")
      .optional()
      .isString()
      .withMessage("Search must be a string."),
  ],
];

// Create Product Validation
const allowedCategories = [
  "food",
  "toys",
  "accessories",
  "healthcare",
  "grooming",
];

export const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required."),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),
  body("category").isIn(allowedCategories).withMessage("Invalid category."),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
];

// Update Product Validation
export const updateProductValidation = [
  param("id").isInt().withMessage("Product ID must be an integer."),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty."),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product description cannot be empty."),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty."),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
];

// Delete Product Validation
export const deleteProductValidation = [
  param("id").isInt().withMessage("Product ID must be an integer."),
];
