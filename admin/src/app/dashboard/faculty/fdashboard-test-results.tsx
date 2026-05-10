import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Download,
  Search,
  Eye,
  CheckCircle,
  Clock,
  User,
  Award,
  TrendingUp,
  Filter,
} from "lucide-react";
import {
  getTestById,
  getTestAttempts,
  getTestAnalytics,
  exportTestResults,
} from "@/apis/faculty-api";
import { getStudentExamSessions } from "@/apis/proctor-api";
import type { Test, StudentAttempt, TestAnalytics } from "@/types/types";

export default function TestResultsPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [analytics, setAnalytics] = useState<TestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [testResponse, attemptsResponse, analyticsResponse] =
          await Promise.all([
            getTestById(testId!),
            getTestAttempts(testId!, {
              status: statusFilter !== "all" ? statusFilter : undefined,
            }),
            getTestAnalytics(testId!),
          ]);

        setTest(testResponse.data);
        setAttempts(attemptsResponse.data);
        setAnalytics(analyticsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchData();
    }
  }, [testId, statusFilter]);

  const handleExport = async () => {
    try {
      const blob = await exportTestResults(testId!, "excel");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${test?.title || "test"}-results.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting results:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-neutral-700 text-gray-800";
    }
  };

  const filteredAttempts = attempts
    .filter((attempt) => {
      if (!searchQuery) return true;
      const studentName =
        typeof attempt.studentId === "object"
          ? attempt.studentId.username || ""
          : "";
      return studentName.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const scoreDiff = (b.score?.percentage || 0) - (a.score?.percentage || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return (a.timeSpentMinutes || 0) - (b.timeSpentMinutes || 0);
    });
  const isAssignmentTest = test?.type === "assignment";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/faculty-dashboard/assessment")}
            className="p-2 bg-neutral-400 hover:bg-neutral-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">{test?.title}</h1>
            <p className="text-gray-400 mt-1">Test Results & Analytics</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Attempts"
          value={analytics?.totalAttempts || 0}
          icon={<User className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Submitted"
          value={analytics?.submitted || 0}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Average Score"
          value={`${analytics?.averageScore?.toFixed(1) || 0}%`}
          icon={<Award className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Avg Time Spent"
          value={`${analytics?.averageTimeSpent || 0} min`}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Score Distribution */}
      {(test?.type === "assessment" && analytics?.scoreDistribution) && (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Score Distribution
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(analytics.scoreDistribution).map(
              ([range, count]) => (
                <div key={range} className="text-center">
                  <div className="text-2xl font-bold text-gray-100">
                    {count}
                  </div>
                  <div className="text-sm text-gray-400">{range}%</div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="placeholder:text-gray-400 w-full pl-10 pr-4 py-2 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                {isAssignmentTest ? (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Assignment Score
                  </th>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      MCQ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Coding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Combined Score
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-800 divide-y divide-neutral-700">
              {filteredAttempts.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAssignmentTest ? 6 : 8}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No attempts found
                  </td>
                </tr>
              ) : (
                filteredAttempts.map((attempt) => (
                  <tr key={attempt._id} className="hover:bg-neutral-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-100">
                        {typeof attempt.studentId === "object"
                          ? attempt.studentId.username
                          : "Unknown"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {typeof attempt.studentId === "object"
                          ? attempt.studentId.email
                          : ""}
                      </div>
                      <ProctorBadge
                        student={attempt.studentId}
                        examId={testId}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(attempt.status)}`}
                      >
                        {attempt.status.replace("_", " ")}
                      </span>
                    </td>
                    {isAssignmentTest ? (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-100">
                          {(
                            attempt.scoreBreakdown?.assignment?.obtained ??
                            attempt.score.obtained ??
                            0
                          ).toFixed(1)}
                          /
                          {attempt.scoreBreakdown?.assignment?.total ||
                            attempt.score.total ||
                            0}
                        </div>
                        <div className="text-xs text-gray-400">
                          {attempt.score.percentage.toFixed(1)}%
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-100">
                            {(
                              attempt.scoreBreakdown?.mcq?.obtained || 0
                            ).toFixed(1)}
                            /{attempt.scoreBreakdown?.mcq?.total || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-100">
                            {(
                              attempt.scoreBreakdown?.coding?.obtained || 0
                            ).toFixed(1)}
                            /{attempt.scoreBreakdown?.coding?.total || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-100">
                            {attempt.score.obtained.toFixed(1)}/
                            {attempt.score.total}
                          </div>
                          <div className="text-xs text-gray-400">
                            {attempt.score.percentage.toFixed(1)}%
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {attempt.timeSpentMinutes} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {attempt.submittedAt
                        ? new Date(attempt.submittedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(`/faculty-dashboard/attempt/${attempt._id}`)
                        }
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <h4 className="text-sm font-medium text-green-900 mb-2">
            Highest Score
          </h4>
          <p className="text-2xl font-bold text-green-700">
            {analytics?.highestScore?.toFixed(1) || 0}%
          </p>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Lowest Score
          </h4>
          <p className="text-2xl font-bold text-blue-700">
            {analytics?.lowestScore?.toFixed(1) || 0}%
          </p>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Graded</h4>
          <p className="text-2xl font-bold text-purple-700">
            {analytics?.graded || 0} / {analytics?.totalAttempts || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
}

// Compact Proctor Badge (shows risk + total suspicion score)
function ProctorBadge({
  student,
  examId,
}: {
  student: any;
  examId?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [risk, setRisk] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!examId || !student) return;
      let studentId: string | undefined;
      if (typeof student === "object") {
        studentId = student._id || student.id || student.username;
      } else {
        studentId = student as string;
      }
      if (!studentId) return;

      try {
        setLoading(true);
        const res = await getStudentExamSessions(studentId, examId!);
        const sessions = res?.sessions || res || [];
        const total = (sessions || []).reduce(
          (acc: number, s: any) => acc + Number(s.suspicionScore || 0),
          0,
        );
        setScore(total);
        let r = "Clean";
        if (total === 0) r = "Clean";
        else if (total >= 1 && total <= 10) r = "Low";
        else if (total >= 11 && total <= 30) r = "Medium";
        else r = "High";
        setRisk(r);
      } catch (e) {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [student, examId]);

  if (!examId) return null;

  const bg =
    risk === "High"
      ? "bg-red-600"
      : risk === "Medium"
        ? "bg-yellow-600"
        : risk === "Low"
          ? "bg-blue-600"
          : "bg-neutral-700";

  return (
    <div className="mt-2 flex items-center gap-2">
      {loading ? (
        <div className="text-xs text-gray-400">Checking proctor...</div>
      ) : score === null ? (
        <div className="text-xs text-gray-400">No proctor data</div>
      ) : (
        <div className={`px-2 py-1 text-xs rounded-full text-white ${bg}`}>
          {risk} • {(score || 0).toFixed(1)}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-900/20 text-blue-600",
    green: "bg-green-900/20 text-green-600",
    purple: "bg-purple-900/20 text-purple-600",
    orange: "bg-orange-900/20 text-orange-600",
  };

  return (
    <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-100 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
