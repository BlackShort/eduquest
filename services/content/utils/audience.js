export const normalizeCourseName = (course) =>
  String(course || "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();

const normalizeCourses = (courses) =>
  (Array.isArray(courses) ? courses : [courses])
    .map(normalizeCourseName)
    .filter(Boolean);

const normalizeSemester = (semester) => {
  const value = Number(semester);
  return Number.isFinite(value) ? value : null;
};

export const isStudentRole = (role) => {
  const normalizedRole = String(role || "").toLowerCase();
  return normalizedRole === "user" || normalizedRole === "student";
};

export const toAudienceProfile = (user) => ({
  courses: normalizeCourses(user?.courses),
  semester: normalizeSemester(user?.semester),
});

const getAuthServiceUrl = () =>
  (process.env.AUTH_SERVICE_URL || process.env.AUTH_URL || "http://localhost:5001")
    .replace(/\/$/, "");

export const audienceMatches = (student, faculty) => {
  const studentProfile = toAudienceProfile(student);
  const facultyProfile = toAudienceProfile(faculty);

  if (
    studentProfile.semester === null ||
    facultyProfile.semester === null ||
    studentProfile.semester !== facultyProfile.semester
  ) {
    return false;
  }

  if (studentProfile.courses.length === 0 || facultyProfile.courses.length === 0) {
    return false;
  }

  const facultyCourses = new Set(facultyProfile.courses);
  return studentProfile.courses.some((course) => facultyCourses.has(course));
};

export const getAuthUserById = async (userId, req) => {
  if (!userId) return null;

  const headers = {};
  if (req?.authToken) {
    headers.Authorization = `Bearer ${req.authToken}`;
  }

  const response = await fetch(`${getAuthServiceUrl()}/v1/users/${userId}`, {
    headers,
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.user || null;
};

export const getCurrentAudienceUser = async (req) => {
  if (!req.user) return null;

  const tokenProfile = toAudienceProfile(req.user);
  if (tokenProfile.courses.length > 0 && tokenProfile.semester !== null) {
    return req.user;
  }

  const dbUser = await getAuthUserById(req.user.userId, req);
  return dbUser || req.user;
};

export const getAudienceFacultyMap = async (creatorIds, req) => {
  const uniqueIds = [...new Set(creatorIds.map(String).filter(Boolean))];
  if (uniqueIds.length === 0) return new Map();

  const facultyProfiles = await Promise.all(
    uniqueIds.map((id) => getAuthUserById(id, req)),
  );

  return new Map(
    facultyProfiles
      .filter(Boolean)
      .map((profile) => [String(profile._id || profile.id), profile]),
  );
};

export const studentCanAccessTest = async (test, req) => {
  if (!isStudentRole(req.user?.role)) {
    return true;
  }

  const [student, creator] = await Promise.all([
    getCurrentAudienceUser(req),
    getAuthUserById(test?.creatorId, req),
  ]);

  return audienceMatches(student, creator);
};
