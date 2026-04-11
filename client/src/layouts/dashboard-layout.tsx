import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/site/header";
import { Outlet } from "react-router";
import { studentNavigation } from "@/data/sidebar";
import { useContextAPI } from "@/hooks/useContext";

export const DashboardLayout = () => {
  const { sidebarOpen, setSidebarOpen } = useContextAPI();

  return (
    <div className="flex flex-col min-h-screen w-full bg-neutral-900">
      <Header variant="sticky" theme="dark" />

      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div
            className="fixed w-full inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed md:sticky bg-black/50 top-14 left-0 h-[calc(100vh-3.5rem)] shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 z-20 md:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
          <Sidebar navigation={studentNavigation} />
        </aside>

        <main className="w-full max-w-5xl mx-auto p-4 md:p-6 z-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
