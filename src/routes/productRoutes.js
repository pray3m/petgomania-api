import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  updateProduct,
} from "../controllers/productController.js";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/roleAuth.js";
import { productUpload } from "../middlewares/upload.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import {
  createProductValidator,
  deleteProductValidator,
  getAllProductsValidator,
  getProductByIdValidator,
  searchProductsValidator,
  updateProductValidator,
} from "../middlewares/validations/productValidations.js";

const router = Router();

/**
 * @route GET /products
 * @description Get all products with optional filters (pagination, sorting, category,search)
 * @access Public
 */
router.get(
  "/",
  [...getAllProductsValidator, handleValidationErrors],
  getAllProducts
);

/**
 * @route GET /products/search
 * @description Search products based on query
 *  @access  Public
 */
router.get(
  "/search",
  [...searchProductsValidator, handleValidationErrors],
  searchProducts
);

/**
 * @route GET /products/:id
 * @description Get a product by its ID
 * @access Public
 */
router.get(
  "/:id",
  [...getProductByIdValidator, handleValidationErrors],
  getProductById
);

/**
 * @route POST /products
 * @description Create a new product (Admin only)
 * @access Private (Admin)
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  productUpload.single("image"),
  [...createProductValidator, handleValidationErrors],
  createProduct
);

/**
 * @route PUT /products/:id
 * @description Update a product by its ID (Admin only)
 * @access Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productUpload.single("image"),
  [...updateProductValidator, handleValidationErrors],
  updateProduct
);

/**
 * @route DELETE /products/:id
 * @description Delete a product by its ID (Admin only)
 * @access Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  [...deleteProductValidator, handleValidationErrors],
  deleteProduct
);

export default router;
