import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/site/header";
import { Outlet } from "react-router";

export const DashboardLayout = () => {
  return (
    <div className='flex flex-col min-h-screen w-full'>
      <Header variant="sticky" />

      <div className="flex flex-1">
        <aside className="sticky top-14 h-[calc(100vh-3.5rem)] shrink-0">
          <Sidebar />
        </aside>

        <main className="w-full max-w-4xl mx-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
