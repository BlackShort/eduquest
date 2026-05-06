import { Outlet } from "react-router";
import { useContextAPI } from "@/hooks/useContext";
import { Loader } from "@/components/site/loader";

export const ProtectedRoute = () => {
    const { isLoggedIn, appLoading, isLoggingOut } = useContextAPI();

    if (appLoading || isLoggingOut) {
        return <Loader />;
    }

    if (isLoggedIn) {
        return <Outlet />;
    }

    return null;
};