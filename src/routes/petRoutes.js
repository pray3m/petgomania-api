import { Router } from "express";
import {
  createPet,
  deletePet,
  getAllPets,
  getPetById,
  getPetsByUserId,
} from "../controllers/petController.js";
import { petUpload } from "../middlewares/upload.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import { createPetValidator } from "../middlewares/validations/petValidations.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

/**
 * @route GET /pets
 * @description Retrieve all pets with optional filters
 * @access Public
 */

router.get("/", getAllPets);

/**
 * @route GET /pets/:id
 * @description Retrieve a pet by ID
 * @access Public
 */

router.get("/:id", getPetById);

/**
 * @route POST /pets
 * @description Create a new pet
 * @access Private
 */

router.post(
  "/",
  authenticate,
  petUpload.single("image"),
  createPetValidator,
  handleValidationErrors,
  createPet
);

/**
 * @route GET /pets/users/:userId
 * @description Retrieve all pets listed by a specific user
 * @access Public
 */

router.get("/users/:userId", getPetsByUserId);

/**
 * @route PUT /pets/:id
 * @description Update a pet's information
 * @access Private
 */

// router.put("/:id", updatePet);

/**
 * @route DELETE /pets/:id
 * @description Delete a pet by ID
 * @access Owner or Admin
 */

router.delete("/:id", authenticate, deletePet);

export default router;
