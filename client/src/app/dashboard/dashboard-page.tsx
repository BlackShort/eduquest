import { Link } from "react-router";
import {
  Code2,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
  Users,
  ChevronRight,
} from "lucide-react";
import { dummyAssignments, dummyCoding } from "@/data/dummy-data";
import { useContextAPI } from "@/hooks/useContext";

export const DashboardHome = () => {
  const { user } = useContextAPI();

  // Mock student stats
  const stats = {
    problemsSolved: 47,
    totalProblems: dummyCoding.reduce((acc, test) => acc + test.num_questions, 0),
    assignmentsCompleted: 8,
    totalAssignments: dummyAssignments.length,
    accuracy: 88.5,
    currentStreak: 12,
  };

  // Recent assignments
  const recentAssignments = dummyAssignments.slice(0, 3);

  // Upcoming contests
  const upcomingContests = [
    {
      id: "daily-contest",
      name: "Daily Coding Contest",
      time: "Everyday 8:00 PM",
      participants: 1250,
      color: "blue",
    },
    {
      id: "weekly-contest",
      name: "Weekly Coding Contest",
      time: "Every Sunday 8:00 PM",
      participants: 3420,
      color: "purple",
    },
  ];

  // Skills progress
  const skills = [
    { name: "Data Structures", level: 85, color: "bg-blue-500" },
    { name: "Algorithms", level: 72, color: "bg-purple-500" },
    { name: "Problem Solving", level: 90, color: "bg-green-500" },
    { name: "System Design", level: 65, color: "bg-orange-500" },
  ];

  // Recent activity
  const recentActivity = [
    { action: "Solved", item: "Two Sum Problem", time: "2 hours ago", type: "problem" },
    { action: "Completed", item: "Data Structures Assignment", time: "1 day ago", type: "assignment" },
    { action: "Participated in", item: "Weekly Contest #42", time: "3 days ago", type: "contest" },
  ];

  // Configuration to reduce redundancy
  const statCards = [
    { title: "Problems", icon: Code2, value: stats.problemsSolved, subValue: `/ ${stats.totalProblems}`, iconClasses: "text-blue-400/50 group-hover:text-blue-400", badgeInner: <span className="text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-1 rounded-md font-medium tracking-wide">+12 this week</span> },
    { title: "Assignments", icon: BookOpen, value: stats.assignmentsCompleted, subValue: `/ ${stats.totalAssignments}`, iconClasses: "text-purple-400/50 group-hover:text-purple-400", badgeInner: <span className="text-xs text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-1 rounded-md font-medium tracking-wide">+3 this week</span> },
    { title: "Accuracy", icon: Target, value: stats.accuracy, subValue: "%", iconClasses: "text-emerald-400/50 group-hover:text-emerald-400", badgeInner: <div className="flex items-center gap-1.5 text-xs text-emerald-400/80 font-medium tracking-wide"><TrendingUp className="w-3.5 h-3.5" /> Improving</div> },
    { title: "Rank", icon: Trophy, value: "#142", subValue: "", iconClasses: "text-orange-400/50 group-hover:text-orange-400", badgeInner: <div className="flex items-center gap-1.5 text-xs text-orange-400/80 font-medium tracking-wide"><Award className="w-3.5 h-3.5" /> Top 15%</div> }
  ];

  const quickActions = [
    { to: "/problems", icon: Code2, label: "Start Practicing", primary: true },
    { to: "/contest", icon: Calendar, label: "View Contests", primary: false },
    { to: "/dashboard/assignments", icon: BookOpen, label: "My Assignments", primary: false },
  ];

  const activityThemes: Record<string, string> = {
    problem: 'bg-blue-400',
    assignment: 'bg-purple-400',
    contest: 'bg-orange-400'
  };

  return (
    <div className="space-y-8 p-2 lg:p-4 max-w-7xl mx-auto">
      {/* Welcome Section */}
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
          <div className="flex items-center gap-3 bg-white/3 border border-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <Flame className="w-5 h-5 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="font-semibold text-orange-50 tracking-wide">{stats.currentStreak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Command Stats Bar - Completely Redesigned */}
      <div className="bg-white/2 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[80px] pointer-events-none mix-blend-overlay"></div>

        {statCards.map((stat, idx) => (
          <div key={idx} className="flex-1 p-4 md:p-8 group hover:bg-white/2 transition-colors relative">
            <div className="flex justify-between items-start mb-4">
              <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">{stat.title}</p>
              <stat.icon className={`w-5 h-5 transition-colors ${stat.iconClasses}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-light text-white tracking-tighter">{stat.value}</h3>
              {stat.subValue && <span className="text-sm text-neutral-600 font-medium">{stat.subValue}</span>}
            </div>
            <div className="mt-4 flex items-center">
              {stat.badgeInner}
            </div>
          </div>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Wider */}
        <div className="lg:col-span-8 space-y-8">

          {/* Action Header / Quick Actions Redesigned as Inline Pills */}
          <div className="flex flex-row items-center gap-3 overflow-x-auto no-scrollbar">
            {quickActions.map((action, idx) => (
              <Link 
                key={idx} 
                to={action.to} 
                className={`min-w-fit inline-flex items-center gap-2 px-6 py-2.5 font-medium rounded-full transition-all ${
                  action.primary 
                  ? "bg-neutral-100/20 border border-neutral-100/20 text-white font-medium shadow-lg" 
                  : "bg-neutral-100/1 border border-white/5 text-neutral-200 hover:bg-white/5 hover:border-white/20"
                }`}
              >
                <action.icon className={`w-4 h-4 ${!action.primary && "text-neutral-400"}`} /> {action.label}
              </Link>
            ))}
          </div>

          {/* Elegant Task List */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 md:p-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl text-neutral-100 mb-1">Active Priorities</h2>
                <p className="text-sm text-neutral-500">Your pending assignments and tasks</p>
              </div>
              <Link to="/dashboard/assignments" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">View all</Link>
            </div>

            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <Link key={assignment._id} to={`/assignments/${assignment.test_id}`} className="group flex items-center justify-between p-0 md:p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                      <BookOpen className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg leading-tight group-hover:text-blue-400 transition-colors">{assignment.test_id}</h4>
                      <p className="text-sm text-neutral-500 mt-1">{assignment.subject_id} • {assignment.num_questions} Questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-flex text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">Active</span>
                    <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-all translate-x-0 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sleek Skill Progress */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 md:p-8">
            <h2 className="text-2xl text-neutral-100 mb-8">Skill Proficiency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skills.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-neutral-400 font-medium">{skill.name}</span>
                    <span className="text-sm text-white font-medium">{skill.level}%</span>
                  </div>
                  {/* Very thin elegant line */}
                  <div className="h-1 w-full bg-neutral-900 rounded-full relative">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full ${skill.color} opacity-80`}
                      style={{ width: `${skill.level}%` }}
                    >
                      {/* Glowing dot at the end */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Narrower */}
        <div className="lg:col-span-4 space-y-8">

          {/* Badge / Profile Card - very minimalist */}
          <div className="bg-linear-to-b from-[#18181b] to-white/5 border border-white/5 rounded-2xl p-4 md:p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-orange-500/10 via-transparent to-purple-500/5 pointer-events-none"></div>
            <div className="mx-auto w-24 h-24 mb-6 rounded-2xl rotate-12 bg-linear-to-tr from-orange-400 to-amber-300 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)] relative z-10 transition-transform group-hover:rotate-0 group-hover:scale-105 duration-500">
              <Award className="w-10 h-10 text-orange-950 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2 relative z-10">Gold Scholar</h3>
            <p className="text-sm text-neutral-500 mb-6 relative z-10 leading-relaxed">Ranked in the top 15% globally with 50+ problems solved.</p>
            <Link to="/profile" className="inline-block text-sm font-medium text-white pb-1 border-b border-white/20 hover:border-white transition-colors relative z-10">
              View Achievements
            </Link>
          </div>

          {/* Vertical Timeline Activity */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 md:p-8">
            <h2 className="text-lg font-medium text-white mb-6">Recent Activity</h2>
            <div className="relative border-l border-neutral-800 ml-3 space-y-8">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="relative pl-6">
                  <span className={`absolute -left-1.25 top-1.5 w-2.5 h-2.5 rounded-full ring-4 shadow-sm ring-white/5 ${
                    activityThemes[activity.type] || 'bg-neutral-400'
                  }`}></span>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-neutral-300 leading-tight">
                      <span className="font-semibold text-white">{activity.action}</span> {activity.item}
                    </p>
                    <span className="text-xs text-neutral-600 font-medium mt-1">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimal Upcoming Contests */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">Upcoming Events</h2>
            </div>
            <div className="space-y-4">
              {upcomingContests.map((contest, idx) => (
                <Link key={idx} to={`/contest/${contest.id}`} className="group flex items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-white/2 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-white/5 border border-white/5 shrink-0 group-hover:border-white/10 transition-colors">
                    <Trophy className={`w-5 h-5 mb-1 ${contest.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`} />
                    <span className="text-[10px] text-neutral-500 font-semibold uppercase">{contest.time.substring(0, 3)}</span>
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">{contest.name}</h4>
                    <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {contest.participants.toLocaleString()} enrolled</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
