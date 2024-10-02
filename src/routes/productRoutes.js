import { Router } from "express";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import { createProductValidation } from "../middlewares/validations/productValidations.js";
import { createProduct } from "../controllers/productController.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";

const router = Router();

// Public Routes
// router.get("/", getAllProducts);
// router.get("/:id", getProductById);

// Admin Routes
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  createProductValidation,
  handleValidationErrors,
  createProduct
);

// //Get all products
// router.get("/", getProducts);

// // Get a single product by ID
// router.get(
//   "/:id",
//   [param("id").isInt().withMessage("Product ID must be an integer.")],
//   handleValidationErrors,
//   getProductById
// );

// // Update a product by ID
// router.put(
//   "/:id",
//   [
//     param("id").isInt().withMessage("Product ID must be an integer."),
//     body("name")
//       .optional()
//       .trim()
//       .notEmpty()
//       .withMessage("Product name cannot be empty."),
//     body("description")
//       .optional()
//       .trim()
//       .notEmpty()
//       .withMessage("Product description cannot be empty."),
//     body("price")
//       .optional()
//       .isFloat({ gt: 0 })
//       .withMessage("Price must be a positive number."),
//     body("category")
//       .optional()
//       .trim()
//       .notEmpty()
//       .withMessage("Category cannot be empty."),
//     body("stock")
//       .optional()
//       .isInt({ min: 0 })
//       .withMessage("Stock must be a non-negative integer."),
//     body("imageUrl")
//       .optional()
//       .isURL()
//       .withMessage("Image URL must be a valid URL."),
//   ],
//   handleValidationErrors,
//   updateProduct
// );

// // Delete a product by ID
// router.delete(
//   "/:id",
//   [param("id").isInt().withMessage("Product ID must be an integer.")],
//   handleValidationErrors,
//   deleteProduct
// );

export default router;
