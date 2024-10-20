import AppError from "../utils/AppError.js";

/**
 * Role-based authorization middleware
 * @param {string|string[]} roles - Required role(s) for access
 * @returns {Function} Express middleware
 *
 * @example
 * router.delete('/users/:id', authorize('ADMIN'), deleteUser);
 * router.patch('/posts', authorize(['ADMIN', 'MODERATOR']), updatePost);
 */
export const authorize = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError(401, "Authentication required");
      }

      if (!allowedRoles.includes(req.user.role)) {
        const message =
          allowedRoles.length === 1
            ? `Requires ${allowedRoles[0]} role`
            : `Requires one of: ${allowedRoles.join(", ")}`;

        throw new AppError(403, message);
      }

      next();
    } catch (error) {
      next(
        error instanceof AppError
          ? error
          : new AppError(500, "Authorization failed")
      );
    }
  };
};

/**
 * Check if the user is the owner of the resource or an admin.
 * @param {string} resourceUserId - The ID of the user who owns the resource.
 * @param {string} userId - The ID of the current user.
 * @param {string} userRole - The role of the current user.
 * @throws {AppError} If the user is not authorized.
 */
export const checkOwnerOrAdmin = (resourceUserId, userId, userRole) => {
  if (resourceUserId !== userId && userRole !== "ADMIN") {
    throw new AppError(403, "Unauthorized: You can only delete your own pets.");
  }
};
