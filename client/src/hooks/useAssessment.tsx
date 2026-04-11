import { AssessmentContext } from "@/contexts/AppContext";
import { useContext } from "react";

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};