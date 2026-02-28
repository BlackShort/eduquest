import { useEffect, useState, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Award,
  Download,
  Calendar
} from 'lucide-react';
import { getFacultyAnalytics, exportTestResults } from '@/apis/faculty-api';
import type { Analytics } from '@/types/types';

interface ChartData {
  label: string;
  value: number;
}

export default function FacultyAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTest] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const days = parseInt(dateRange);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const response = await getFacultyAnalytics(startDate, endDate);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExport = async () => {
    try {
      if (selectedTest === 'all') {
        alert('Please select a specific test to export results');
        return;
      }
      const blob = await exportTestResults(selectedTest, 'excel');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test-results-${selectedTest}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting results:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Track student performance and test statistics</p>
        </div>
        <button
          onClick={handleExport}
          disabled={selectedTest === 'all'}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>

      {/* Filters */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filters:</span>
          </div>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-neutral-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              Showing data for the selected period
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tests"
          value={analytics?.totalTests || 0}
          icon={<BarChart3 className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={analytics?.totalStudents || 0}
          icon={<Users className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Avg. Score"
          value={`${analytics?.averageScore?.toFixed(1) || 0}%`}
          icon={<Award className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Avg. Completion"
          value={`${analytics?.averageCompletionTime || 0} min`}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Score Distribution
          </h3>
          {analytics?.scoreDistribution && (
            <SimpleBarChart
              data={Object.entries(analytics.scoreDistribution).map(([key, value]) => ({
                label: key,
                value: value as number
              }))}
              color="#3B82F6"
            />
          )}
        </div>

        {/* Test Performance */}
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Test Performance
          </h3>
          {analytics?.testPerformance && (
            <SimpleBarChart
              data={analytics.testPerformance.map(test => ({
                label: test.testTitle.substring(0, 15) + (test.testTitle.length > 15 ? '...' : ''),
                value: test.averageScore
              }))}
              color="#10B981"
            />
          )}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700">
        <div className="p-6 border-b border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-100">Recent Student Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-800 divide-y divide-neutral-700">
              {analytics?.recentActivity?.map((activity, index) => (
                <tr key={index} className="hover:bg-neutral-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {activity.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {activity.testTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    {activity.score}/{activity.totalMarks} ({activity.percentage.toFixed(1)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === 'graded' 
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'submitted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(activity.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Top Performing Test</h4>
          {analytics?.testPerformance && analytics.testPerformance.length > 0 && (
            <>
              <p className="text-2xl font-bold text-blue-700">
                {analytics.testPerformance[0].testTitle}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Avg Score: {analytics.testPerformance[0].averageScore.toFixed(1)}%
              </p>
            </>
          )}
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <h4 className="text-sm font-medium text-green-900 mb-2">Completion Rate</h4>
          <p className="text-2xl font-bold text-green-700">
            {analytics?.completionRate?.toFixed(1) || 0}%
          </p>
          <p className="text-sm text-green-600 mt-2">
            {analytics?.totalStudents || 0} students enrolled
          </p>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Pass Rate</h4>
          <p className="text-2xl font-bold text-purple-700">
            {analytics?.passRate?.toFixed(1) || 0}%
          </p>
          <p className="text-sm text-purple-600 mt-2">
            Based on 50% passing criteria
          </p>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-900/20 text-blue-600',
    green: 'bg-green-900/20 text-green-600',
    purple: 'bg-purple-900/20 text-purple-600',
    orange: 'bg-orange-900/20 text-orange-600'
  };

  return (
    <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-100 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Simple Bar Chart Component
interface SimpleBarChartProps {
  data: ChartData[];
  color: string;
}

function SimpleBarChart({ data, color }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-medium">{item.label}</span>
            <span className="text-gray-100 font-semibold">{item.value}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}





