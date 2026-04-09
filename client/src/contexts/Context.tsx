import { createContext, useEffect, useState, type ReactNode } from "react";
import { verifyToken } from "@/apis/auth-api";

interface User {
  _id?: string;
  [key: string]: unknown;
}

interface ContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isOnline: boolean;
  setIsOnline: React.Dispatch<React.SetStateAction<boolean>>;
  userID: null | string | number;
  setUserID: React.Dispatch<React.SetStateAction<null | string | number>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  appLoading: boolean;
}

const ContextAPI = createContext<ContextType | undefined>(undefined);

const ContextApp = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({});
  const [isOnline, setIsOnline] = useState(true);
  const [userID, setUserID] = useState<null | string | number>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await verifyToken();

        setUser(data.user);
        setUserID(data.user?._id ?? null);
        setIsLoggedIn(true);
      } catch {
        setUser({});
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
    }}>
      {children}
    </ContextAPI.Provider>
  )
}

export { ContextApp, ContextAPI };