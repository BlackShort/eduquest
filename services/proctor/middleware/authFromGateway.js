import jwt from "jsonwebtoken";

function authFromGateway(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.accessToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.studentId = decoded.userId;
      req.role = decoded.role;
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        username: decoded.username,
        email: decoded.email,
      };

      return next();
    } catch {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }
  }

  const gatewayStudentId = req.headers["x-student-id"];
  const gatewayRole = req.headers["x-user-role"];

  if (gatewayStudentId && gatewayRole) {
    req.studentId = gatewayStudentId;
    req.role = gatewayRole;
    return next();
  }

  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_DEV_AUTH_FALLBACK === "true"
  ) {
    req.studentId = "dev_student";
    req.role = "student";
    return next();
  }

  return res.status(401).json({
    error: "Unauthorised: missing authentication",
  });
}

export default authFromGateway;