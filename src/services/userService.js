import { AppError, handleServiceError, prisma } from "../utils/index.js";

export const getUserProfileService = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  } catch (error) {
    handleServiceError(error, " getting user profile");
  }
};

export const updateUserProfileService = async (userId, name) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
      },
      select: {
        name: true,
        email: true,
      },
    });

    return user;
  } catch (error) {
    handleServiceError(error, "updating user profile");
  }
};
