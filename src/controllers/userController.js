import {
  getUserProfileService,
  updateUserProfileService,
} from "../services/userService.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await getUserProfileService(userId);

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const user = await updateUserProfileService(userId, name);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
