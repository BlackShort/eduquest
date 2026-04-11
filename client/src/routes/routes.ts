import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import {
    AssignmentLayout, EditorLayout, ContestLayout,
    DashboardLayout, ProblemListLayout, RootLayout,
    SiteLayout, AssessmentLayout, FDashboardLayout
} from "@/layouts";
import { ProtectedRoute } from "@/components/site/protected-route";
import { StudentRoleRoute, FacultyRoleRoute } from "@/components/site/role-wrappers";

// Site pages
const Home = lazy(() => import("@/app/site").then(m => ({ default: m.Home })));
const About = lazy(() => import("@/app/site").then(m => ({ default: m.About })));
const Privacy = lazy(() => import("@/app/site").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("@/app/site").then(m => ({ default: m.Terms })));
const Cookies = lazy(() => import("@/app/site").then(m => ({ default: m.Cookies })));
const Contact = lazy(() => import("@/app/site").then(m => ({ default: m.Contact })));
const Login = lazy(() => import("@/app/site").then(m => ({ default: m.Login })));
const Register = lazy(() => import("@/app/site").then(m => ({ default: m.Register })));

// Error pages
const Unauthorized = lazy(() => import("@/app/error/unauthorized").then(m => ({ default: m.Unauthorized })));
const ErrorPage = lazy(() => import("@/app/error/error").then(m => ({ default: m.ErrorPage })));

// Dashboard
const DashboardHome = lazy(() => import("@/app/dashboard").then(m => ({ default: m.DashboardHome })));
const DashboardSettings = lazy(() => import("@/app/dashboard").then(m => ({ default: m.DashboardSettings })));

// Code / Contest / Problems
const ContestHome = lazy(() => import("@/app/code").then(m => ({ default: m.ContestHome })));
const ContestDetails = lazy(() => import("@/app/code").then(m => ({ default: m.ContestDetails })));
const ProblemHome = lazy(() => import("@/app/code").then(m => ({ default: m.ProblemHome })));
const ProblemCategory = lazy(() => import("@/app/code").then(m => ({ default: m.ProblemCategory })));
const ContestDashboard = lazy(() => import("@/app/code").then(m => ({ default: m.ContestDashboard })));

// Student pages
const Assignment = lazy(() => import("@/app/assignment").then(m => ({ default: m.Assignment })));
const AssignmentDetail = lazy(() => import("@/app/assignment").then(m => ({ default: m.AssignmentDetail })));
const ProctorTestPage = lazy(() => import("@/app/proctortest").then(m => ({ default: m.ProctorTestPage })));
const AssessmentHome = lazy(() => import("@/app/assessment").then(m => ({ default: m.AssessmentHome })));
const LeaderboardHome = lazy(() => import("@/app/leaderboard").then(m => ({ default: m.LeaderboardHome })));

// Faculty pages (default exports)
const FDashboardHome = lazy(() => import("@/app/dashboard/faculty/fdashboard-page"));
const FDashboardAssessment = lazy(() => import("@/app/dashboard/faculty/fdashboard-assessment"));
const FDashboardAssignments = lazy(() => import("@/app/dashboard/faculty/fdashboard-assignments"));
const FacultyAnalyticsPage = lazy(() => import("@/app/dashboard/faculty/fdashboard-analytics"));
const FacultyProblemBankPage = lazy(() => import("@/app/dashboard/faculty/fdashboard-problems"));
const CreateTestPage = lazy(() => import("@/app/dashboard/faculty/fdashboard-create-test"));
const EditTestPage = lazy(() => import("@/app/dashboard/faculty/fdashboard-edit-test"));
const TestResultsPage = lazy(() => import("@/app/dashboard/faculty/fdashboard-test-results"));
const FacultySettingsPage = lazy(() => import("@/app/dashboard/faculty/fdashboard-settings"));
const AttemptDetailPage = lazy(() => import("@/app/dashboard/faculty/fdashboard-attempt-detail"));
const BulkImportPage = lazy(() => import("@/app/dashboard/faculty/fdashboard-bulk-import"));
const ReportsPage = lazy(() => import("@/app/dashboard/faculty/fdashboard-reports"));

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            { path: "*", Component: ErrorPage },
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
                    { index: true, Component: Login },
                    { path: "login", Component: Login },
                    { path: "register", Component: Register },
                ]
            },
            { path: "/not-found", Component: ErrorPage },
            { path: "/unauthorized", Component: Unauthorized },
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
            { path: "contest/:contestId/:problemId", Component: EditorLayout },
            { path: "problems/:problemId", Component: EditorLayout },
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
                Component: ProtectedRoute,
                children: [
                    {
                        Component: StudentRoleRoute,
                        children: [
                            {
                                path: "dashboard",
                                Component: DashboardLayout,
                                children: [
                                    { index: true, Component: DashboardHome },
                                    { path: "settings", Component: DashboardSettings },
                                    { path: "assignments", Component: Assignment },
                                    { path: "assessment", Component: AssessmentHome },
                                    { path: "contest", Component: ContestDashboard },
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
                            { path: "proctor-test", Component: ProctorTestPage },
                        ],
                    },
                    {
                        Component: FacultyRoleRoute,
                        children: [
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
                        ],
                    },
                ],
            },
        ]
    }
]);