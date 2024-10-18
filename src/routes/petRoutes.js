import { Router } from "express";
import {
  createPet,
  getAllPets,
  getPetById,
} from "../controllers/petController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { petUpload } from "../middlewares/upload.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import { createPetValidator } from "../middlewares/validations/petValidations.js";

const router = Router();

/**
 * @route GET /pets
 * @desc Retrieve all pets with optional filters
 * @access Public
 */

router.get("/", getAllPets);

/**
 * @route GET /pets/:id
 * @desc Retrieve a pet by ID
 * @access Public
 */

router.get("/:id", getPetById);

/**
 * @route POST /pets
 * @desc Create a new pet
 * @access Private
 */

router.post(
  "/",
  authenticateToken,
  petUpload.single("image"),
  createPetValidator,
  handleValidationErrors,
  createPet
);

export default router;
