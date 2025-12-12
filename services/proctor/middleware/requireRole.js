function requireRole(allowed) {
  return (req, res, next) => {
    const role = req.headers["user-role"];

    if (!role) {
      return res.status(401).json({ error: "Role missing from request" });
    }

    if (!allowed.includes(role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient permissions" });
    }

    next();
  };
}

module.exports = requireRole;
