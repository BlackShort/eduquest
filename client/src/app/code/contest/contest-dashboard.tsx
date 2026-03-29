
import { Trophy, Calendar, CheckCircle2, Award, TrendingUp, BarChart3, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import dailyMedal from "@/assets/contest/daily.png";
import weeklyMedal from "@/assets/contest/weekly.png";

// --- Types (Ready for API Integration) ---
export interface PastContest {
  id: string;
  name: string;
  date: string;
  rank: number;
  totalParticipants: number;
  score: number;
  maxScore: number;
  problemsSolved: number;
  totalProblems: number;
  image: string;
}

export interface UserContestStats {
  totalAttended: number;
  bestRank: number;
  globalRating: number;
  totalProblemsSolved: number;
}

// --- Mock Data ---
const mockStats: UserContestStats = {
  totalAttended: 12,
  bestRank: 42,
  globalRating: 1850,
  totalProblemsSolved: 38,
};

const mockPastContests: PastContest[] = [
  {
    id: "weekly-contest-1",
    name: "Weekly Coding Contest 108",
    date: "2026-03-22T20:00:00Z",
    rank: 156,
    totalParticipants: 4500,
    score: 300,
    maxScore: 400,
    problemsSolved: 3,
    totalProblems: 4,
    image: weeklyMedal,
  },
  {
    id: "daily-contest-21",
    name: "Daily Coding Challenge",
    date: "2026-03-20T20:00:00Z",
    rank: 42,
    totalParticipants: 1200,
    score: 100,
    maxScore: 100,
    problemsSolved: 1,
    totalProblems: 1,
    image: dailyMedal,
  },
  {
    id: "weekly-contest-2",
    name: "Weekly Coding Contest 107",
    date: "2026-03-15T20:00:00Z",
    rank: 512,
    totalParticipants: 5000,
    score: 200,
    maxScore: 500,
    problemsSolved: 2,
    totalProblems: 4,
    image: weeklyMedal,
  },
];

export const ContestDashboard = () => {
  // Format dates nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-8 p-2 lg:p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-[#0F0F12] rounded-2xl p-6 border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold mb-1 text-neutral-100">
              My Contest
            </h1>
            <p className="text-neutral-400 text-lg font-light max-w-lg">
              Track your performance and review past contests
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/3 border border-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <Award className="w-5 h-5 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="font-semibold text-purple-50 tracking-wide">{mockStats.totalAttended} Completed</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/2 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <Award className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-medium">Contests Attended</span>
          </div>
          <span className="text-3xl font-bold text-neutral-100">{mockStats.totalAttended}</span>
        </div>

        <div className="bg-white/2 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium">Best Rank</span>
          </div>
          <span className="text-3xl font-bold text-neutral-100">#{mockStats.bestRank}</span>
        </div>

        <div className="bg-white/2 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">Global Rating</span>
          </div>
          <span className="text-3xl font-bold text-neutral-100">{mockStats.globalRating}</span>
        </div>

        <div className="bg-white/2 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">Problems Solved</span>
          </div>
          <span className="text-3xl font-bold text-neutral-100">{mockStats.totalProblemsSolved}</span>
        </div>
      </div>

      {/* Past Contests List */}
      <div className="flex flex-col gap-6 w-full mt-4">
        <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-500" />
          Recent Activity
        </h2>

        <div className="flex flex-col gap-4">
          {mockPastContests.map((contest) => (
            <Link
              key={contest.id}
              to={`/contest/${contest.id}`}
              className="group flex flex-col md:flex-row items-center gap-6 p-5 bg-neutral-900/30 hover:bg-white/2 transition-all duration-300 rounded-xl border border-neutral-800 hover:border-neutral-700"
            >
              {/* Contest Image */}
              <div className="w-20 h-20 shrink-0 flex items-center justify-center bg-neutral-950 rounded-lg p-2">
                <img src={contest.image} alt={contest.name} className="w-full h-full object-contain" />
              </div>

              {/* Contest Details */}
              <div className="flex-1 flex flex-col gap-1 w-full text-center md:text-left">
                <h3 className="text-lg font-semibold text-neutral-200 group-hover:text-orange-400 transition-colors">
                  {contest.name}
                </h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1 text-sm text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(contest.date)}
                  </div>
                  <span className="hidden md:inline text-neutral-700">•</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {contest.problemsSolved}/{contest.totalProblems} Solved
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="flex items-center gap-6 w-full md:w-auto justify-center pl-0 md:pl-6 md:border-l border-neutral-800 h-full py-2">
                <div className="flex flex-col items-center md:items-end w-20">
                  <span className="text-xs text-neutral-500 mb-1">Rank</span>
                  <span className="text-base font-semibold text-neutral-200">
                    {contest.rank} <span className="text-xs text-neutral-600 font-normal">/ {contest.totalParticipants}</span>
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-end w-20">
                  <span className="text-xs text-neutral-500 mb-1">Score</span>
                  <span className="text-base font-semibold text-orange-400">
                    {contest.score}
                  </span>
                </div>

                <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors hidden md:block" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
