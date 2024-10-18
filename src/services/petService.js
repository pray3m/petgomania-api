import prisma from "../config/db.js";

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
    throw { statusCode: 500, message: "Failed to retrieve pets.", error };
  }
};

export const createPetService = async (petData) => {
  try {
    const pet = await prisma.pet.create({
      data: {
        ...petData,
      },
    });
    return pet;
  } catch (error) {
    console.error("Error creating pet:", error);
    throw new Error("Error creating pet: " + error.message);
  }
};
