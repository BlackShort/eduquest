import { useEffect, useState, type ReactNode } from "react";
import { verifyToken } from "@/apis/auth-api";
import { getDashboardPath } from "@/lib/utils";
import { ContextAPI } from "@/contexts/AppContext";
import type { User } from "@/types/types";

export const ContextApp = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [userID, setUserID] = useState<null | string | number>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [dashboardPath, setDashboardPath] = useState<string>("/auth/login");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await verifyToken();
        console.log("verifyToken response:", data);

        setUser(data.user);
        setDashboardPath(getDashboardPath(data.user?.role));
        setUserID(data.user?.userId ?? null);
        setIsLoggedIn(true);
      } catch(err) {
        console.error("verifyToken failed:", err);
        setUser(null);
        setUserID(null);
        setIsLoggedIn(false);
      } finally {
        setAppLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      setDashboardPath(getDashboardPath(user.role));
    }
  }, [user]);

  return (
    <ContextAPI.Provider value={{
      user, setUser,
      isOnline, setIsOnline,
      userID, setUserID,
      isLoggedIn, setIsLoggedIn,
      appLoading, setAppLoading,
      dashboardPath,
      sidebarOpen,
      toggleSidebar,
      setSidebarOpen
    }}>
      {children}
    </ContextAPI.Provider>
  )
}