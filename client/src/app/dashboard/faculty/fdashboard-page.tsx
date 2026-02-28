import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getTestStats, getFacultyAnalytics } from '@/apis/faculty-api';
import type { TestStatistics, FacultyAnalytics } from '@/types/types';
import { LayoutDashboard, ListTodo, FileCodeCorner, Users, Clock, TrendingUp, Plus } from 'lucide-react';

export const FDashboardHome = () => {
  const [stats, setStats] = useState<TestStatistics | null>(null);
  const [analytics, setAnalytics] = useState<FacultyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          getTestStats(),
          getFacultyAnalytics()
        ]);
        
        if (statsRes.success) setStats(statsRes.data);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Faculty Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your tests and view student performance</p>
        </div>
        <Link
          to="/faculty-dashboard/tests/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Create New Test
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<LayoutDashboard size={24} />}
          title="Total Tests"
          value={stats?.total || 0}
          subtitle={`${stats?.published || 0} published`}
          color="blue"
        />
        <StatCard
          icon={<ListTodo size={24} />}
          title="Draft Tests"
          value={stats?.draft || 0}
          subtitle="Unpublished"
          color="yellow"
        />
        <StatCard
          icon={<Users size={24} />}
          title="Student Attempts"
          value={analytics?.totalStudentAttempts || 0}
          subtitle={`${analytics?.gradedAttempts || 0} graded`}
          color="green"
        />
        <StatCard
          icon={<Clock size={24} />}
          title="Pending Grading"
          value={analytics?.pendingGrading || 0}
          subtitle="Needs review"
          color="red"
        />
      </div>

      {/* Test Type Distribution */}
      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Test Distribution
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-neutral-700/50 rounded-lg">
            <div className="text-3xl font-bold text-blue-400">{stats?.byType.assessment || 0}</div>
            <div className="text-gray-400 text-sm mt-1">Assessments</div>
          </div>
          <div className="text-center p-4 bg-neutral-700/50 rounded-lg">
            <div className="text-3xl font-bold text-purple-400">{stats?.byType.assignment || 0}</div>
            <div className="text-gray-400 text-sm mt-1">Assignments</div>
          </div>
          <div className="text-center p-4 bg-neutral-700/50 rounded-lg">
            <div className="text-3xl font-bold text-green-400">{stats?.byType.contest || 0}</div>
            <div className="text-gray-400 text-sm mt-1">Contests</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Recent Student Activity</h2>
        {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Users size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-gray-200 font-medium">{activity.studentName}</div>
                    <div className="text-gray-400 text-sm">{activity.testTitle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-200 font-semibold">{activity.score.toFixed(1)}%</div>
                  <div className={`text-sm ${
                    activity.status === 'graded' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">No recent activity</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/faculty-dashboard/assessment"
          className="p-6 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-blue-500 transition-colors group"
        >
          <ListTodo size={32} className="text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-100 mb-1">Manage Tests</h3>
          <p className="text-gray-400 text-sm">Create and manage assessments, assignments, and contests</p>
        </Link>
        <Link
          to="/faculty-dashboard/assignments"
          className="p-6 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-purple-500 transition-colors group"
        >
          <FileCodeCorner size={32} className="text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-100 mb-1">Question Bank</h3>
          <p className="text-gray-400 text-sm">Manage your question library and problem sets</p>
        </Link>
        <Link
          to="/faculty-dashboard/analytics"
          className="p-6 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-green-500 transition-colors group"
        >
          <TrendingUp size={32} className="text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-100 mb-1">Analytics</h3>
          <p className="text-gray-400 text-sm">View detailed performance reports and insights</p>
        </Link>
      </div>
    </div>
  );
};

// StatCard Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

const StatCard = ({ icon, title, value, subtitle, color }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-600/20 text-blue-400',
    yellow: 'bg-yellow-600/20 text-yellow-400',
    green: 'bg-green-600/20 text-green-400',
    red: 'bg-red-600/20 text-red-400'
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-100">{value}</div>
        <div className="text-gray-400 text-sm mt-1">{title}</div>
        <div className="text-gray-400 text-xs mt-1">{subtitle}</div>
      </div>
    </div>
  );
};





