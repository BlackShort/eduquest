import { createBrowserRouter } from "react-router";
import { AssignmentLayout, EditorLayout, ContestLayout, DashboardLayout, ProblemListLayout, RootLayout, SiteLayout, AssessmentLayout, FDashboardLayout } from "@/layouts";
import { Home, About, Privacy, Terms, Cookies, Contact, Login, Register } from "@/app/site";
import { ProtectedRoute } from "@/components/site/protected-route";
import { DashboardHome, DashboardSettings } from "@/app/dashboard";
import { ContestHome, ContestDetails, ProblemHome, ProblemCategory } from "@/app/code";
import { ErrorPage } from "@/app/error/error";
import { Assignment, AssignmentDetail } from "@/app/assignment";
import { ProctorTestPage } from "@/app/proctortest";
import { AssessmentHome } from "@/app/assessment";
import { LeaderboardHome } from "@/app/leaderboard";
import { FDashboardHome } from "@/app/dashboard/faculty/fdashboard-page";
import { FDashboardAssessment } from "@/app/dashboard/faculty/fdashboard-assessment";
import { FDashboardAssignments } from "@/app/dashboard/faculty/fdashboard-assignments";
import FacultyAnalyticsPage from "@/app/dashboard/faculty/fdashboard-analytics";
import FacultyProblemBankPage from "@/app/dashboard/faculty/fdashboard-problems";
import CreateTestPage from "@/app/dashboard/faculty/fdashboard-create-test";
import EditTestPage from "@/app/dashboard/faculty/fdashboard-edit-test";
import TestResultsPage from "@/app/dashboard/faculty/fdashboard-test-results";
import FacultySettingsPage from "@/app/dashboard/faculty/fdashboard-settings";
import AttemptDetailPage from "@/app/dashboard/faculty/fdashboard-attempt-detail";
import BulkImportPage from "@/app/dashboard/faculty/fdashboard-bulk-import";
import ReportsPage from "@/app/dashboard/faculty/fdashboard-reports";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                path: "*",
                Component: ErrorPage
            },
            {
                path: "/",
                Component: SiteLayout,
                children: [
                    { index: true, Component: Home },
                    { path: "about", Component: About },
                    { path: "privacy", Component: Privacy },
                    { path: "terms", Component: Terms },
                    { path: "cookies", Component: Cookies },
                    { path: "contact", Component: Contact },
                ]
            },
            {
                path: "auth",
                children: [
                    {index: true, Component: Login },
                    { path: "login", Component: Login },
                    { path: "register", Component: Register },
                ]
            },
            {
                // Pathless protected route — redirects to /auth/login if not authenticated
                Component: ProtectedRoute,
                children: [
                    {
                        path: "dashboard",
                        Component: DashboardLayout,
                        children: [
                            { index: true, Component: DashboardHome },
                            { path: "settings", Component: DashboardSettings },
                            { path: "assignments", Component: Assignment },
                            { path: "assessment", Component: AssessmentHome },
                        ],
                    },
                    {
                        path: "faculty-dashboard",
                        Component: FDashboardLayout,
                        children: [
                            { index: true, Component: FDashboardHome },
                            { path: "assessment", Component: FDashboardAssessment },
                            { path: "assignments", Component: FDashboardAssignments },
                            { path: "analytics", Component: FacultyAnalyticsPage },
                            { path: "problems", Component: FacultyProblemBankPage },
                            { path: "settings", Component: FacultySettingsPage },
                            { path: "tests/create", Component: CreateTestPage },
                            { path: "tests/:testId/edit", Component: EditTestPage },
                            { path: "tests/:testId/results", Component: TestResultsPage },
                            { path: "attempt/:attemptId", Component: AttemptDetailPage },
                            { path: "bulk-import", Component: BulkImportPage },
                            { path: "reports", Component: ReportsPage },
                        ],
                    },
                    {
                        path: "assessment",
                        Component: AssessmentLayout,
                        children: [
                            { index: true, Component: AssessmentHome },
                            { path: ":assessmentId", Component: AssignmentDetail },
                        ],
                    },
                    {
                        path: "assignments",
                        Component: AssignmentLayout,
                        children: [
                            { path: ":assignmentId", Component: AssignmentDetail },
                        ],
                    },
                    {
                        path: "contest",
                        Component: ContestLayout,
                        children: [
                            { index: true, Component: ContestHome },
                            { path: ":contestId", Component: ContestDetails },
                        ],
                    },
                    {
                        path: "leaderboard",
                        Component: ContestLayout,
                        children: [
                            { index: true, Component: LeaderboardHome },
                        ],
                    },
                    {
                        path: "contest/:contestId/:problemId",
                        Component: EditorLayout,
                    },
                    {
                        path: "problems/:problemId",
                        Component: EditorLayout,
                    },
                    {
                        path: "problems",
                        Component: ProblemListLayout,
                        children: [
                            { index: true, Component: ProblemHome },
                        ],
                    },
                    {
                        path: "problemset",
                        Component: ProblemListLayout,
                        children: [
                            { index: true, Component: ProblemHome },
                            { path: ":category", Component: ProblemCategory },
                        ],
                    },
                    {
                        path: "proctor-test",
                        Component: ProctorTestPage,
                    },
                ],
            },
        ]
    }
]);
