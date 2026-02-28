import type { LucideIcon } from 'lucide-react';
import { CodeXml, FileCodeCorner, ChartNoAxesColumn, UserRound, Settings, ListTodo, LayoutDashboard, ChartColumnDecreasing, Upload, FileText } from "lucide-react";

export interface NavigationItem {
    featured?: boolean;
    path: string;
    icon: LucideIcon;
    title: string;
}

export interface Navigation {
    [key: string]: NavigationItem[];
}

// Main dashboard navigation (student dashboard)
export const studentNavigation: Navigation = {
    dashboard: [
        { featured: false, path: `/dashboard`, icon: LayoutDashboard, title: 'Dashboard' },
        { featured: true, path: `assessment`, icon: ListTodo, title: 'Assessment' },
        { featured: false, path: `/contest`, icon: ChartNoAxesColumn, title: 'Contests' },
        { featured: false, path: `/problems`, icon: CodeXml, title: 'Problems' },
        { featured: false, path: `/leaderboard`, icon: ChartColumnDecreasing, title: 'Leaderboard' },
    ],

    learning: [
        { featured: false, path: `assignments`, icon: FileCodeCorner, title: 'Assignments' },
        // { path: `courses`, icon: FileText, title: 'Courses' },
        // { path: `resources`, icon: FolderClosed, title: 'Resources' },
    ],

    account: [
        { featured: false, path: `me`, icon: UserRound, title: 'Profile' },
        { featured: false, path: `settings`, icon: Settings, title: 'Settings' },
    ],

    // app: [
    //     { path: `appshare`, icon: QrCode, title: 'Share App' },
    // ],
};

// Faculty dashboard navigation
export const facultyNavigation: Navigation = {
    dashboard: [
        { featured: false, path: `/faculty-dashboard`, icon: LayoutDashboard, title: 'Dashboard' },
        { featured: true, path: `assessment`, icon: ListTodo, title: 'Tests' },
        { featured: false, path: `analytics`, icon: ChartColumnDecreasing, title: 'Analytics' },
    ],

    management: [
        { featured: false, path: `assignments`, icon: FileCodeCorner, title: 'Question Bank' },
        { featured: false, path: `problems`, icon: CodeXml, title: 'Problems' },
        { featured: false, path: `bulk-import`, icon: Upload, title: 'Bulk Import' },
        { featured: false, path: `reports`, icon: FileText, title: 'Reports' },
    ],

    account: [
        { featured: false, path: `/me`, icon: UserRound, title: 'Profile' },
        { featured: false, path: `settings`, icon: Settings, title: 'Settings' },
    ],
};

// Default export for backward compatibility
export const navigation = studentNavigation;