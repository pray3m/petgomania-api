import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import { productUpload } from "../middlewares/upload.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import {
  createProductValidation,
  deleteProductValidation,
  getAllProductsValidation,
  getProductByIdValidation,
  updateProductValidation,
} from "../middlewares/validations/productValidations.js";

const router = Router();

// Public Routes
router.get(
  "/",
  getAllProductsValidation,
  handleValidationErrors,
  getAllProducts
);

router.get(
  "/:id",
  getProductByIdValidation,
  handleValidationErrors,
  getProductById
);

// Admin Routes
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  productUpload.single("image"),
  createProductValidation,
  handleValidationErrors,
  createProduct
);

router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  productUpload.single("image"),
  updateProductValidation,
  handleValidationErrors,
  updateProduct
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  deleteProductValidation,
  deleteProduct
);

export default router;
