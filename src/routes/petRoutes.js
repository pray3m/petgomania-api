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

/**
 * @route GET /users/:userId/pets
 * @desc Retrieve all pets listed by a specific user
 * @access Public
 */

router.post(
  "/",
  authenticateToken,
  petUpload.single("image"),
  createPetValidator,
  handleValidationErrors,
  createPet
);

/**
 * @route POST /pets/:id/adopt
 * @desc Mark a pet as adopted by a user
 * @access Private
 */

/**
 * @route PUT /pets/:id
 * @desc Update a pet's information
 * @access Private
 */

/**
 * @route DELETE /pets/:id
 * @desc Delete a pet by ID
 * @access Private
 */

export default router;
