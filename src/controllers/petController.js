import {
  createPetService,
  deletePetService,
  getAllPetsService,
  getPetByIdService,
  getPetsByUserIdService,
} from "../services/petService.js";

export const getAllPets = async (req, res, next) => {
  try {
    const filters = req.query;
    const pets = await getAllPetsService(filters);
    res.status(200).json({
      status: "success",
      message: "Pets retrieved successfully",
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pet = await getPetByIdService(id);
    res.status(200).json({
      status: "success",
      message: "Pet retrieved successfully",
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const { name, description, breed, age, gender, healthStatus, location } =
      req.body;

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
      location,
      userId,
      imageUrl,
    };
    const pet = await createPetService(petData);
    res.status(201).json({
      status: "success",
      message: "Pet added successfully.",
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const getPetsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const pets = await getPetsByUserIdService(userId);
    res.status(200).json({
      status: "success",
      message: "Pets retrieved successfully",
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    await deletePetService(id, userId, userRole);
    res
      .status(200)
      .json({ status: "success", message: "Pet deleted successfully." });
  } catch (error) {
    next(error);
  }
};
