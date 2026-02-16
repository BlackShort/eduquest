import { createBrowserRouter } from "react-router";
import { AssignmentLayout, EditorLayout, ContestLayout, DashboardLayout, ProblemListLayout, RootLayout, SiteLayout } from "@/layouts";
import { Home, About, Privacy, Terms, Cookies, Contact, Login } from "@/app/site";
import { DashboardHome, DashboardSettings } from "@/app/dashboard";
import { ContestHome, ContestDetails, ProblemHome, ProblemCategory } from "@/app/code";
import { ErrorPage } from "@/app/error/error";
import { Assignment, AssignmentDetail } from "@/app/assignment";
// test
import { ProctorTestPage } from "@/app/proctortest";
import { AssessmentHome } from "@/app/assessment";

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
                    { path: "login", Component: Login },
                ]
            },
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
                path: "contest/:contestId/:problemId",
                Component: EditorLayout,
            },
            {
                path: "problems",
                Component: ProblemListLayout,
                children: [
                    { index: true, Component: ProblemHome },
                    { path: ":problemId", Component: EditorLayout },
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
        ]
    }
]);
