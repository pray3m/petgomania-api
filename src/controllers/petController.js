import {
  createPetService,
  getAllPetsService,
  getPetByIdService,
  getPetsByUserIdService,
} from "../services/petService.js";

export const getAllPets = async (req, res, next) => {
  try {
    const filters = req.query;
    const pets = await getAllPetsService(filters);
    res.status(200).json({ pets });
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pet = await getPetByIdService(id);
    res.status(200).json({ pet });
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const { name, description, breed, age, gender, healthStatus } = req.body;

    let imageUrl;

    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }
    const userId = req.user.id;
    const petData = {
      name,
      description,
      breed,
      age: parseInt(age, 10),
      gender,
      healthStatus,
      userId,
      imageUrl,
    };
    const pet = await createPetService(petData);
    res.status(201).json({ message: "Pet added successfully.", pet });
  } catch (error) {
    next(error);
  }
};

export const getPetsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const pets = await getPetsByUserIdService(userId);
    res.status(200).json({ pets });
  } catch (error) {
    next(error);
  }
};
