import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getTests, deleteTest, publishTest, archiveTest, duplicateTest } from '@/apis/faculty-api';
import type { Test } from '@/types/types';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Upload,
  Archive,
  Search
} from 'lucide-react';

export const FDashboardAssessment = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchTests = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (activeTab !== 'all') {
        params.status = activeTab;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await getTests(params);
      
      if (response.success) {
        setTests(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [activeTab, pagination.page, searchQuery]);

  const handleDelete = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;

    try {
      await deleteTest(testId);
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete test');
    }
  };

  const handlePublish = async (testId: string) => {
    try {
      await publishTest(testId);
      fetchTests();
    } catch (error) {
      console.error('Error publishing test:', error);
      alert('Failed to publish test');
    }
  };

  const handleArchive = async (testId: string) => {
    try {
      await archiveTest(testId);
      fetchTests();
    } catch (error) {
      console.error('Error archiving test:', error);
      alert('Failed to archive test');
    }
  };

  const handleDuplicate = async (testId: string) => {
    try {
      await duplicateTest(testId);
      fetchTests();
    } catch (error) {
      console.error('Error duplicating test:', error);
      alert('Failed to duplicate test');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50',
      published: 'bg-green-600/20 text-green-400 border-green-600/50',
      archived: 'bg-gray-600/20 text-gray-400 border-gray-600/50'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      assessment: 'bg-blue-600/20 text-blue-400',
      assignment: 'bg-purple-600/20 text-purple-400',
      contest: 'bg-green-600/20 text-green-400'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[type as keyof typeof styles]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Test Management</h1>
          <p className="text-gray-400 mt-1">Create and manage assessments, assignments, and contests</p>
        </div>
        <Link
          to="/faculty-dashboard/tests/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Create Test
        </Link>
      </div>

      {/* Tabs and Search */}
      <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {(['all', 'published', 'draft', 'archived'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-700 text-gray-400 hover:bg-neutral-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tests Table */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading tests...</div>
        ) : tests.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No tests found</p>
            <Link to="/faculty-dashboard/tests/create" className="text-blue-400 hover:underline mt-2 inline-block">
              Create your first test
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Start Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Marks</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test._id} className="border-b border-neutral-700/50 hover:bg-neutral-700/30">
                    <td className="py-3 px-4">
                      <div className="text-gray-200 font-medium">{test.title}</div>
                      <div className="text-gray-400 text-sm">{test.subjectId}</div>
                    </td>
                    <td className="py-3 px-4">{getTypeBadge(test.type)}</td>
                    <td className="py-3 px-4">{getStatusBadge(test.status)}</td>
                    <td className="py-3 px-4">
                      <div className="text-gray-300">
                        {test.scheduledStart
                          ? new Date(test.scheduledStart).toLocaleDateString()
                          : 'Not scheduled'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-300">{test.totalMarks}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/faculty-dashboard/tests/${test._id}/results`}
                          className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
                          title="View Results"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/faculty-dashboard/tests/${test._id}/edit`}
                          className="p-2 text-gray-400 hover:bg-neutral-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(test._id)}
                          className="p-2 text-gray-400 hover:bg-neutral-600 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={18} />
                        </button>
                        {test.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(test._id)}
                            className="p-2 text-green-400 hover:bg-green-600/20 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <Upload size={18} />
                          </button>
                        )}
                        {test.status === 'published' && (
                          <button
                            onClick={() => handleArchive(test._id)}
                            className="p-2 text-yellow-400 hover:bg-yellow-600/20 rounded-lg transition-colors"
                            title="Archive"
                          >
                            <Archive size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(test._id)}
                          className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-700">
            <div className="text-gray-400 text-sm">
              Showing {tests.length} of {pagination.total} tests
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-neutral-700 text-gray-400 rounded-lg hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-neutral-700 text-gray-400 rounded-lg hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};




