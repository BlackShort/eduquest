import { AssessmentLayout } from "@/layouts";
import { AssessmentProvider } from "@/providers/assessment-provider";

export const AssessmentView = () => {
  return (
    <AssessmentProvider examId="assessment_2024" initialTime={3600}>
      <AssessmentLayout />
    </AssessmentProvider>
  );
};
