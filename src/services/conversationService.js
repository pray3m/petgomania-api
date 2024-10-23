import { handleServiceError, prisma } from "../utils/index.js";

export const createConversation = async (user1Id, user2Id, petId) => {
  try {
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        user1Id,
        user2Id,
        petId,
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    const newConversation = await prisma.conversation.create({
      data: {
        user1Id,
        user2Id,
        petId,
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
          },
        },
        pet: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return newConversation;
  } catch (error) {
    handleServiceError(error, "creating conversation");
  }
};
