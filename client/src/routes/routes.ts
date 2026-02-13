import { createBrowserRouter } from "react-router";
import { AssignmentLayout, CodeLayout, DashboardLayout, ProblemListLayout, RootLayout, SiteLayout } from "@/layouts";
import { Home, About, Privacy, Terms, Cookies, Contact, Login } from "@/app/site";
import { DashboardHome, DashboardSettings } from "@/app/dashboard";
import { ContestHome, ContestDetails, ProblemHome, ProblemList } from "@/app/code";
import { ErrorPage } from "@/app/error/error";
import { Assignment, AssignmentDetail } from "@/app/assignment";
// test
import { ProctorTestPage } from "@/app/proctortest";

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
                children: [
                    { index: true, Component: ContestHome },
                    { path: ":contestId", Component: ContestDetails },
                    { path: ":contestId/:problemId", Component: CodeLayout },
                ],
            },
            {
                path: "problemset",
                Component: ProblemHome
            },
            {
                path: "problems",
                children: [
                    { index: true, Component: ProblemHome },
                    { path: ":problemId", Component: CodeLayout },
                ],
            },
            {
                path: "problem-list",
                Component: ProblemListLayout,
                children: [
                    { path: ":category", Component: ProblemList },
                ],
            },
            { path: "proctor-test", 
                Component: ProctorTestPage, 
            },
        ]
    }
]);
