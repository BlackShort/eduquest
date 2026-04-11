import { Navigate, Outlet } from "react-router";
import { useContextAPI } from "@/hooks/useContext";
import { Loader } from "@/components/site/loader";

interface RoleBasedRouteProps {
    allowedRoles: string[];
}

export const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
    const { user, isLoggedIn, appLoading } = useContextAPI();

    if (appLoading) {
        return <Loader />;
    }

    if (!isLoggedIn) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/not-found" replace />;
    }

    return <Outlet />;
};
