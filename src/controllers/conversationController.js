import { createConversation } from "../services/conversationService";
import { AppError } from "../utils/index.js";

export const createConversationHandler = async (req, res, next) => {
  try {
    const { petId, ownerId } = req.body;
    const userId = req.user.id;

    if (userId === ownerId) {
      throw new AppError(400, "Cannot create conversation with yourself");
    }
    const conversation = await createConversation(userId, ownerId, petId);
    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};
