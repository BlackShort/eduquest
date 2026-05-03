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
    AlertCircle,
    Pause,
    Play,
} from "lucide-react";
// import { dummyAssignments, dummyCoding, dummyMcqs } from "@/data/dummy-data";


// Mock assessment data with status and dates
// const mockAssessments = [
//     // Current/Live Assessments
//     {
//         _id: "assess_001",
//         test_id: dummyAssignments[0].test_id,
//         title: "Data Structures Theory Assessment",
//         type: "assignment",
//         subject: dummyAssignments[0].subject_id,
//         num_questions: dummyAssignments[0].num_questions,
//         duration: 60,
//         status: "live",
//         startTime: "2026-02-16T14:00:00",
//         endTime: "2026-02-16T18:00:00",
//         totalMarks: 50,
//         attempted: false,
//     },
//     {
//         _id: "assess_002",
//         test_id: dummyCoding[0].test_id,
//         title: "Programming Fundamentals - Coding Test",
//         type: "coding",
//         subject: dummyCoding[0].subject_id,
//         num_questions: dummyCoding[0].num_questions,
//         duration: 90,
//         status: "live",
//         startTime: "2026-02-16T10:00:00",
//         endTime: "2026-02-16T20:00:00",
//         totalMarks: 100,
//         attempted: true,
//         progress: 67,
//     },
//     {
//         _id: "assess_003",
//         test_id: dummyMcqs[0].test_id,
//         title: "Object-Oriented Programming MCQ",
//         type: "mcq",
//         subject: dummyMcqs[0].subject_id,
//         num_questions: dummyMcqs[0].num_questions,
//         duration: 30,
//         status: "live",
//         startTime: "2026-02-16T09:00:00",
//         endTime: "2026-02-16T23:59:00",
//         totalMarks: 30,
//         attempted: false,
//     },

//     // // Upcoming Assessments
//     {
//         _id: "assess_004",
//         test_id: dummyAssignments[1].test_id,
//         title: "Algorithms Analysis Assignment",
//         type: "assignment",
//         subject: dummyAssignments[1].subject_id,
//         num_questions: dummyAssignments[1].num_questions,
//         duration: 120,
//         status: "upcoming",
//         startTime: "2026-02-18T10:00:00",
//         endTime: "2026-02-18T16:00:00",
//         totalMarks: 75,
//         attempted: false,
//     },
//     {
//         _id: "assess_005",
//         test_id: dummyCoding[1].test_id,
//         title: "Advanced Data Structures Coding",
//         type: "coding",
//         subject: dummyCoding[1].subject_id,
//         num_questions: dummyCoding[1].num_questions,
//         duration: 120,
//         status: "upcoming",
//         startTime: "2026-02-20T14:00:00",
//         endTime: "2026-02-20T18:00:00",
//         totalMarks: 100,
//         attempted: false,
//     },
//     {
//         _id: "assess_006",
//         test_id: dummyMcqs[1].test_id,
//         title: "Database Management Systems MCQ",
//         type: "mcq",
//         subject: dummyMcqs[1].subject_id,
//         num_questions: dummyMcqs[1].num_questions,
//         duration: 45,
//         status: "upcoming",
//         startTime: "2026-02-19T15:00:00",
//         endTime: "2026-02-19T17:00:00",
//         totalMarks: 50,
//         attempted: false,
//     },

//     // // History (Completed)
//     {
//         _id: "assess_007",
//         test_id: dummyAssignments[2].test_id,
//         title: "Software Engineering Principles",
//         type: "assignment",
//         subject: dummyAssignments[2].subject_id,
//         num_questions: dummyAssignments[2].num_questions,
//         duration: 90,
//         status: "completed",
//         startTime: "2026-02-10T10:00:00",
//         endTime: "2026-02-10T14:00:00",
//         totalMarks: 60,
//         attempted: true,
//         score: 52,
//         percentage: 86.67,
//         submittedAt: "2026-02-10T12:45:00",
//     },
//     {
//         _id: "assess_008",
//         test_id: dummyCoding[1].test_id,
//         title: "Array and String Manipulation",
//         type: "coding",
//         subject: dummyCoding[1].subject_id,
//         num_questions: dummyCoding[1].num_questions,
//         duration: 60,
//         status: "completed",
//         startTime: "2026-02-12T14:00:00",
//         endTime: "2026-02-12T16:00:00",
//         totalMarks: 80,
//         attempted: true,
//         score: 68,
//         percentage: 85,
//         submittedAt: "2026-02-12T15:42:00",
//     },
//     {
//         _id: "assess_009",
//         test_id: dummyMcqs[2].test_id,
//         title: "Computer Networks Fundamentals",
//         type: "mcq",
//         subject: dummyMcqs[2].subject_id,
//         num_questions: dummyMcqs[2].num_questions,
//         duration: 30,
//         status: "completed",
//         startTime: "2026-02-14T11:00:00",
//         endTime: "2026-02-14T12:00:00",
//         totalMarks: 30,
//         attempted: true,
//         score: 27,
//         percentage: 90,
//         submittedAt: "2026-02-14T11:28:00",
//     },
//     {
//         _id: "assess_010",
//         test_id: "test_code_old_001",
//         title: "Recursion and Backtracking",
//         type: "coding",
//         subject: "sub_cs101",
//         num_questions: 4,
//         duration: 90,
//         status: "completed",
//         startTime: "2026-02-08T10:00:00",
//         endTime: "2026-02-08T13:00:00",
//         totalMarks: 100,
//         attempted: true,
//         score: 75,
//         percentage: 75,
//         submittedAt: "2026-02-08T12:15:00",
//     },
// ];

type TestType = {
  _id: string;
  title: string;
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
    const assignmentCount = test.questionRefs?.assignmentIds?.length ?? 0;

  const totalQuestions =
    (test.questionRefs?.mcqIds?.length || 0) +
    (test.questionRefs?.codingIds?.length || 0) +
    (test.questionRefs?.assignmentIds?.length || 0);

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
    if (now >= new Date(test.scheduledStart) && now <= new Date(test.scheduledEnd)) {
      status = "live";
    } else if (now > new Date(test.scheduledEnd)) {
      status = "completed";
    }
  }

  

  return {
    _id: test._id,
    title: test.title,
    type:
  codingCount > 0
    ? "coding"
    : assignmentCount > 0
    ? "assignment"
    : "mcq",
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
  };
};

type AssessmentType = ReturnType<typeof mapTestToAssessment>;

const AssessmentCard = ({ assessment }: AssessmentCardProps) => {
    const getTypeStyles = () => {
        switch (assessment.type) {
            case "coding":
                return {
                    icon: <Code2 className="w-6 h-6" />,
                    color: "text-blue-400",
                    glow: "bg-blue-500/10",
                    hoverGlow: "group-hover:bg-blue-500/20",
                    badge: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                    bar: "from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                };
            case "mcq":
                return {
                    icon: <CheckCircle2 className="w-6 h-6" />,
                    color: "text-emerald-400",
                    glow: "bg-emerald-500/10",
                    hoverGlow: "group-hover:bg-emerald-500/20",
                    badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                    bar: "from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                };
            case "assignment":
                return {
                    icon: <FileText className="w-6 h-6" />,
                    color: "text-purple-400",
                    glow: "bg-purple-500/10",
                    hoverGlow: "group-hover:bg-purple-500/20",
                    badge: "bg-purple-500/10 border-purple-500/20 text-purple-400",
                    bar: "from-purple-600 to-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]"
                };
            default:
                return {
                    icon: <FileText className="w-6 h-6" />,
                    color: "text-gray-400",
                    glow: "bg-gray-500/10",
                    hoverGlow: "group-hover:bg-gray-500/20",
                    badge: "bg-gray-500/10 border-gray-500/20 text-gray-400",
                    bar: "from-gray-600 to-gray-400"
                };
        }
    };

    const styles = getTypeStyles();

    // const formatDate = (dateStr: string) => {
    //     return new Date(dateStr).toLocaleString("en-US", {
    //         month: "short",
    //         day: "numeric",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //     });
    // };

    const getTimeRemaining = () => {
        const now = new Date();
        const end = new Date(assessment.endTime || "");
        const diff = end.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) return `${hours}h ${minutes}m remaining`;
        if (minutes > 0) return `${minutes}m remaining`;
        return "Ending soon";
    };

    return (
        <div className={`group relative bg-white/2 rounded-2xl p-6 border border-white/5 overflow-hidden hover:bg-white/2 transition-all duration-500`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${styles.glow} rounded-full blur-[50px] pointer-events-none ${styles.hoverGlow} transition-all duration-500`}></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-white/3 border border-white/10 rounded-lg flex items-center justify-center shrink-0 shadow-lg ${styles.color} group-hover:scale-110 transition-transform duration-500`}>
                            {styles.icon}
                        </div>
                        <div className="mt-1">
                            <h3 className={`text-xl font-semibold text-white mb-1 transition-colors tracking-tight`}>
                                {assessment.title}
                            </h3>
                            <p className="text-sm text-neutral-400 font-medium">
                                {assessment.subject} <span className="mx-2 opacity-50">•</span> {assessment.num_questions} Questions
                            </p>
                        </div>
                    </div>
                    {/* Badge */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles.badge} capitalize whitespace-nowrap`}>
                        {assessment.type}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-white/2 border border-white/5">
                    <div className="flex items-center gap-3 text-sm text-neutral-300">
                        <Timer className="w-4 h-4 text-neutral-500" />
                        <span className="font-medium">{assessment.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-300">
                        <Award className="w-4 h-4 text-neutral-500" />
                        <span className="font-medium">{assessment.totalMarks} marks</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-300">
                        <Calendar className="w-4 h-4 text-neutral-500" />
                        <span className="font-medium truncate">{formatDate(assessment.startTime || "")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-300">
                        <Clock className="w-4 h-4 text-neutral-500" />
                        <span className="font-medium truncate">{formatDate(assessment.startTime || "")}</span>
                    </div>
                </div>

                {/* Status-specific content */}
                {assessment.status === "live" && (
                    <div className="mb-6">
                        {assessment.attempted && assessment.progress ? (
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-neutral-400 font-medium">Progress</span>
                                    <span className="text-white font-medium">{assessment.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-neutral-800/80 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full bg-linear-to-r ${styles.bar} rounded-full transition-all duration-1000 relative`}
                                        style={{ width: `${assessment.progress}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-2.5 rounded-lg font-medium">
                                <AlertCircle className="w-4 h-4" />
                                <span>{getTimeRemaining()}</span>
                            </div>
                        )}
                    </div>
                )}

                {assessment.status === "completed" && assessment.score !== undefined && (
                    <div className="mb-6 p-4 bg-white/2 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1 font-medium">Your Score</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-2xl font-bold text-white tracking-tighter">
                                        {assessment.score}
                                    </p>
                                    <span className="text-neutral-500 text-sm">/{assessment.totalMarks}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-neutral-400 mb-1 font-medium">Percentage</p>
                                <p
                                    className={`text-2xl font-bold tracking-tighter ${assessment.percentage! >= 80
                                        ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                                        : assessment.percentage! >= 60
                                            ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]"
                                            : "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]"
                                        }`}
                                >
                                    {assessment.percentage}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    to={`/assessment/${assessment._id}`}
                    className={`flex items-center justify-center gap-2 w-full px-3 py-3 rounded-lg font-medium text-center transition-all duration-300 
                        bg-white/5 text-neutral-100 hover:bg-white/10 border border-white/10 active:scale-[0.98]`}
                >
                    {assessment.status === "live" ? (
                        <>
                            {assessment.attempted ? (
                                <>
                                    <Pause className="w-4 h-4 text-neutral-300" />
                                    Resume Assessment
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 text-neutral-300" />
                                    Start Assessment
                                </>
                            )}
                        </>
                    ) : assessment.status === "upcoming" ? (
                        <>
                            <Clock className="w-5 h-5" />
                            Starts {formatDate(assessment.startTime)}
                        </>
                    ) : (
                        <>
                            <Eye className="w-5 h-5" />
                            View Results
                        </>
                    )}
                </Link>
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


  // show everything
const assessments = tests.map(mapTestToAssessment);

  const currentAssessments = assessments.filter((a) => a.status === "live");
  const upcomingAssessments = assessments.filter((a) => a.status === "upcoming");
  const completedAssessments = assessments.filter((a) => a.status === "completed");
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
                        <span className="font-semibold text-purple-50 tracking-wide">{completedAssessments.length} Completed</span>
                    </div>
                </div>
            </div>

            {/* Command Stats Bar */}
            <div className="bg-white/2 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[80px] pointer-events-none mix-blend-overlay"></div>

                <div className="flex-1 p-6 group hover:bg-white/1 transition-colors relative">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">Active</p>
                        <PlayCircle className="w-5 h-5 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-light text-white tracking-tighter">{currentAssessments.length}</h3>
                    </div>
                </div>

                <div className="flex-1 p-6 group hover:bg-white/1 transition-colors relative">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">Upcoming</p>
                        <Calendar className="w-5 h-5 text-purple-400/50 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-light text-white tracking-tighter">{upcomingAssessments.length}</h3>
                    </div>
                </div>

                <div className="flex-1 p-6 group hover:bg-white/1 transition-colors relative">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">Completed</p>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400/50 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-light text-white tracking-tighter">{completedAssessments.length}</h3>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="current" className="w-full space-y-8">
                <TabsList className="bg-neutral-100/1 border border-white/5 p-1 rounded-full inline-flex gap-2 max-w-max h-full">
                    <TabsTrigger value="current" className="cursor-pointer h-full rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg text-neutral-400 hover:text-neutral-300 transition-all font-normal tracking-wide">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Current ({currentAssessments.length})
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="cursor-pointer h-full rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg text-neutral-400 hover:text-neutral-300 transition-all font-normal tracking-wide">
                        <Calendar className="w-4 h-4 mr-2" />
                        Upcoming ({upcomingAssessments.length})
                    </TabsTrigger>
                    <TabsTrigger value="history" className="cursor-pointer h-full rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg text-neutral-400 hover:text-neutral-300 transition-all font-normal tracking-wide">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        History ({completedAssessments.length})
                    </TabsTrigger>
                </TabsList>

                {/* Current Tab */}
                <TabsContent value="current" className="mt-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                    {currentAssessments.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {currentAssessments.map((assessment) => (
                                <AssessmentCard key={assessment._id} assessment={assessment} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#09090b] rounded-3xl p-16 border border-white/5 text-center shadow-2xl relative overflow-hidden">
                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl shadow-black/50 relative z-10 backdrop-blur-xl">
                                <PlayCircle className="w-10 h-10 text-neutral-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight relative z-10">No Active Assessments</h3>
                            <p className="text-neutral-400 max-w-md mx-auto relative z-10">You don't have any live assessments at the moment. Take a break or explore upcoming challenges.</p>
                        </div>
                    )}
                </TabsContent>

                {/* Upcoming Tab */}
                <TabsContent value="upcoming" className="mt-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                    {upcomingAssessments.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {upcomingAssessments.map((assessment) => (
                                <AssessmentCard key={assessment._id} assessment={assessment} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#09090b] rounded-3xl p-16 border border-white/5 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dhe1ygeid/image/upload/v1714495861/grid_m4tnsi.svg')] opacity-[0.03] bg-repeat bg-size-[32px_32px]"></div>
                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl shadow-black/50 relative z-10 backdrop-blur-xl">
                                <Calendar className="w-10 h-10 text-neutral-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight relative z-10">No Upcoming Assessments</h3>
                            <p className="text-neutral-400 max-w-md mx-auto relative z-10">You're all caught up! Check back later for new tests and assignments.</p>
                        </div>
                    )}
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="mt-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                    {completedAssessments.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {completedAssessments.map((assessment) => (
                                <AssessmentCard key={assessment._id} assessment={assessment} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#09090b] rounded-3xl p-16 border border-white/5 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dhe1ygeid/image/upload/v1714495861/grid_m4tnsi.svg')] opacity-[0.03] bg-repeat bg-size-[32px_32px]"></div>
                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl shadow-black/50 relative z-10 backdrop-blur-xl">
                                <CheckCircle2 className="w-10 h-10 text-neutral-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight relative z-10">No Completed Assessments</h3>
                            <p className="text-neutral-400 max-w-md mx-auto relative z-10">Your completed assessments and test history will appear here.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};
