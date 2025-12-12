function authFromGateway(req, res, next) {
  const studentId = req.headers["student-id"];
  const userRole = req.headers["user-role"];

  if (!studentId && !userRole) {
    return res
      .status(401)
      .json({ error: "Unauthorised: missing gateway identity headers" });
  }

  req.studentId = studentId || null;
  req.userRole = userRole || null;
  next();
}

module.exports = authFromGateway;
