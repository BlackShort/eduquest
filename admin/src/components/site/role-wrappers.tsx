import { RoleBasedRoute } from "@/components/site/role-based-route";

export const StudentRoleRoute = () => <RoleBasedRoute allowedRoles={["user", "student"]} />;
export const FacultyRoleRoute = () => <RoleBasedRoute allowedRoles={["faculty"]} />;
export const AdminRoleRoute = () => <RoleBasedRoute allowedRoles={["admin"]} />;
