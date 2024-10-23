import {
  createConversation,
  getConversationMessages,
  getConversations,
} from "../services/conversationService.js";
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

export const getConversationsHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversations = await getConversations(userId);
    res.status(201).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const getConversationMessagesHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const messages = await getConversationMessages(parseInt(id, 10), userId);
    res.status(201).json(messages);
  } catch (error) {
    next(error);
  }
};
