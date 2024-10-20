import { checkOwnerOrAdmin } from "../middlewares/roleAuth.js";
import { AppError, handleServiceError, prisma } from "../utils/index.js";

export const getAllPetsService = async (filters) => {
  try {
    const { breed, gender, healthStatus, page = 1, limit = 10 } = filters;

    const where = {};
    if (breed) where.breed = breed;
    if (gender) where.gender = gender;
    if (healthStatus) where.healthStatus = healthStatus;

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
    console.error("Error retrieving pets:", error);
    throw { statusCode: 500, message: "Failed to retrieve pets." };
  }
};

export const createPetService = async (petData) => {
  try {
    const pet = await prisma.pet.create({
      data: petData,
    });
    return pet;
  } catch (error) {
    console.error("Error creating pet:", error);
    throw { statusCode: 500, message: "Error creating pet: " + error.message };
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
      throw { statusCode: 404, message: "No pets found for this user." };
    }

    return pets;
  } catch (error) {
    console.error("Error retrieving pets by user ID: ", error);
    throw {
      statusCode: 500,
      message: "Error retrieving pets by UserID: " + error.message,
    };
  }
};

export const deletePetService = async (id, userId, userRole) => {
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

  if (pet.userId !== userId && userRole !== "ADMIN") {
    throw new AppError(403, "Unauthorized: You can only delete your own pets.");
  }

  try {
    await prisma.pet.delete({
      where: { id: parseInt(id, 10) },
    });

    return { message: "Pet deleted successfully." };
  } catch (error) {
    handleServiceError(error, "deleting pet");
  }
};
