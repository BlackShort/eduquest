import { Sidebar } from "@/components/site/sidebar";
import { Header } from "@/components/site/header";
import { Outlet } from "react-router";
import { useContextAPI } from "@/hooks/useContext";
import { studentNavigation, facultyNavigation, adminNavigation } from "@/lib/sidebar";


export const DashboardLayout = () => {
  const { user, sidebarOpen, setSidebarOpen } = useContextAPI();

  const getLayoutFromRole = (role: string): "student" | "faculty" | "admin" => {
    switch (role) {
      case "faculty":
        return "faculty";
      case "admin":
        return "admin";
      case "user":
      default:
        return "student";
    }
  };

  const getNavigationFromRole = (role: string) => {
    switch (role) {
      case "faculty":
        return facultyNavigation;
      case "admin":
        return adminNavigation;
      case "user":
      default:
        return studentNavigation;
    }
  };

  const layout = user ? getLayoutFromRole(user.role) : "student";
  const navigation = user ? getNavigationFromRole(user.role) : studentNavigation;

  return (
    <div className="flex flex-col min-h-screen w-full bg-neutral-900">
      <Header layout={layout} variant="sticky" theme="dark" menu={false} />

      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div
            className="fixed w-full inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed md:sticky bg-black/50 ${(layout === "admin" || layout === "faculty") ? "top-12 h-[calc(100vh-3rem)]" : "top-14 h-[calc(100vh-3.5rem)]"} left-0 shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 z-20 md:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
          <Sidebar navigation={navigation} />
        </aside>

        <main className="w-full max-w-5xl mx-auto p-4 md:p-6 z-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
