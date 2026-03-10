import { Navigate, Outlet } from "react-router";
import { useContextAPI } from "@/hooks/useContext";

export const ProtectedRoute = () => {
    const { isLoggedIn } = useContextAPI();
    return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" replace />;
};
