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
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await verifyToken();

        setUser(data.user);
        setDashboardPath(getDashboardPath(data.user?.role));
        setUserID(data.user?._id ?? null);
        setIsLoggedIn(true);
      } catch {
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
    } else {
      setDashboardPath('/auth/login');
    }
  }, [user]);

  return (
    <ContextAPI.Provider value={{
      user, setUser,
      isOnline, setIsOnline,
      userID, setUserID,
      isLoggedIn, setIsLoggedIn,
      appLoading, setAppLoading,
      isLoggingOut, setIsLoggingOut,
      dashboardPath,
      sidebarOpen,
      toggleSidebar,
      setSidebarOpen
    }}>
      {children}
    </ContextAPI.Provider>
  )
}