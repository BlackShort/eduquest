import { Link } from "react-router";
import {
  Code2,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Users,
  ChevronRight,
  Sparkles,
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-br from-orange-500/30 to-blue-500/30 rounded-xl p-8 text-neutral-100 border border-neutral-700">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {`Welcome back, ${user?.username || "Student"}! 👋`}
            </h1>
            <p className="text-orange-100 text-lg">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Flame className="w-5 h-5 text-yellow-300" />
            <span className="font-bold">{stats.currentStreak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Problems Solved */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-blue-500/50 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
              +12 this week
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Problems Solved</h3>
          <p className="text-3xl font-bold text-white">
            {stats.problemsSolved}
            <span className="text-lg text-gray-500">/{stats.totalProblems}</span>
          </p>
          <div className="mt-3 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(stats.problemsSolved / stats.totalProblems) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-purple-500/50 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
              +3 this week
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Assignments</h3>
          <p className="text-3xl font-bold text-white">
            {stats.assignmentsCompleted}
            <span className="text-lg text-gray-500">/{stats.totalAssignments}</span>
          </p>
          <div className="mt-3 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${(stats.assignmentsCompleted / stats.totalAssignments) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-green-500/50 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs font-medium text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
              +2.5%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Accuracy Rate</h3>
          <p className="text-3xl font-bold text-white">{stats.accuracy}%</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Improving steadily</span>
          </div>
        </div>

        {/* Rank/Leaderboard */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-orange-500/50 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-xs font-medium text-orange-400 bg-orange-900/30 px-2 py-1 rounded-full">
              Top 15%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Global Rank</h3>
          <p className="text-3xl font-bold text-white">#142</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <Award className="w-4 h-4 text-orange-500" />
            <span>Gold Badge</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Assignments */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Assignments</h2>
              <Link
                to="/dashboard/assignments"
                className="text-sm font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <Link
                  key={assignment._id}
                  to={`/assignments/${assignment.test_id}`}
                  className="block p-4 bg-neutral-700 rounded-lg border border-neutral-600 hover:border-orange-500/50 hover:bg-neutral-700/70 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {assignment.test_id}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Subject: {assignment.subject_id} • {assignment.num_questions} Questions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Skills Progress */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Skill Progress</h2>
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-300">{skill.name}</span>
                    <span className="font-semibold text-white">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      activity.type === "problem"
                        ? "bg-blue-900/30"
                        : activity.type === "assignment"
                        ? "bg-purple-900/30"
                        : "bg-orange-900/30"
                    }`}
                  >
                    {activity.type === "problem" ? (
                      <Code2
                        className={`w-5 h-5 ${
                          activity.type === "problem" ? "text-blue-400" : ""
                        }`}
                      />
                    ) : activity.type === "assignment" ? (
                      <BookOpen className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Trophy className="w-5 h-5 text-orange-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white">
                      <span className="font-medium">{activity.action}</span>{" "}
                      <span className="text-gray-300">{activity.item}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/problems"
                className="block w-full px-4 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors text-center"
              >
                Start Practicing
              </Link>
              <Link
                to="/contest"
                className="block w-full px-4 py-3 bg-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-600 transition-colors text-center border border-neutral-600"
              >
                View Contests
              </Link>
              <Link
                to="/dashboard/assignments"
                className="block w-full px-4 py-3 bg-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-600 transition-colors text-center border border-neutral-600"
              >
                My Assignments
              </Link>
            </div>
          </div>

          {/* Upcoming Contests */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Upcoming Contests</h2>
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {upcomingContests.map((contest) => (
                <Link
                  key={contest.id}
                  to={`/contest/${contest.id}`}
                  className="block p-4 bg-neutral-700 rounded-lg border border-neutral-600 hover:border-orange-500/50 hover:bg-neutral-700/70 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 ${
                        contest.color === "blue" ? "bg-blue-900/30" : "bg-purple-900/30"
                      } rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <Trophy
                        className={`w-5 h-5 ${
                          contest.color === "blue" ? "text-blue-400" : "text-purple-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm group-hover:text-orange-400 transition-colors">
                        {contest.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{contest.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{contest.participants.toLocaleString()} participants</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="bg-linear-to-br from-purple-500 to-pink-500 rounded-lg p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Gold Badge</h3>
            <p className="text-sm text-purple-100 text-center mb-4">
              You've completed 50+ problems! Keep up the great work.
            </p>
            <div className="flex justify-center">
              <Link
                to="/profile"
                className="text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
              >
                View All Badges
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
