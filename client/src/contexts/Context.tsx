import { createContext, useEffect, useState, type ReactNode } from "react";

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
}

const ContextAPI = createContext<ContextType | undefined>(undefined);

const ContextApp = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({});
  const [isOnline, setIsOnline] = useState(true);
  const [userID, setUserID] = useState<null | string | number>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <ContextAPI.Provider value={{
      user, setUser,
      isOnline, setIsOnline,
      userID, setUserID,
      isLoggedIn, setIsLoggedIn,
    }}>
      {children}
    </ContextAPI.Provider>
  )
}

export { ContextApp, ContextAPI };