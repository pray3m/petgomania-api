import { Router } from "express";
import { createPet, getAllPets } from "../controllers/petController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

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

/**
 * @route POST /pets
 * @desc Create a new pet
 * @access Private
 */

router.post("/", authenticateToken, createPet);

export default router;
