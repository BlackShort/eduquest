import { useState, useEffect } from "react";
import { getUserStats } from "@/apis/test-api";

export interface UserStats {
  testsAvailable: number;
  assignmentsSubmitted: number;
  assessmentsCompleted: number;
  codingPassRate: number;
  totalTimeSpentMinutes: number;
  averageScore: number;
  streakDays: number;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    testsAvailable: 0,
    assignmentsSubmitted: 0,
    assessmentsCompleted: 0,
    codingPassRate: 0,
    totalTimeSpentMinutes: 0,
    averageScore: 0,
    streakDays: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getUserStats();
        
        if (response?.data?.data) {
          const userStatsData = response.data.data;
          setStats({
            testsAvailable: userStatsData.testsAvailable || 0,
            assignmentsSubmitted: userStatsData.assignmentsSubmitted || 0,
            assessmentsCompleted: userStatsData.assessmentsCompleted || 0,
            codingPassRate: userStatsData.codingPassRate || 0,
            totalTimeSpentMinutes: userStatsData.totalTimeSpentMinutes || 0,
            averageScore: userStatsData.averageScore || 0,
            streakDays: userStatsData.streakDays || 0,
          });
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching user stats:", err);
        setError("Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
