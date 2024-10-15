import { Router } from "express";
import { getAllPets } from "../controllers/petController.js";

const router = Router();

/**
 * @route GET /pets
 * @desc Retrieve all pets with optional filters
 * @access Public
 */

router.get("/", getAllPets);

export default router;
