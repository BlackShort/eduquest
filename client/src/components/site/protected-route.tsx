import { Navigate, Outlet } from "react-router";
import { useContextAPI } from "@/hooks/useContext";
import { useEffect, useState } from "react";
import { verifyToken } from "@/apis/auth-api";
import { Loader } from "@/components/site/loader";

export const ProtectedRoute = () => {
    const { setIsLoggedIn, setUser } = useContextAPI();
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await verifyToken();
                setUser(data.user);
                setIsLoggedIn(true);
                setAllowed(true);
            } catch {
                setIsLoggedIn(false);
                setAllowed(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [setIsLoggedIn, setUser]);

    if (loading) {
        return <Loader />;
    }

    return allowed ? <Outlet /> : <Navigate to="/auth/login" replace />;
};