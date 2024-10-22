import { checkOwnerOrAdmin } from "../middlewares/roleAuth.js";
import { AppError, handleServiceError, prisma } from "../utils/index.js";

export const getAllPetsService = async (filters) => {
  const { breed, gender, status, healthStatus, page = 1, limit = 10 } = filters;

  const where = {};
  if (breed) where.breed = breed;
  if (gender) where.gender = gender;
  if (status) where.status = status;
  if (healthStatus) where.healthStatus = healthStatus;

  try {
    const pets = await prisma.pet.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit, 10),
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return pets;
  } catch (error) {
    handleServiceError(error, "retrieving pets");
  }
};

export const createPetService = async (petData) => {
  try {
    const pet = await prisma.pet.create({
      data: petData,
    });
    return pet;
  } catch (error) {
    handleServiceError(error, "creating pet");
  }
};

export const getPetByIdService = async (id) => {
  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!pet) {
      throw new AppError(404, `Pet with ID ${id} not found`);
    }

    return pet;
  } catch (error) {
    handleServiceError(error, "retrieving pet");
  }
};

export const getPetsByUserIdService = async (userId) => {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      orderBy: { createdAt: "desc" },
    });

    if (!pets || pets.length === 0) {
      throw new AppError(404, `No pets found for this user`);
    }

    return pets;
  } catch (error) {
    handleServiceError(error, "retrieving pets by user id ");
  }
};

export const updatePetStatusService = async (id, status, userId, userRole) => {
  try {
    const existingPet = await prisma.pet.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        user: true,
      },
    });

    if (!existingPet) {
      throw new AppError(404, "Pet not found. Please check the ID.");
    }

    checkOwnerOrAdmin(existingPet.userId, userId, userRole);

    const pet = await prisma.pet.update({
      where: { id: parseInt(id, 10) },
      data: { status },
    });

    return { message: "Pet status changed." };
  } catch (error) {
    handleServiceError(error, "updating pet status");
  }
};

export const deletePetService = async (id, userId, userRole) => {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        user: true,
      },
    });

    if (!pet) {
      throw new AppError(404, "Pet not found. Please check the ID.");
    }

    checkOwnerOrAdmin(pet.userId, userId, userRole);

    await prisma.pet.delete({
      where: { id: parseInt(id, 10) },
    });

    return { message: "Pet deleted successfully." };
  } catch (error) {
    handleServiceError(error, "deleting pet");
  }
};
