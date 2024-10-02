export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; //  Assuming req.user is populated by auth middleware

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: No user found." });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden: Access is denied." });
    }

    next();
  };
};
