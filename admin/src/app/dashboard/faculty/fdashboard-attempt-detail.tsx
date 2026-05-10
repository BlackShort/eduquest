import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  FileText,
  Save,
  Send,
} from "lucide-react";
import {
  getAttemptAssignmentDownloadUrl,
  getAttemptById,
  gradeAttempt,
} from "@/apis/faculty-api";
import {
  getStudentExamSessions,
  getEnrollmentImageUrl,
} from "@/apis/proctor-api";
import type { StudentAttempt } from "@/types/types";

type ProctorSession = {
  sessionId?: string;
  suspicionScore?: number;
  violationCounts?: Record<string, number>;
  status?: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt?: string;
  id?: string;
  _id?: string;
};

export default function AttemptDetailPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<StudentAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openingPdf, setOpeningPdf] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [assignmentMarks, setAssignmentMarks] = useState(0);
  // Proctoring states
  const [proctorLoading, setProctorLoading] = useState<boolean>(false);
  const [proctorError, setProctorError] = useState<string | null>(null);
  const [proctorSessions, setProctorSessions] = useState<ProctorSession[] | null>(null);
  const [proctorAggregate, setProctorAggregate] = useState<Record<string, any> | null>(null);
  const [enrollmentImageUrl, setEnrollmentImageUrl] = useState<string | null>(null,);

  useEffect(() => {
    const fetchAttemptData = async () => {
      try {
        setLoading(true);
        const response = await getAttemptById(attemptId!);
        const attemptData = response.data;
        const normalizedAttempt = {
          ...attemptData,
          responses: {
            mcqResponses: attemptData.responses?.mcqResponses || [],
            codingSubmissionIds:
              attemptData.responses?.codingSubmissionIds || [],
            codingResponses: attemptData.responses?.codingResponses || [],
            assignmentFileUrl: attemptData.responses?.assignmentFileUrl || null,
            assignmentFile: attemptData.responses?.assignmentFile || null,
          },
          score: {
            obtained: attemptData.score?.obtained || 0,
            total: attemptData.score?.total || 0,
            percentage: attemptData.score?.percentage || 0,
          },
          scoreBreakdown: {
            mcq: attemptData.scoreBreakdown?.mcq || { obtained: 0, total: 0 },
            coding: attemptData.scoreBreakdown?.coding || {
              obtained: 0,
              total: 0,
            },
            assignment: attemptData.scoreBreakdown?.assignment || {
              obtained: 0,
              total: 0,
            },
          },
        };

        setAttempt(normalizedAttempt);
        setFeedback(attemptData.feedback || "");
        setAssignmentMarks(
          normalizedAttempt.scoreBreakdown.assignment.obtained || 0,
        );
      } catch (error) {
        console.error("Error fetching attempt:", error);
        alert("Failed to load attempt data");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchAttemptData();
    }
  }, [attemptId, navigate]);

  // Aggregation helper moved above effect to keep dependencies simple
  const aggregateProctorSessions = (sessions: ProctorSession[]) => {
    const agg: any = {
      sessionCount: sessions.length,
      totalSuspicionScore: 0,
      mergedViolationCounts: {} as Record<string, number>,
      totalViolations: 0,
      latestSessionStatus: null,
    };

    sessions.forEach((s) => {
      const score = Number(s.suspicionScore || 0);
      agg.totalSuspicionScore += score;

      const violationCounts = s.violationCounts || {};
      Object.keys(violationCounts).forEach((k) => {
        const v = Number(violationCounts[k] || 0);
        agg.mergedViolationCounts[k] = (agg.mergedViolationCounts[k] || 0) + v;
        agg.totalViolations += v;
      });

      if (s.updatedAt || s.completedAt || s.startedAt) {
        agg.latestSessionStatus = s.status || agg.latestSessionStatus;
      }
    });

    // risk level
    const score = agg.totalSuspicionScore;
    let risk = "Clean";
    if (score === 0) risk = "Clean";
    else if (score >= 1 && score <= 10) risk = "Low";
    else if (score >= 11 && score <= 20) risk = "Medium";
    else risk = "High";

    agg.riskLevel = risk;
    return agg;
  };

  // Fetch proctor sessions once attempt is loaded
  useEffect(() => {
    const fetchProctor = async () => {
      if (!attempt) return;

      // resolve ids
      let studentId: string | undefined;
      if (typeof attempt.studentId === "object") {
        const st = attempt.studentId as any;
        studentId = st._id || st.id || st.username;
      } else {
        studentId = attempt.studentId as unknown as string;
      }

      let examId: string | undefined;
      if (typeof attempt.testId === "object") {
        const t = attempt.testId as any;
        examId = t._id || t.id;
      } else {
        examId = attempt.testId as unknown as string;
      }

      if (!studentId || !examId) return;

      try {
        setProctorLoading(true);
        setProctorError(null);
        const res = await getStudentExamSessions(studentId, examId);
        const sessions: ProctorSession[] = res?.sessions || res || [];
        setProctorSessions(sessions);

        // aggregate
        const aggregate = aggregateProctorSessions(sessions || []);
        setProctorAggregate(aggregate);

        // fetch first enrollment image available using session.sessionId and passing examId
        let img: string | null = null;
        for (const s of sessions || []) {
          const sessionId = s.sessionId || s.id || s._id;
          if (!sessionId) continue;
          // prefer session.sessionId route param
          try {
            const r = await getEnrollmentImageUrl(sessionId, examId);
            if (r?.signedUrl) {
              img = r.signedUrl;
              break;
            }
            if (r?.url) {
              img = r.url;
              break;
            }
          } catch (e) {
            // image for this session not available - try next session
            continue;
          }
        }
        setEnrollmentImageUrl(img);
      } catch (error: any) {
        console.error("Failed to load proctor sessions:", error);
        setProctorError(error?.message || "Failed to load proctor data");
      } finally {
        setProctorLoading(false);
      }
    };

    fetchProctor();
  }, [attempt]);

  const handleSaveAssignmentGrade = async (submitToStudent = false) => {
    if (!attempt) return;

    try {
      setSaving(true);
      const mcqObtained = attempt.scoreBreakdown?.mcq?.obtained || 0;
      const codingObtained = attempt.scoreBreakdown?.coding?.obtained || 0;

      await gradeAttempt(attemptId!, {
        score: {
          obtained: mcqObtained + codingObtained + assignmentMarks,
          total: attempt.score.total || 0,
        },
        feedback,
      });

      alert(
        submitToStudent
          ? "Grade submitted successfully!"
          : "Grade saved as draft",
      );
      navigate(-1);
    } catch (error) {
      console.error("Error saving grade:", error);
      alert("Failed to save grade");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Attempt not found</p>
      </div>
    );
  }

  const studentName =
    typeof attempt.studentId === "object"
      ? attempt.studentId.username
      : "Unknown";
  const studentRecord =
    typeof attempt.studentId === "object" ? attempt.studentId : null;
  const studentReadableId =
    studentRecord?.studentId ||
    studentRecord?.email?.match(/\.([^.@]+)@gehu\.ac\.in$/i)?.[1] ||
    "N/A";
  const testTitle =
    typeof attempt.testId === "object" ? attempt.testId.title : "Unknown Test";
  const mcqBreakdown = attempt.scoreBreakdown?.mcq || { obtained: 0, total: 0 };
  const codingBreakdown = attempt.scoreBreakdown?.coding || {
    obtained: 0,
    total: 0,
  };
  const hasAssignmentFile = Boolean(attempt.responses?.assignmentFileUrl);
  const assignmentMaxMarks =
    attempt.scoreBreakdown?.assignment?.total || attempt.score.total || 0;

  const handleDownloadAssignment = async () => {
    if (!attemptId || openingPdf) return;

    try {
      setOpeningPdf(true);
      const response = await getAttemptAssignmentDownloadUrl(attemptId);
      const signedUrl =
        response.data?.signedUrl || attempt.responses?.assignmentFileUrl;

      if (signedUrl) {
        window.open(signedUrl, "_blank", "noopener,noreferrer");
      } else {
        alert("No downloadable PDF is available for this submission");
      }
    } catch (error) {
      console.error("Failed to load assignment PDF:", error);
      if (attempt.responses?.assignmentFileUrl) {
        window.open(
          attempt.responses.assignmentFileUrl,
          "_blank",
          "noopener,noreferrer",
        );
        return;
      }
      alert("Failed to load assignment PDF");
    } finally {
      setOpeningPdf(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-neutral-400 hover:bg-neutral-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">
              Submission Result
            </h1>
            <p className="text-gray-400 mt-1">{testTitle}</p>
          </div>
        </div>
        {hasAssignmentFile && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSaveAssignmentGrade(false)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-600 text-gray-300 rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              onClick={() => handleSaveAssignmentGrade(true)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Grade
            </button>
          </div>
        )}
      </div>

      {/* Student Information */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Student Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Student Name</p>
              <p className="font-semibold text-gray-100">{studentName}</p>
              <p className="text-sm text-gray-400">{studentReadableId}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Submitted At</p>
              <p className="font-semibold text-gray-100">
                {attempt.submittedAt
                  ? new Date(attempt.submittedAt).toLocaleString()
                  : "Not submitted"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Time Spent</p>
              <p className="font-semibold text-gray-100">
                {attempt.timeSpentMinutes} minutes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-900/20 rounded-lg">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Current Score</p>
              <p className="font-semibold text-gray-100">
                {attempt.score.obtained}/{attempt.score.total} (
                {attempt.score.percentage.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proctoring Summary */}
      {(proctorSessions && proctorSessions.length > 0) && (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Proctoring Summary
          </h2>

          {proctorLoading ? (
            <div className="text-gray-400">Loading proctor data...</div>
          ) : proctorError ? (
            <div className="text-sm text-red-400">{proctorError}</div>
          ) : !proctorSessions || proctorSessions.length === 0 ? (
            <div className="text-sm text-gray-400">
              No proctoring sessions found for this attempt.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-gray-400">Risk Level</p>
                  <p className="mt-1 font-semibold text-gray-100">
                    {proctorAggregate?.riskLevel}
                  </p>
                </div>
                <div className="p-4 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-gray-400">Total Suspicion Score</p>
                  <p className="mt-1 font-semibold text-gray-100">
                    {(proctorAggregate?.totalSuspicionScore || 0).toFixed(1)}
                  </p>
                </div>
                <div className="p-4 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-gray-400">Total Violations</p>
                  <p className="mt-1 font-semibold text-gray-100">
                    {proctorAggregate?.totalViolations || 0}
                  </p>
                </div>
                <div className="p-4 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-gray-400">Sessions</p>
                  <p className="mt-1 font-semibold text-gray-100">
                    {proctorAggregate?.sessionCount || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-neutral-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">
                    Violation Breakdown
                  </p>
                  <div className="space-y-2">
                    {Object.keys(proctorAggregate?.mergedViolationCounts || {})
                      .length === 0 && (
                        <p className="text-sm text-gray-400">
                          No violations recorded.
                        </p>
                      )}
                    {Object.entries(
                      proctorAggregate?.mergedViolationCounts || {},
                    ).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <p className="text-sm text-gray-200">
                          {k.replace("_", " ")}
                        </p>
                        <p className="text-sm font-semibold text-gray-100">
                          {Number(v)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-900 p-4 rounded-lg flex flex-col items-center">
                  <p className="text-sm text-gray-400 mb-2">Identity Snapshot</p>
                  {enrollmentImageUrl ? (
                    <div className="w-40 h-40 bg-neutral-800 rounded-md overflow-hidden flex items-center justify-center">
                      <img
                        src={enrollmentImageUrl}
                        alt="Enrollment Snapshot"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 bg-neutral-800 rounded-md flex items-center justify-center text-sm text-gray-500">
                      Not available
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Sessions</p>
                <div className="space-y-2">
                  {proctorSessions.map((s: ProctorSession) => (
                    <div
                      key={s._id || s.sessionId || s.id}
                      className="p-3 bg-neutral-900 rounded-lg border border-neutral-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">
                            Status: {s.status || "UNKNOWN"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Score: {s.suspicionScore || 0}
                          </p>
                        </div>
                        <div className="text-sm text-gray-200">
                          Violations:{" "}
                          {s.violationCounts
                            ? Object.values(s.violationCounts).reduce(
                              (a, b) => a + Number(b || 0),
                              0,
                            )
                            : 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>)}

      {(attempt.gradedAt) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-5">
            <p className="text-sm text-gray-400">MCQ Marks</p>
            <p className="mt-2 text-2xl font-bold text-gray-100">
              {mcqBreakdown.obtained.toFixed(1)} / {mcqBreakdown.total}
            </p>
          </div>
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-5">
            <p className="text-sm text-gray-400">Coding Marks</p>
            <p className="mt-2 text-2xl font-bold text-gray-100">
              {codingBreakdown.obtained.toFixed(1)} / {codingBreakdown.total}
            </p>
          </div>
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-5">
            <p className="text-sm text-gray-400">Combined Marks</p>
            <p className="mt-2 text-2xl font-bold text-gray-100">
              {attempt.score.obtained.toFixed(1)} / {attempt.score.total}
            </p>
          </div>
        </div>)}

      {/* MCQ Responses */}
      {attempt.responses?.mcqResponses &&
        attempt.responses.mcqResponses.length > 0 && (
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              MCQ Responses
            </h2>
            <div className="space-y-4">
              {attempt.responses.mcqResponses.map((mcq, index) => {
                return (
                  <div
                    key={mcq.questionId}
                    className="border border-neutral-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-100 mb-2">
                          Question {index + 1}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          <strong>Selected Answer:</strong>{" "}
                          {mcq.selectedAnswer || "No answer"}
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong>Marks:</strong> {mcq.marksObtained} /{" "}
                          {mcq.maxMarks}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {mcq.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Coding Submissions */}
      {attempt.responses?.codingResponses &&
        attempt.responses.codingResponses.length > 0 && (
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Coding Submissions
            </h2>
            <div className="space-y-3">
              {attempt.responses.codingResponses.map((submission, index) => (
                <div
                  key={submission.questionId}
                  className="flex items-center justify-between p-4 border border-neutral-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-100">
                        Coding Problem {index + 1}
                      </p>
                      <p className="text-sm text-gray-400">
                        Test cases: {submission.passedTestcases} /{" "}
                        {submission.totalTestcases}
                      </p>
                      <p className="text-sm text-gray-400">
                        Submission ID:{" "}
                        {submission.submissionId || "Not submitted"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-100">
                      {submission.marksObtained.toFixed(1)} /{" "}
                      {submission.maxMarks}
                    </p>
                    <p className="text-xs text-gray-400">
                      {submission.verdict.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Assignment File */}
      {attempt.responses?.assignmentFileUrl && (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Assignment Submission
          </h2>
          <div className="flex flex-col gap-4 p-4 border border-neutral-700 rounded-lg lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-100">Submitted File</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block">
                <span className="block text-sm font-medium text-gray-300 mb-2">
                  Assignment Marks
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={assignmentMaxMarks}
                    value={assignmentMarks}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setAssignmentMarks(
                        Math.min(Math.max(value || 0, 0), assignmentMaxMarks),
                      );
                    }}
                    className="w-28 px-3 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-400">
                    / {assignmentMaxMarks}
                  </span>
                </div>
              </label>
              <button
                type="button"
                onClick={handleDownloadAssignment}
                disabled={openingPdf}
                className="px-4 py-2 text-center text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-60"
              >
                {openingPdf ? "Opening..." : "Download"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {(proctorSessions && proctorSessions.length === 0) && (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            {hasAssignmentFile ? "Feedback for Student" : "Feedback"}
          </h2>
          {hasAssignmentFile ? (
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide detailed feedback to help the student improve..."
              rows={6}
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-300 whitespace-pre-wrap">
              {attempt.feedback || "No feedback provided."}
            </p>
          )}
        </div>
      )}

      {/* Score Summary */}
      <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Score Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-blue-700">Total Marks</p>
            <p className="text-2xl font-bold text-blue-900">
              {attempt.score.total}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Marks Obtained</p>
            <p className="text-2xl font-bold text-blue-900">
              {attempt.score.obtained.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Percentage</p>
            <p className="text-2xl font-bold text-blue-900">
              {attempt.score.percentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
