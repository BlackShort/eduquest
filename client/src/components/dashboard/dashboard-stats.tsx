import {
  BarChart3,
  CheckCircle2,
  Code2,
  Clock,
  Target,
  Flame,
  Award,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { useUserStats } from "@/hooks/useUserStats";

export const DashboardStats = () => {
  const { stats, loading } = useUserStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Tests Available"
        value={stats.testsAvailable}
        icon={BarChart3}
        color="blue"
        loading={loading}
        subtext="Total tests to attempt"
      />

      <StatCard
        label="Assignments Submitted"
        value={stats.assignmentsSubmitted}
        icon={CheckCircle2}
        color="green"
        loading={loading}
        subtext="Completed assignments"
      />

      <StatCard
        label="Assessments Completed"
        value={stats.assessmentsCompleted}
        icon={Target}
        color="orange"
        loading={loading}
        subtext="Finished assessments"
      />

      <StatCard
        label="Coding Pass Rate"
        value={`${stats.codingPassRate}%`}
        icon={Code2}
        color="purple"
        loading={loading}
        subtext="Test cases passed"
      />

      <StatCard
        label="Time Spent"
        value={`${Math.floor(stats.totalTimeSpentMinutes / 60)}h ${stats.totalTimeSpentMinutes % 60}m`}
        icon={Clock}
        color="red"
        loading={loading}
        subtext="Total practice time"
      />

      <StatCard
        label="Average Score"
        value={`${stats.averageScore}%`}
        icon={Award}
        color="orange"
        loading={loading}
        subtext="Overall performance"
      />

      <StatCard
        label="Current Streak"
        value={stats.streakDays}
        icon={Flame}
        color="red"
        loading={loading}
        subtext="Days in a row"
      />

      <StatCard
        label="Total Progress"
        value={`${Math.min(
          stats.assignmentsSubmitted +
            stats.assessmentsCompleted +
            stats.codingPassRate,
          100,
        )}%`}
        icon={BarChart3}
        color="purple"
        loading={loading}
        subtext="Overall completion"
      />
    </div>
  );
};
