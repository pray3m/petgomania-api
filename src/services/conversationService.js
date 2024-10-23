import { AppError, handleServiceError, prisma } from "../utils/index.js";

export const createConversation = async (userId, ownerId, petId) => {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      throw new AppError(404, `Pet with ID ${petId} is not available.`);
    }

    if (pet.userId !== ownerId) {
      throw new AppError(
        404,
        `Pet with ID ${petId} is not owned by this user.`
      );
    }

    const include = {
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
    };

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        user1Id: userId,
        user2Id: ownerId,
        petId,
      },
      include,
    });

    if (existingConversation) {
      return existingConversation;
    }

    const newConversation = await prisma.conversation.create({
      data: {
        user1Id: userId,
        user2Id: ownerId,
        petId,
      },
      include,
    });

    return newConversation;
  } catch (error) {
    handleServiceError(error, "creating conversation");
  }
};

export const getConversations = async (userId) => {
  try {
    return await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pet: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            status: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (error) {
    handleServiceError(error, "fetching conversations");
  }
};

export const getConversationMessages = async (conversationId, userId) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      throw new AppError(404, "Conversation not found");
    }

    return conversation.messages;
  } catch (error) {
    handleServiceError(error, "fetching messages");
  }
};
