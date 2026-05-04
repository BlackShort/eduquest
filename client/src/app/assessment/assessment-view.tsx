import { useParams } from "react-router-dom";
import { AssessmentLayout } from "@/layouts";
import { AssessmentProvider } from "@/providers/assessment-provider";

export const AssessmentView = () => {
  const { assessmentId, id } = useParams();

  return (
    <AssessmentProvider examId={assessmentId || id || ""} initialTime={3600}>
      <AssessmentLayout />
    </AssessmentProvider>
  );
};
