import type { LucideIcon } from 'lucide-react';
import { CodeXml, FileCodeCorner, ListTodo, LayoutDashboard, ChartColumnDecreasing, Upload, FileText } from "lucide-react";

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
    ],

    learning: [
        { featured: false, path: `assignments`, icon: FileCodeCorner, title: 'Assignments' },
    ],
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
};

// Default export for backward compatibility
export const navigation = studentNavigation;