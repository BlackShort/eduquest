
import { Link } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { dummyAssignments, dummyCoding, dummyMcqs } from "@/data/dummy-data";

// Mock assessment data with status and dates
const mockAssessments = [
    // Current/Live Assessments
    {
        _id: "assess_001",
        test_id: dummyAssignments[0].test_id,
        title: "Data Structures Theory Assessment",
        type: "assignment",
        subject: dummyAssignments[0].subject_id,
        num_questions: dummyAssignments[0].num_questions,
        duration: 60,
        status: "live",
        startTime: "2026-02-16T14:00:00",
        endTime: "2026-02-16T18:00:00",
        totalMarks: 50,
        attempted: false,
    },
    {
        _id: "assess_002",
        test_id: dummyCoding[0].test_id,
        title: "Programming Fundamentals - Coding Test",
        type: "coding",
        subject: dummyCoding[0].subject_id,
        num_questions: dummyCoding[0].num_questions,
        duration: 90,
        status: "live",
        startTime: "2026-02-16T10:00:00",
        endTime: "2026-02-16T20:00:00",
        totalMarks: 100,
        attempted: true,
        progress: 67,
    },
    {
        _id: "assess_003",
        test_id: dummyMcqs[0].test_id,
        title: "Object-Oriented Programming MCQ",
        type: "mcq",
        subject: dummyMcqs[0].subject_id,
        num_questions: dummyMcqs[0].num_questions,
        duration: 30,
        status: "live",
        startTime: "2026-02-16T09:00:00",
        endTime: "2026-02-16T23:59:00",
        totalMarks: 30,
        attempted: false,
    },

    // // Upcoming Assessments
    {
        _id: "assess_004",
        test_id: dummyAssignments[1].test_id,
        title: "Algorithms Analysis Assignment",
        type: "assignment",
        subject: dummyAssignments[1].subject_id,
        num_questions: dummyAssignments[1].num_questions,
        duration: 120,
        status: "upcoming",
        startTime: "2026-02-18T10:00:00",
        endTime: "2026-02-18T16:00:00",
        totalMarks: 75,
        attempted: false,
    },
    {
        _id: "assess_005",
        test_id: dummyCoding[1].test_id,
        title: "Advanced Data Structures Coding",
        type: "coding",
        subject: dummyCoding[1].subject_id,
        num_questions: dummyCoding[1].num_questions,
        duration: 120,
        status: "upcoming",
        startTime: "2026-02-20T14:00:00",
        endTime: "2026-02-20T18:00:00",
        totalMarks: 100,
        attempted: false,
    },
    {
        _id: "assess_006",
        test_id: dummyMcqs[1].test_id,
        title: "Database Management Systems MCQ",
        type: "mcq",
        subject: dummyMcqs[1].subject_id,
        num_questions: dummyMcqs[1].num_questions,
        duration: 45,
        status: "upcoming",
        startTime: "2026-02-19T15:00:00",
        endTime: "2026-02-19T17:00:00",
        totalMarks: 50,
        attempted: false,
    },

    // // History (Completed)
    {
        _id: "assess_007",
        test_id: dummyAssignments[2].test_id,
        title: "Software Engineering Principles",
        type: "assignment",
        subject: dummyAssignments[2].subject_id,
        num_questions: dummyAssignments[2].num_questions,
        duration: 90,
        status: "completed",
        startTime: "2026-02-10T10:00:00",
        endTime: "2026-02-10T14:00:00",
        totalMarks: 60,
        attempted: true,
        score: 52,
        percentage: 86.67,
        submittedAt: "2026-02-10T12:45:00",
    },
    {
        _id: "assess_008",
        test_id: dummyCoding[1].test_id,
        title: "Array and String Manipulation",
        type: "coding",
        subject: dummyCoding[1].subject_id,
        num_questions: dummyCoding[1].num_questions,
        duration: 60,
        status: "completed",
        startTime: "2026-02-12T14:00:00",
        endTime: "2026-02-12T16:00:00",
        totalMarks: 80,
        attempted: true,
        score: 68,
        percentage: 85,
        submittedAt: "2026-02-12T15:42:00",
    },
    {
        _id: "assess_009",
        test_id: dummyMcqs[2].test_id,
        title: "Computer Networks Fundamentals",
        type: "mcq",
        subject: dummyMcqs[2].subject_id,
        num_questions: dummyMcqs[2].num_questions,
        duration: 30,
        status: "completed",
        startTime: "2026-02-14T11:00:00",
        endTime: "2026-02-14T12:00:00",
        totalMarks: 30,
        attempted: true,
        score: 27,
        percentage: 90,
        submittedAt: "2026-02-14T11:28:00",
    },
    {
        _id: "assess_010",
        test_id: "test_code_old_001",
        title: "Recursion and Backtracking",
        type: "coding",
        subject: "sub_cs101",
        num_questions: 4,
        duration: 90,
        status: "completed",
        startTime: "2026-02-08T10:00:00",
        endTime: "2026-02-08T13:00:00",
        totalMarks: 100,
        attempted: true,
        score: 75,
        percentage: 75,
        submittedAt: "2026-02-08T12:15:00",
    },
];

interface AssessmentCardProps {
    assessment: typeof mockAssessments[0];
}

const AssessmentCard = ({ assessment }: AssessmentCardProps) => {
    const getTypeIcon = () => {
        switch (assessment.type) {
            case "coding":
                return <Code2 className="w-5 h-5" />;
            case "mcq":
                return <CheckCircle2 className="w-5 h-5" />;
            case "assignment":
                return <FileText className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    const getTypeColor = () => {
        switch (assessment.type) {
            case "coding":
                return "blue";
            case "mcq":
                return "green";
            case "assignment":
                return "purple";
            default:
                return "gray";
        }
    };

    const color = getTypeColor();
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTimeRemaining = () => {
        const now = new Date();
        const end = new Date(assessment.endTime);
        const diff = end.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) return `${hours}h ${minutes}m remaining`;
        if (minutes > 0) return `${minutes}m remaining`;
        return "Ending soon";
    };

    return (
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-orange-500/50 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                    <div
                        className={`w-12 h-12 bg-${color}-900/30 rounded-lg flex items-center justify-center shrink-0 text-${color}-400`}
                    >
                        {getTypeIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                            {assessment.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {assessment.subject} • {assessment.num_questions} Questions
                        </p>
                    </div>
                </div>

                {/* Type Badge */}
                <span
                    className={`text-xs font-medium px-3 py-1 rounded-full bg-${color}-900/30 text-${color}-400 capitalize`}
                >
                    {assessment.type}
                </span>
            </div>

            {/* Assessment Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Timer className="w-4 h-4" />
                    <span>{assessment.duration} mins</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Award className="w-4 h-4" />
                    <span>{assessment.totalMarks} marks</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(assessment.startTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(assessment.endTime)}</span>
                </div>
            </div>

            {/* Status-specific content */}
            {assessment.status === "live" && (
                <div className="mb-4">
                    {assessment.attempted && assessment.progress ? (
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-white font-medium">{assessment.progress}%</span>
                            </div>
                            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-orange-500 rounded-full transition-all"
                                    style={{ width: `${assessment.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-orange-400 bg-orange-900/20 px-3 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span>{getTimeRemaining()}</span>
                        </div>
                    )}
                </div>
            )}

            {assessment.status === "completed" && assessment.score !== undefined && (
                <div className="mb-4 p-4 bg-neutral-700 rounded-lg border border-neutral-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Your Score</p>
                            <p className="text-2xl font-bold text-white">
                                {assessment.score}/{assessment.totalMarks}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400 mb-1">Percentage</p>
                            <p
                                className={`text-2xl font-bold ${assessment.percentage! >= 80
                                        ? "text-green-400"
                                        : assessment.percentage! >= 60
                                            ? "text-yellow-400"
                                            : "text-red-400"
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
                className={`block w-full px-4 py-3 rounded-lg font-medium text-center transition-colors ${assessment.status === "live"
                        ? assessment.attempted
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        : assessment.status === "upcoming"
                            ? "bg-neutral-700 text-gray-400 border border-neutral-600 cursor-not-allowed"
                            : "bg-neutral-700 text-white hover:bg-neutral-600 border border-neutral-600"
                    }`}
            >
                {assessment.status === "live" ? (
                    <div className="flex items-center justify-center gap-2">
                        {assessment.attempted ? (
                            <>
                                <PlayCircle className="w-5 h-5" />
                                Resume Assessment
                            </>
                        ) : (
                            <>
                                <PlayCircle className="w-5 h-5" />
                                Start Assessment
                            </>
                        )}
                    </div>
                ) : assessment.status === "upcoming" ? (
                    <div className="flex items-center justify-center gap-2">
                        <Clock className="w-5 h-5" />
                        Starts {formatDate(assessment.startTime)}
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <Eye className="w-5 h-5" />
                        View Results
                    </div>
                )}
            </Link>
        </div>
    );
};

export const AssessmentHome = () => {
    const currentAssessments = mockAssessments.filter((a) => a.status === "live");
    const upcomingAssessments = mockAssessments.filter((a) => a.status === "upcoming");
    const completedAssessments = mockAssessments.filter((a) => a.status === "completed");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-linear-to-br from-purple-500 to-pink-500 rounded-xl p-8 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Assessments</h1>
                        <p className="text-purple-100 text-lg">
                            Track your tests, assignments, and coding challenges
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Users className="w-5 h-5" />
                        <span className="font-bold">{completedAssessments.length} Completed</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <PlayCircle className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Active</p>
                            <p className="text-2xl font-bold text-white">{currentAssessments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Upcoming</p>
                            <p className="text-2xl font-bold text-white">{upcomingAssessments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Completed</p>
                            <p className="text-2xl font-bold text-white">{completedAssessments.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="current" className="w-full">
                <TabsList className="w-full bg-neutral-800 border border-neutral-700 p-1">
                    <TabsTrigger value="current" className="flex-1 data-[state=active]:text-neutral-100 text-neutral-400 hover:text-neutral-300 data-[state=active]:bg-orange-500">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Current ({currentAssessments.length})
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="flex-1 data-[state=active]:text-neutral-100 text-neutral-400 hover:text-neutral-300 data-[state=active]:bg-orange-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Upcoming ({upcomingAssessments.length})
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex-1 data-[state=active]:text-neutral-100 text-neutral-400 hover:text-neutral-300 data-[state=active]:bg-orange-500">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        History ({completedAssessments.length})
                    </TabsTrigger>
                </TabsList>

                {/* Current Tab */}
                <TabsContent value="current" className="mt-6">
                    {currentAssessments.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {currentAssessments.map((assessment) => (
                                <AssessmentCard key={assessment._id} assessment={assessment} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-neutral-800 rounded-lg p-12 border border-neutral-700 text-center">
                            <PlayCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Active Assessments</h3>
                            <p className="text-gray-400">You don't have any live assessments at the moment.</p>
                        </div>
                    )}
                </TabsContent>

                {/* Upcoming Tab */}
                <TabsContent value="upcoming" className="mt-6">
                    {upcomingAssessments.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {upcomingAssessments.map((assessment) => (
                                <AssessmentCard key={assessment._id} assessment={assessment} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-neutral-800 rounded-lg p-12 border border-neutral-700 text-center">
                            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Assessments</h3>
                            <p className="text-gray-400">You're all caught up! Check back later for new assessments.</p>
                        </div>
                    )}
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="mt-6">
                    {completedAssessments.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {completedAssessments.map((assessment) => (
                                <AssessmentCard key={assessment._id} assessment={assessment} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-neutral-800 rounded-lg p-12 border border-neutral-700 text-center">
                            <CheckCircle2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Completed Assessments</h3>
                            <p className="text-gray-400">Your completed assessments will appear here.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};
