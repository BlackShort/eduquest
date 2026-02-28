import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/site/header";
import { Outlet } from "react-router";
import { facultyNavigation } from "@/data/sidebar";

export const FDashboardLayout = () => {
    return (
        <div className="flex flex-col min-h-screen w-full bg-neutral-900">
            <Header layout="faculty" variant="sticky" theme="dark" menu={false} />

            <div className="flex flex-1">
                <aside className="sticky top-12 h-[calc(100vh-3rem)] shrink-0">
                    <Sidebar navigation={facultyNavigation} />
                </aside>

                <main className="w-full max-w-4xl mx-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
