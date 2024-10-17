import { createPetService, getAllPetsService } from "../services/petService.js";

export const getAllPets = async (req, res, next) => {
  try {
    const filters = req.query;
    const pets = await getAllPetsService(filters);
    res.status(200).json({ pets });
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const petData = req.body;
    const imageFile = req.file;
    const userId = req.user.id;

    const newPet = await createPetService(petData, imageFile, userId);
    res.status(201).json({ pet: newPet });
  } catch (error) {
    next(error);
  }
};
