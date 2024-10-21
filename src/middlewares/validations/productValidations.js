import { body, param, query } from "express-validator";
import { ProductCategory } from "@prisma/client";

export const getAllProductsValidator = [
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
    .withMessage("Category must be a string.")
    .custom((value) => {
      const categories = value.split(",").map((cat) => cat.trim());
      for (const category of categories) {
        if (!Object.values(ProductCategory).includes(category)) {
          throw new Error(`Invalid category: ${category}`);
        }
      }
      return true; // If all categories are valid, return true
    }),
  query("sortBy")
    .optional()
    .isIn(["name", "price", "createdAt", "updatedAt"])
    .withMessage("Invalid sortBy field."),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("SortOrder must be 'asc' or 'desc'."),
  query("search").optional().isString().withMessage("Search must be a string."),
];

export const searchProductsValidator = [
  query("query")
    .notEmpty()
    .withMessage("Search query is required.")
    .isString()
    .withMessage("Search query must be a string."),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer."),
];

export const createProductValidator = [
  body("name").trim().notEmpty().withMessage("Product name is required."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required."),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),
  body("category").isIn(ProductCategory).withMessage("Invalid category field."),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
];

export const getProductByIdValidator = [
  param("id").isInt().withMessage("Product ID must be an integer."),
];

export const updateProductValidator = [
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
    .isIn(ProductCategory)
    .withMessage("Invalid category field."),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
];

export const deleteProductValidator = [
  param("id").isInt().withMessage("Product ID must be an integer."),
];
