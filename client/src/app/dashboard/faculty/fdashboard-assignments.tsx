import { useEffect, useState, useCallback } from 'react';
import { getQuestions, deleteQuestion } from '@/apis/faculty-api';
import {
  Plus,
  Edit,
  Trash2,
  FileUp,
  Search
} from 'lucide-react';

type QuestionType = 'mcq' | 'coding' | 'assignment';

interface QuestionSet {
  _id: string;
  test_id: string;
  subject_id: string;
  num_questions: number;
  isInProblemBank?: boolean;
  createdAt: string;
  questions?: Array<{
    question_id: string;
    question_text: string;
    difficulty?: string;
    [key: string]: unknown;
  }>;
}

export const FDashboardAssignments = () => {
  const [activeType, setActiveType] = useState<QuestionType>('mcq');
  const [questions, setQuestions] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number | boolean> = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await getQuestions(activeType, params);
      
      if (response.success) {
        setQuestions(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  }, [activeType, pagination.page, pagination.limit, searchQuery]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this question set?')) return;

    try {
      await deleteQuestion(activeType, testId);
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question set');
    }
  };

  const getDifficultyBadge = (difficulty?: string) => {
    if (!difficulty) return null;

    const styles = {
      easy: 'bg-green-600/20 text-green-400',
      medium: 'bg-yellow-600/20 text-yellow-400',
      hard: 'bg-red-600/20 text-red-400'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[difficulty as keyof typeof styles]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Question Bank</h1>
          <p className="text-gray-400 mt-1">Manage your question library and problem sets</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-gray-200 rounded-lg transition-colors">
            <FileUp size={20} />
            Upload CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus size={20} />
            Add Questions
          </button>
        </div>
      </div>

      {/* Question Type Tabs */}
      <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {(['mcq', 'coding', 'assignment'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-700 text-gray-400 hover:bg-neutral-600'
                }`}
              >
                {type === 'mcq' ? 'MCQ Questions' : type.charAt(0).toUpperCase() + type.slice(1) + ' Questions'}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No {activeType} questions found</p>
            <button className="text-blue-400 hover:underline mt-2">
              Add your first {activeType} question
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {questions.map((questionSet) => (
                <div
                  key={questionSet._id}
                  className="p-4 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-200 font-medium">Test ID: {questionSet.test_id}</h3>
                        {questionSet.isInProblemBank && (
                          <span className="px-2 py-1 text-xs bg-purple-600/20 text-purple-400 rounded-full">
                            Problem Bank
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Subject: {questionSet.subject_id}</span>
                        <span>Questions: {questionSet.num_questions}</span>
                        <span>Created: {new Date(questionSet.createdAt).toLocaleDateString()}</span>
                      </div>
                      {questionSet.questions && questionSet.questions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {questionSet.questions.slice(0, 2).map((q, idx: number) => (
                            <div key={idx} className="text-sm text-gray-300 pl-4 border-l-2 border-neutral-600">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">Q{idx + 1}:</span>
                                <span className="line-clamp-1">{q.question_text}</span>
                                {q.difficulty && getDifficultyBadge(q.difficulty)}
                              </div>
                            </div>
                          ))}
                          {questionSet.questions.length > 2 && (
                            <div className="text-sm text-gray-400 pl-4">
                              +{questionSet.questions.length - 2} more questions
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-gray-400 hover:bg-neutral-600 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(questionSet.test_id)}
                        className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-700">
                <div className="text-gray-400 text-sm">
                  Showing {questions.length} of {pagination.total} question sets
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
          </>
        )}
      </div>

      {/* Instructions Card */}
      <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">Quick Tip</h3>
        <p className="text-gray-300 text-sm">
          You can upload questions via CSV for bulk import or create them manually. Mark questions as "Problem Bank" to reuse them across multiple tests.
        </p>
      </div>
    </div>
  );
};




