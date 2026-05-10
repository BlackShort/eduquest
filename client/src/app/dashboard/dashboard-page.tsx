import { useContextAPI } from "@/hooks/useContext";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";

export const DashboardHome = () => {
  const { user } = useContextAPI();
  
  return (
    <div className="space-y-8 p-2 lg:p-4 max-w-7xl mx-auto">
      <div className="relative overflow-hidden bg-[#0F0F12] rounded-2xl p-4 md:p-6 border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-125 h-125 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-125 h-125 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold mb-1 text-neutral-100">
              Welcome back, {user?.username ? String(user.username) : "Student"}! 👋
            </h1>
            <p className="text-neutral-400 text-lg font-light">
              Ready to continue pushing your limits today?
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">
          Your Statistics
        </h2>
        <DashboardStats />
      </div>
    </div>
  )
}
