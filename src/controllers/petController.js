import {
  createPetService,
  deletePetService,
  getAllPetsService,
  getPetByIdService,
  getPetsByUserIdService,
  updatePetStatusService,
} from "../services/petService.js";

export const getAllPets = async (req, res, next) => {
  try {
    const {
      breed,
      gender,
      status,
      healthStatus,
      page,
      limit,
      sortBy,
      sortOrder,
      search,
    } = req.query;

    const filters = {
      breed,
      gender,
      status,
      healthStatus,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sortBy,
      sortOrder,
      search,
    };

    const { pets, meta } = await getAllPetsService(filters);
    res.status(200).json({
      status: "success",
      message: "Pets retrieved successfully",
      pets,
      meta,
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
      pet,
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
      pet,
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
      pets,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePetStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { message } = await updatePetStatusService(
      id,
      status,
      userId,
      userRole
    );
    res.status(200).json({
      status: "success",
      message,
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
    const { message } = await deletePetService(id, userId, userRole);
    res.status(200).json({ status: "success", message });
  } catch (error) {
    next(error);
  }
};
