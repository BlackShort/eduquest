import { RoleBasedRoute } from "@/components/site/role-based-route";

export const StudentRoleRoute = () => <RoleBasedRoute allowedRoles={["user", "student"]} />;