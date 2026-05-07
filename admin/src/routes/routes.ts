import { ErrorPage } from "@/app/error/error";
import { Unauthorized } from "@/app/error/unauthorized";
import { Login } from "@/app/site";
import { ProtectedRoute } from "@/components/site/protected-route";
import { AdminRoleRoute, FacultyRoleRoute } from "@/components/site/role-wrappers";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { RootLayout } from "@/layouts/root-layout";
import { createBrowserRouter } from "react-router";
import { lazy } from "react";

// Faculty pages (default exports)
const FDashboardHome = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-page"),
);
const FDashboardAssessment = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-assessment"),
);
const FDashboardAssignments = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-assignments"),
);
const FacultyAnalyticsPage = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-analytics"),
);
const FacultyProblemBankPage = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-problems"),
);
const CreateTestPage = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-create-test"),
);
const EditTestPage = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-edit-test"),
);
const TestResultsPage = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-test-results"),
);
const FacultySettingsPage = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-settings"),
);
const AttemptDetailPage = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-attempt-detail"),
);
const BulkImportPage = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-bulk-import"),
);
const ReportsPage = lazy(
  () => import("@/app/dashboard/faculty/fdashboard-reports"),
);

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: "*", Component: ErrorPage },
      { path: "/", Component: Login },
      { path: "/auth/login", Component: Login },
      { path: "/not-found", Component: ErrorPage },
      { path: "/unauthorized", Component: Unauthorized },
      {
        Component: ProtectedRoute,
        children: [
          {
            Component: FacultyRoleRoute,
            children: [
              {
                path: "faculty-dashboard",
                Component: DashboardLayout,
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
          {
            Component: AdminRoleRoute,
            children: [
              {
                path: "admin-dashboard",
                Component: DashboardLayout,
                children: [
                  { index: true, Component: FDashboardHome },
                ]
              }
            ]
          }
        ],
      },
    ],
  },
]);
