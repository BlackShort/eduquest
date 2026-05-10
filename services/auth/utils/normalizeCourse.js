export const normalizeCourses = (
    courses = []
) => {

    return courses.map((course) =>
        String(course)
            .toLowerCase()
            .replace(/\./g, "")
            .replace(/[^a-z0-9]/g, "")
            .trim()
    );

};