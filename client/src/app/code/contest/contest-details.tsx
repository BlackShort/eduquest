import { Header } from "@/components/site/header";
import dailyMedal from "@/assets/contest/daily.png";
import weeklyMedal from "@/assets/contest/weekly.png";
import { Clock, Trophy, Users, Play, ChevronLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";

interface Contest {
  id: number;
  name: string;
  description: string;
  image: string;
  time: string;
  duration: string;
  status: "upcoming" | "ongoing" | "ended";
  startTime: string;
  endTime: string;
  participants: number;
  prize: string;
  problems: { id: string; title: string; difficulty: string; score: number }[];
  rules: string[];
}

export const ContestDetails = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();

  // Mock contest data - Replace with API call later
  const contestsData: Record<string, Contest> = {
    "daily-contest": {
      id: 1,
      name: "Daily Coding Contest",
      description: "Test your skills with daily coding challenges and compete with programmers worldwide!",
      image: dailyMedal,
      time: "Everyday 8:00 PM (UTC+0)",
      duration: "90 minutes",
      status: "upcoming", // upcoming, ongoing, ended
      startTime: "2026-02-14T20:00:00Z",
      endTime: "2026-02-14T21:30:00Z",
      participants: 1234,
      prize: "Medals & Certificates",
      problems: [
        { id: "p1", title: "Two Sum Problem", difficulty: "Easy", score: 100 },
        { id: "p2", title: "Binary Tree Traversal", difficulty: "Medium", score: 200 },
        { id: "p3", title: "Dynamic Programming Challenge", difficulty: "Hard", score: 300 },
      ],
      rules: [
        "Each problem has a specific score based on difficulty",
        "Submissions are evaluated immediately",
        "Rankings are updated in real-time",
        "Top performers receive medals and certificates"
      ]
    },
    "weekly-contest-1": {
      id: 2,
      name: "Weekly Coding Contest",
      description: "Weekly competitive programming contest with challenging problems!",
      image: weeklyMedal,
      time: "Every Sunday 8:00 PM (UTC+0)",
      duration: "120 minutes",
      status: "upcoming",
      startTime: "2026-02-16T20:00:00Z",
      endTime: "2026-02-16T22:00:00Z",
      participants: 2567,
      prize: "Medals & Certificates",
      problems: [
        { id: "p1", title: "Graph Algorithms", difficulty: "Medium", score: 200 },
        { id: "p2", title: "Advanced DP", difficulty: "Hard", score: 300 },
        { id: "p3", title: "System Design", difficulty: "Hard", score: 400 },
        { id: "p4", title: "Competitive Challenge", difficulty: "Expert", score: 500 },
      ],
      rules: [
        "Each problem has a specific score based on difficulty",
        "Submissions are evaluated immediately",
        "Rankings are updated in real-time",
        "Top performers receive medals and certificates"
      ]
    }
  };

  const contest = contestsData[contestId as string];

  if (!contest) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <Header variant="sticky" theme="dark" />
        <div className="flex items-center justify-center h-screen">
          <p className="text-neutral-400">Contest not found</p>
        </div>
      </div>
    );
  }

  const handleStartContest = () => {
    // Navigate to first problem
    if (contest.problems.length > 0) {
      navigate(`/contest/${contestId}/${contest.problems[0].id}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "hard": return "text-orange-500";
      case "expert": return "text-red-500";
      default: return "text-neutral-400";
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-neutral-950">
      <Header variant="sticky" theme="dark" />

      {/* <div className="fixed top-12 inset-0 z-0 bg-[linear-gradient(to_right,var(--color-gray-300)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-gray-300)_1px,transparent_1px)] bg-size-[20px_20px] bg-position-[0_0,0_0] mask-[repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px),radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_70%)] [-webkit-mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px),radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_70%)] mask-intersect [-webkit-mask-composite:source-in]" /> */}

      <div
        className="fixed top-12 inset-0 z-0 
          bg-[linear-gradient(to_right,var(--color-neutral-900)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-900)_1px,transparent_1px)] bg-size-[20px_20px] bg-position-[0_0,0_0] 
          mask-[repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] 
          [-webkit-mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] mask-intersect [-webkit-mask-composite:source-in]"
      />

      <main className="z-1 relative flex justify-center w-full min-h-screen px-4 py-8">
        <div className="flex flex-col max-w-5xl w-full gap-8 relative z-5">

          {/* Back Button */}
          <Link to="/contest" className="flex items-center gap-2 text-neutral-400 hover:text-orange-500 transition-colors w-fit">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Contests</span>
          </Link>

          {/* Contest Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800">
            <img
              src={contest.image}
              alt={contest.name}
              className="w-32 h-32 object-contain"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-orange-500 mb-2">{contest.name}</h1>
              <p className="text-neutral-300 mb-4">{contest.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-neutral-500">Duration</p>
                    <p className="text-sm text-neutral-200">{contest.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Users className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-neutral-500">Participants</p>
                    <p className="text-sm text-neutral-200">{contest.participants.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Trophy className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-neutral-500">Prize</p>
                    <p className="text-sm text-neutral-200">{contest.prize}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartContest}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-base text-white font-medium rounded-md transition-colors duration-300 shadow-md"
            >
              <Play className="w-5 h-5" />
              Start Contest
            </button>
          </div>

          {/* Contest Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Problems Section */}
            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-100 mb-4">Problems</h2>
              <div className="space-y-3">
                {contest.problems.map((problem, index) => (
                  <Link
                    key={problem.id}
                    to={`/contest/${contestId}/${problem.id}`}
                    className="flex items-center justify-between p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-700 hover:border-neutral-600"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500 font-mono text-sm">{index + 1}.</span>
                      <div>
                        <p className="text-neutral-200 font-medium">{problem.title}</p>
                        <p className={`text-sm ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </p>
                      </div>
                    </div>
                    <span className="text-orange-400 font-semibold">{problem.score} pts</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Rules Section */}
            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-100 mb-4">Contest Rules</h2>
              <ul className="space-y-3 list-disc list-inside">
                {contest.rules.map((rule, index) => (
                  <li key={index} className="text-neutral-300 text-sm">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Schedule Section */}
            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-100 mb-4">Schedule</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-500">Contest Time</p>
                  <p className="text-neutral-200">{contest.time}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Duration</p>
                  <p className="text-neutral-200">{contest.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${contest.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                    contest.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-neutral-500/20 text-neutral-400'
                    }`}>
                    {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Score Section */}
            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-100 mb-4">Scoring</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-500">Total Problems</p>
                  <p className="text-2xl font-bold text-orange-500">{contest.problems.length}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Maximum Score</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {contest.problems.reduce((sum, p) => sum + p.score, 0)} pts
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
