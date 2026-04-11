import { createContext } from "react";
import type { User } from "@/types/types";

export interface ContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isOnline: boolean;
  setIsOnline: React.Dispatch<React.SetStateAction<boolean>>;
  userID: null | string | number;
  setUserID: React.Dispatch<React.SetStateAction<null | string | number>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  appLoading: boolean;
  setAppLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dashboardPath: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContextAPI = createContext<ContextType | undefined>(undefined);
