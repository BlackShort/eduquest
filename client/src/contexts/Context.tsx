import { createContext, useEffect, useState, type ReactNode } from "react";
import { verifyToken } from "@/apis/auth-api";
import type { User } from "@/types/types";
import { getDashboardPath } from "@/lib/utils";

interface ContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isOnline: boolean;
  setIsOnline: React.Dispatch<React.SetStateAction<boolean>>;
  userID: null | string | number;
  setUserID: React.Dispatch<React.SetStateAction<null | string | number>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  appLoading: boolean;
  dashboardPath: string;
}

const ContextAPI = createContext<ContextType | undefined>(undefined);

const ContextApp = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [userID, setUserID] = useState<null | string | number>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [dashboardPath, setDashboardPath] = useState<string>("/auth/login");

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

  return (
    <ContextAPI.Provider value={{
      user, setUser,
      isOnline, setIsOnline,
      userID, setUserID,
      isLoggedIn, setIsLoggedIn,
      appLoading,
      dashboardPath
    }}>
      {children}
    </ContextAPI.Provider>
  )
}

export { ContextApp, ContextAPI };