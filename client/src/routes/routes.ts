import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import {
  AssignmentLayout,
  EditorLayout,
  ContestLayout,
  DashboardLayout,
  ProblemListLayout,
  RootLayout,
  SiteLayout,
  AssessmentView,
} from "@/layouts";
import { ProtectedRoute } from "@/components/site/protected-route";
import { StudentRoleRoute } from "@/components/site/role-wrappers";

// Site pages
const Home = lazy(() =>
  import("@/app/site").then((m) => ({ default: m.Home })),
);
const About = lazy(() =>
  import("@/app/site").then((m) => ({ default: m.About })),
);
const Privacy = lazy(() =>
  import("@/app/site").then((m) => ({ default: m.Privacy })),
);
const Terms = lazy(() =>
  import("@/app/site").then((m) => ({ default: m.Terms })),
);
const Cookies = lazy(() =>
  import("@/app/site").then((m) => ({ default: m.Cookies })),
);
const Contact = lazy(() =>
  import("@/app/site").then((m) => ({ default: m.Contact })),
);
const Login = lazy(() =>
  import("@/app/site").then((m) => ({ default: m.Login })),
);
const Register = lazy(() =>
  import("@/app/site").then((m) => ({ default: m.Register })),
);

// Error pages
const Unauthorized = lazy(() =>
  import("@/app/error/unauthorized").then((m) => ({ default: m.Unauthorized })),
);
const ErrorPage = lazy(() =>
  import("@/app/error/error").then((m) => ({ default: m.ErrorPage })),
);

// Dashboard
const DashboardHome = lazy(() =>
  import("@/app/dashboard").then((m) => ({ default: m.DashboardHome })),
);
const DashboardSettings = lazy(() =>
  import("@/app/dashboard").then((m) => ({ default: m.DashboardSettings })),
);

// Code / Contest / Problems
const ContestHome = lazy(() =>
  import("@/app/code").then((m) => ({ default: m.ContestHome })),
);
const ContestDetails = lazy(() =>
  import("@/app/code").then((m) => ({ default: m.ContestDetails })),
);
const ProblemHome = lazy(() =>
  import("@/app/code").then((m) => ({ default: m.ProblemHome })),
);
const ProblemCategory = lazy(() =>
  import("@/app/code").then((m) => ({ default: m.ProblemCategory })),
);
const ContestDashboard = lazy(() =>
  import("@/app/code").then((m) => ({ default: m.ContestDashboard })),
);

// Student pages
const Assignment = lazy(() =>
  import("@/app/assignment").then((m) => ({ default: m.Assignment })),
);
const AssignmentDetail = lazy(() =>
  import("@/app/assignment").then((m) => ({ default: m.AssignmentDetail })),
);
const ProctorTestPage = lazy(() =>
  import("@/app/proctortest").then((m) => ({ default: m.ProctorTestPage })),
);
const AssessmentHome = lazy(() =>
  import("@/app/assessment").then((m) => ({ default: m.AssessmentHome })),
);
const LeaderboardHome = lazy(() =>
  import("@/app/leaderboard").then((m) => ({ default: m.LeaderboardHome })),
);

export const router = createBrowserRouter([
  {
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
        ],
      },
      {
        path: "auth",
        children: [
          { index: true, Component: Login },
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
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
        children: [{ index: true, Component: LeaderboardHome }],
      },
      { path: "contest/:contestId/:problemId", Component: EditorLayout },
      { path: "problems/:problemId", Component: EditorLayout },
      {
        path: "problems",
        Component: ProblemListLayout,
        children: [{ index: true, Component: ProblemHome }],
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
                Component: AssessmentView,
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
        ],
      },
    ],
  },
]);
