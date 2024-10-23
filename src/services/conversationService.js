import { AppError, handleServiceError, prisma } from "../utils/index.js";
import { getIO } from "./socketService.js";

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

export const sendMessage = async (conversationId, senderId, content) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: true,
        user2: true,
      },
    });

    if (!conversation) {
      throw new AppError(404, "Conversation not found!");
    }

    if (
      conversation.user1Id !== senderId &&
      conversation.user2Id !== senderId
    ) {
      throw new AppError(
        403,
        "You are not authorized to send messages in this conversation!"
      );
    }

    const receiverId =
      conversation.user1Id === senderId
        ? conversation.user2Id
        : conversation.user1Id;

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Emit the messsage to all users in the conversation room
    const io = getIO();
    io.to(`conversation_${conversationId}`).emit("new_message", message);

    return message;
  } catch (error) {
    handleServiceError(error, "sending message");
  }
};
