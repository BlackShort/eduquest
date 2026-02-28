import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  ClipboardCheck,
  Filter,
  type LucideIcon
} from 'lucide-react';
import { 
  getFacultyAnalytics, 
  exportTestResults, 
  exportStudentPerformance,
  exportAnalyticsReport
} from '@/apis/faculty-api';
import type { Analytics } from '@/types/types';

type ReportType = 'test-results' | 'student-performance' | 'analytics-summary';

interface ReportCard {
  id: ReportType;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<ReportType | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedTestId, setSelectedTestId] = useState<string>('');

  const reportCards: ReportCard[] = [
    {
      id: 'test-results',
      title: 'Test Results Report',
      description: 'Export detailed results for a specific test including student scores and analytics',
      icon: ClipboardCheck,
      color: 'blue'
    },
    {
      id: 'student-performance',
      title: 'Student Performance Report',
      description: 'Export comprehensive performance data for all students across all tests',
      icon: Users,
      color: 'green'
    },
    {
      id: 'analytics-summary',
      title: 'Analytics Summary Report',
      description: 'Export overall analytics including test statistics and trends',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFacultyAnalytics(dateRange.startDate, dateRange.endDate);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportReport = async (reportType: ReportType) => {
    try {
      setExporting(reportType);

      let blob: Blob;
      let filename: string;

      switch (reportType) {
        case 'test-results':
          if (!selectedTestId) {
            alert('Please select a test to export results');
            return;
          }
          blob = await exportTestResults(selectedTestId);
          filename = `test-results-${selectedTestId}-${Date.now()}.xlsx`;
          break;

        case 'student-performance':
          blob = await exportStudentPerformance(dateRange.startDate, dateRange.endDate);
          filename = `student-performance-${Date.now()}.xlsx`;
          break;

        case 'analytics-summary':
          blob = await exportAnalyticsReport(dateRange.startDate, dateRange.endDate);
          filename = `analytics-summary-${Date.now()}.xlsx`;
          break;

        default:
          return;
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Reports Dashboard</h1>
        <p className="text-gray-400">
          Generate and export comprehensive reports for your tests and student performance
        </p>
      </div>

      {/* Filters */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-100">Report Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-700">Total Tests</p>
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">{analytics.totalTests}</p>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-700">Active Tests</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">{analytics.activeTests}</p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-700">Total Students</p>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-900">{analytics.totalStudents}</p>
          </div>

          <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-orange-700">Avg. Score</p>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-900">{analytics.averageScore.toFixed(1)}%</p>
          </div>
        </div>
      )}

      {/* Report Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-100">Available Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportCards.map((report) => {
            const Icon = report.icon;
            const isExporting = exporting === report.id;
            
            return (
              <div
                key={report.id}
                className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`p-3 bg-${report.color}-900/20 rounded-lg w-fit mb-4`}>
                  <Icon className={`w-6 h-6 text-${report.color}-600`} />
                </div>

                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {report.description}
                </p>

                {report.id === 'test-results' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Test
                    </label>
                    <select
                      value={selectedTestId}
                      onChange={(e) => setSelectedTestId(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Choose a test...</option>
                      {analytics?.recentTests?.map((test) => (
                        <option key={test._id} value={test._id}>
                          {test.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={() => handleExportReport(report.id)}
                  disabled={isExporting || (report.id === 'test-results' && !selectedTestId)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-${report.color}-600 text-white rounded-lg hover:bg-${report.color}-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`}
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export Report
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {analytics?.recentActivity && analytics.recentActivity.length > 0 && (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {analytics.recentActivity.slice(0, 10).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-100">
                      {activity.studentName} - {activity.testTitle}
                    </p>
                    <p className="text-sm text-gray-400">
                      Score: {activity.score}/{activity.totalMarks} ({activity.percentage.toFixed(1)}%) • {new Date(activity.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                  activity.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-neutral-700 text-gray-300'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export History Note */}
      <div className="bg-neutral-700 border border-neutral-700 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            <p className="font-medium text-gray-100 mb-1">About Reports</p>
            <ul className="space-y-1">
              <li>• All reports are exported in Excel format (.xlsx)</li>
              <li>• Reports include data based on the selected date range</li>
              <li>• Test results reports require selecting a specific test</li>
              <li>• Exported files are downloaded directly to your device</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}






