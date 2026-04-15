// function authFromGateway(req, res, next) {
//   const studentId = req.headers["student-id"];
//   const userRole = req.headers["user-role"];

//   if (!studentId && !userRole) {
//     return res
//       .status(401)
//       .json({ error: "Unauthorised: missing gateway identity headers" });
//   }

//   req.studentId = studentId || null;
//   req.userRole = userRole || null;
//   next();
// }

function authFromGateway(req, res, next) {
  const studentId = req.headers["x-student-id"];
  const role = req.headers["x-user-role"];
  const allowDevFallback = process.env.ALLOW_DEV_AUTH_FALLBACK === "true";

  // ✅ normal gateway path
  if (studentId && role) {
    req.studentId = studentId;
    req.role = role;
    return next();
  }

  // ✅ DEV fallback — explicitly opt-in for local testing only.
  if (process.env.NODE_ENV !== "production" && allowDevFallback) {
    req.studentId = "dev_student";
    req.role = "student";
    return next();
  }

  return res.status(401).json({
    error: "Unauthorised: missing gateway identity headers",
  });
}

export default authFromGateway;
