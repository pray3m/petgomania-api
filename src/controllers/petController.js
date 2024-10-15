import { getAllPetsService } from "../services/petService.js";

export const getAllPets = async (req, res, next) => {
  try {
    const filters = req.query;
    const pets = await getAllPetsService(filters);
    res.status(200).json({ pets });
  } catch (error) {
    next(error);
  }
};
