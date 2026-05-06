import { createContext } from "react";
import type { User } from "@/types/types";


export interface Question {
  id: string;
  type: "coding" | "mcq";
  title: string;
  section: string;
}

export type Stage = "fullscreen" | "setup" | "instructions" | "exam";

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
  isLoggingOut: boolean;
  setIsLoggingOut: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface AssessmentContextType {
  // State
  stage: Stage;
  sidebarOpen: boolean;
  currentQuestionId: string;
  answers: Record<string, string>;
  isSubmitted: boolean;
  timeRemaining: number;
  isSettingsOpen: boolean;
  questions: Question[];

  // Stage setters
  setStage: (stage: Stage) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Question navigation
  setCurrentQuestionId: (id: string) => void;
  handleAnswerChange: (questionId: string, answer: string) => void;
  
  // Submission
  handleSubmitAssessment: () => void;
  setIsSubmitted: (submitted: boolean) => void;
  
  // Timer
  setTimeRemaining: (time: number) => void;
  decrementTimeRemaining: () => void;
  
  // Settings modal
  setIsSettingsOpen: (open: boolean) => void;
  
  // Navigation helpers
  getCurrentQuestion: () => Question | undefined;
  getMcqQuestions: () => Question[];
  getCurrentMcqIndex: () => number;
  showNext: () => boolean;
  showPrevious: () => boolean;
  handleNext: () => void;
  handlePrevious: () => void;
}

export const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const ContextAPI = createContext<ContextType | undefined>(undefined);
