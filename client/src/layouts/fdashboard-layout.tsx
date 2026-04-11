import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/site/header";
import { Outlet } from "react-router";
import { facultyNavigation } from "@/data/sidebar";
import { useContextAPI } from "@/hooks/useContext";

export const FDashboardLayout = () => {
    const { sidebarOpen, setSidebarOpen } = useContextAPI();

    return (
        <div className="flex flex-col min-h-screen w-full bg-neutral-900">
            <Header layout="faculty" variant="sticky" theme="dark" menu={false} />

            <div className="flex flex-1 relative">
                {sidebarOpen && (
                    <div
                        className="fixed w-full inset-0 bg-black/50 z-10 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside className={`fixed md:sticky top-12 left-0 h-[calc(100vh-3rem)] shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 z-20 md:z-auto ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                    <Sidebar navigation={facultyNavigation} />
                </aside>

                <main className="w-full max-w-4xl mx-auto p-6 z-9">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
