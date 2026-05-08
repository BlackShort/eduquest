import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllTests } from "../../apis/test-api";
import {
  Clock,
  Calendar,
  FileText,
  Code2,
  CheckCircle2,
  PlayCircle,
  Eye,
  Timer,
  Users,
  Award,
  Pause,
  Play,
} from "lucide-react";
import type { AssessmentAccessState } from "@/types/types";

type TestType = {
  _id: string;
  title: string;
  type: "assessment" | "assignment" | "contest";
  subjectId: string;
  durationMinutes: number;
  totalMarks?: number;
  status: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  questionRefs?: {
    mcqIds?: string[];
    codingIds?: string[];
    assignmentIds?: string[];
  };
  assessmentAccess?: AssessmentAccessState;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";

  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface AssessmentCardProps {
  assessment: AssessmentType;
}

const mapTestToAssessment = (test: TestType) => {
  const codingCount = test.questionRefs?.codingIds?.length ?? 0;
  const mcqCount = test.questionRefs?.mcqIds?.length ?? 0;

  const totalQuestions = mcqCount + codingCount;

  const now = new Date();

  let status = "upcoming";

  if (test.scheduledStart && test.scheduledEnd) {
    const start = new Date(test.scheduledStart);
    const end = new Date(test.scheduledEnd);

    if (now >= start && now <= end) {
      status = "live";
    } else if (now > end) {
      status = "completed";
    }
  }

  if (test.scheduledStart && test.scheduledEnd) {
    if (
      now >= new Date(test.scheduledStart) &&
      now <= new Date(test.scheduledEnd)
    ) {
      status = "live";
    } else if (now > new Date(test.scheduledEnd)) {
      status = "completed";
    }
  }

  return {
    _id: test._id,
    title: test.title,
    type: codingCount > 0 ? "coding" : "mcq",
    subject: test.subjectId,
    num_questions: totalQuestions,
    duration: test.durationMinutes,
    status,
    startTime: test.scheduledStart,
    endTime: test.scheduledEnd,
    totalMarks: test.totalMarks || 0,
    attempted: false,

    progress: 0,
    score: 0,
    percentage: 0,
    assessmentAccess: test.assessmentAccess,
  };
};

type AssessmentType = ReturnType<typeof mapTestToAssessment>;

const AssessmentCard = ({ assessment }: AssessmentCardProps) => {
  const isLocked = assessment.assessmentAccess?.isBlocked;
  const lockReason = assessment.assessmentAccess?.lockReason;
  const lockedLabel =
    lockReason === "time_over"
      ? "Time Limit Over"
      : "This assessment is already submitted";
  const totalQuestions =
    assessment.assessmentAccess?.totalQuestions || assessment.num_questions;
  const answeredQuestions = assessment.assessmentAccess?.answeredQuestions || 0;

  const getTypeStyles = () => {
    switch (assessment.type) {
      case "coding":
        return {
          icon: <Code2 className="w-4.5 h-4.5" />,
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-400",
          badge: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        };
      case "mcq":
        return {
          icon: <CheckCircle2 className="w-4.5 h-4.5" />,
          iconBg: "bg-emerald-500/10",
          iconColor: "text-emerald-400",
          badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        };
      case "assignment":
        return {
          icon: <FileText className="w-4.5 h-4.5" />,
          iconBg: "bg-purple-500/10",
          iconColor: "text-purple-400",
          badge: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        };
      default:
        return {
          icon: <FileText className="w-4.5 h-4.5" />,
          iconBg: "bg-neutral-500/10",
          iconColor: "text-neutral-400",
          badge: "bg-neutral-500/10 border-neutral-500/20 text-neutral-400",
        };
    }
  };

  const styles = getTypeStyles();

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(assessment.endTime || "");
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }

    if (minutes > 0) {
      return `${minutes}m remaining`;
    }

    return "Ending soon";
  };

  return (
    <div className="bg-white/2 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
      {/* Main Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center shrink-0 ${styles.iconColor}`}
            >
              {styles.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white leading-snug mb-0.5">
                {assessment.title}
              </h3>
              <p className="text-sm text-neutral-400">
                {assessment.subject}{" "}
                <span className="mx-1.5 opacity-40">·</span>{" "}
                {assessment.num_questions} Questions
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${styles.badge}`}
          >
            {assessment.type}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white/3 rounded-xl">
            <Timer className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <div>
              <p className="text-[10px] text-neutral-500 leading-none mb-1">
                Duration
              </p>
              <p className="text-sm font-medium text-neutral-200 leading-none">
                {assessment.duration} mins
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white/3 rounded-xl">
            <Award className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <div>
              <p className="text-[10px] text-neutral-500 leading-none mb-1">
                Marks
              </p>
              <p className="text-sm font-medium text-neutral-200 leading-none">
                {assessment.totalMarks} marks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white/3 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <div>
              <p className="text-[10px] text-neutral-500 leading-none mb-1">
                Starts
              </p>
              <p className="text-sm font-medium text-neutral-200 leading-none truncate">
                {formatDate(assessment.startTime || "")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white/3 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <div>
              <p className="text-[10px] text-neutral-500 leading-none mb-1">
                Ends
              </p>
              <p className="text-sm font-medium text-neutral-200 leading-none truncate">
                {formatDate(assessment.endTime || "")}
              </p>
            </div>
          </div>
        </div>

        {/* Status Content */}
        {assessment.status === "live" &&
          (assessment.attempted && assessment.progress ? (
            <div className="mb-1">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-neutral-400">Progress</span>
                <span className="text-neutral-200 font-medium">
                  {assessment.progress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-linear-to-r ${styles.iconBg} rounded-full transition-all duration-700`}
                  style={{ width: `${assessment.progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="text-xs font-semibold tracking-widest uppercase text-red-400">
                  Live
                </span>
              </div>
              <span className="text-xs text-neutral-500">
                {getTimeRemaining()}
              </span>
            </div>
          ))}

        {assessment.status === "completed" &&
          assessment.score !== undefined && (
            <div className="flex items-center justify-between px-4 py-3 bg-white/3 rounded-xl">
              <div>
                <p className="text-[10px] text-neutral-500 mb-1">Your Score</p>
                <p className="text-xl font-semibold text-white leading-none">
                  {assessment.score}
                  <span className="text-sm font-normal text-neutral-500 ml-1">
                    / {assessment.totalMarks}
                  </span>
                </p>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-right">
                <p className="text-[10px] text-neutral-500 mb-1">Percentage</p>
                <p
                  className={`text-xl font-semibold leading-none ${
                    assessment.percentage! >= 80
                      ? "text-emerald-400"
                      : assessment.percentage! >= 60
                        ? "text-blue-400"
                        : "text-red-400"
                  }`}
                >
                  {assessment.percentage}%
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Action Button */}
      <div className="border-t border-white/5 px-5 py-4">
        {isLocked ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-white/5 bg-white/3 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Result
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-100">
                {answeredQuestions}/{totalQuestions} questions submitted
              </p>
              <p className="mt-1 text-xs text-neutral-500">{lockedLabel}</p>
            </div>
            <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-neutral-400 bg-white/3 border border-white/5 cursor-not-allowed">
              {lockReason === "time_over" ? (
                <Clock className="w-4 h-4 text-neutral-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-neutral-500" />
              )}
              {lockReason === "time_over"
                ? "Time Limit Over"
                : "Assessment submitted"}
            </div>
          </div>
        ) : (
          <Link
            to={`/assessment/${assessment._id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-neutral-200 bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/15 transition-all duration-200 active:scale-[0.98]"
          >
            {assessment.status === "live" ? (
              assessment.attempted ? (
                <>
                  <Pause className="w-4 h-4 text-neutral-400" /> Resume
                  Assessment
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-neutral-400" /> Start Assessment
                </>
              )
            ) : assessment.status === "upcoming" ? (
              <>
                <Clock className="w-4 h-4 text-neutral-400" /> Starts{" "}
                {formatDate(assessment.startTime)}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-neutral-400" /> View Results
              </>
            )}
          </Link>
        )}
      </div>
    </div>
  );
};
export const AssessmentHome = () => {
  const [tests, setTests] = useState<TestType[]>([]);

  console.log("TESTS RAW:", tests);

  const fetchTests = useCallback(async () => {
    try {
      const res = await getAllTests();

      console.log("API RESPONSE:", res);

      const list = res.data?.data || [];

      setTests(list);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  }, []);

  useEffect(() => {
    fetchTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const assessments = tests
    .filter((test) => {
      const mcqCount = test.questionRefs?.mcqIds?.length ?? 0;
      const codingCount = test.questionRefs?.codingIds?.length ?? 0;

      return test.type === "assessment" && (mcqCount > 0 || codingCount > 0);
    })
    .map(mapTestToAssessment);

  const currentAssessments = assessments.filter((a) => a.status === "live");
  const upcomingAssessments = assessments.filter(
    (a) => a.status === "upcoming",
  );
  const completedAssessments = assessments.filter(
    (a) => a.status === "completed",
  );
  return (
    <div className="space-y-8 p-2 lg:p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-[#0F0F12] rounded-2xl p-6 border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold mb-1 text-neutral-100">
              Assessments
            </h1>
            <p className="text-neutral-400 text-lg font-light max-w-lg">
              Track your tests, assignments, and coding challenges
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/3 border border-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <Users className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            <span className="font-semibold text-purple-50 tracking-wide">
              {completedAssessments.length} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Command Stats Bar */}
      <div className="bg-white/2 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[80px] pointer-events-none mix-blend-overlay"></div>

        <div className="flex-1 p-6 group hover:bg-white/1 transition-colors relative">
          <div className="flex justify-between items-start mb-3">
            <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">
              Active
            </p>
            <PlayCircle className="w-5 h-5 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-light text-white tracking-tighter">
              {currentAssessments.length}
            </h3>
          </div>
        </div>

        <div className="flex-1 p-6 group hover:bg-white/1 transition-colors relative">
          <div className="flex justify-between items-start mb-3">
            <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">
              Upcoming
            </p>
            <Calendar className="w-5 h-5 text-purple-400/50 group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-light text-white tracking-tighter">
              {upcomingAssessments.length}
            </h3>
          </div>
        </div>

        <div className="flex-1 p-6 group hover:bg-white/1 transition-colors relative">
          <div className="flex justify-between items-start mb-3">
            <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">
              Completed
            </p>
            <CheckCircle2 className="w-5 h-5 text-emerald-400/50 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-light text-white tracking-tighter">
              {completedAssessments.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="current" className="w-full space-y-8">
        <TabsList className="bg-neutral-100/1 border border-white/5 p-1 rounded-full inline-flex gap-2 max-w-max h-full">
          <TabsTrigger
            value="current"
            className="cursor-pointer h-full rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg text-neutral-400 hover:text-neutral-300 transition-all font-normal tracking-wide"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Current ({currentAssessments.length})
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="cursor-pointer h-full rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg text-neutral-400 hover:text-neutral-300 transition-all font-normal tracking-wide"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming ({upcomingAssessments.length})
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="cursor-pointer h-full rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg text-neutral-400 hover:text-neutral-300 transition-all font-normal tracking-wide"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            History ({completedAssessments.length})
          </TabsTrigger>
        </TabsList>

        {/* Current Tab */}
        <TabsContent
          value="current"
          className="mt-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
        >
          {currentAssessments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentAssessments.map((assessment) => (
                <AssessmentCard key={assessment._id} assessment={assessment} />
              ))}
            </div>
          ) : (
            <div className="bg-white/2 rounded-3xl p-16 border border-white/5 text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 relative z-10 backdrop-blur-xl">
                <PlayCircle className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight relative z-10">
                No Active Assessments
              </h3>
              <p className="text-neutral-400 max-w-md mx-auto relative z-10">
                You don't have any live assessments at the moment. Take a break
                or explore upcoming challenges.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent
          value="upcoming"
          className="mt-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
        >
          {upcomingAssessments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingAssessments.map((assessment) => (
                <AssessmentCard key={assessment._id} assessment={assessment} />
              ))}
            </div>
          ) : (
            <div className="bg-white/2 rounded-3xl p-16 border border-white/5 text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 relative z-10 backdrop-blur-xl">
                <Calendar className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight relative z-10">
                No Upcoming Assessments
              </h3>
              <p className="text-neutral-400 max-w-md mx-auto relative z-10">
                You're all caught up! Check back later for new tests and
                assignments.
              </p>
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent
          value="history"
          className="mt-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
        >
          {completedAssessments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedAssessments.map((assessment) => (
                <AssessmentCard key={assessment._id} assessment={assessment} />
              ))}
            </div>
          ) : (
            <div className="bg-white/2 rounded-3xl p-16 border border-white/5 text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 relative z-10 backdrop-blur-xl">
                <CheckCircle2 className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight relative z-10">
                No Completed Assessments
              </h3>
              <p className="text-neutral-400 max-w-md mx-auto relative z-10">
                Your completed assessments and test history will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
