import { useEffect, useState, useCallback, useRef } from 'react';

import {
  getQuestions,
  deleteQuestion,
  createQuestion,
  uploadMCQCSV,
  uploadCodingCSV,
  uploadAssignmentCSV
} from '@/apis/faculty-api';

import {
  Plus,
  // Edit,
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


export default function FDashboardAssignments() {
  const [activeType, setActiveType] = useState<QuestionType>('mcq');
  const [questions, setQuestions] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  // const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({
   question_text: '',
   difficulty: 'easy',
   subject_id: ''
  });
  const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
});

const [uploading, setUploading] = useState(false);
const fileInputRef = useRef<HTMLInputElement | null>(null);
const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number | boolean> = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (debouncedSearch) {
  params.search = debouncedSearch;
}

    if (subjectFilter.trim()) {
  params.subjectId = subjectFilter.trim();
}


      const response = await getQuestions(activeType, params);
      console.log('QUESTIONS API RESPONSE:', response);
      if (response.success) {
  const fetchedQuestions =
    response.data?.questions ||
    response.data?.data ||
    response.data ||
    [];

  setQuestions(Array.isArray(fetchedQuestions) ? fetchedQuestions : []);

  if (response.pagination) {
    setPagination(response.pagination);
  }
}
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
}, [
  activeType,
  pagination.page,
  pagination.limit,
  debouncedSearch,
  subjectFilter
]);

useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 400);

  return () => clearTimeout(timer);
}, [searchQuery]);

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

//   const handleEdit = (questionSet: QuestionSet) => {
//   const firstQuestion = questionSet.questions?.[0];

//   setNewQuestion({
//     question_text: firstQuestion?.question_text || '',
//     difficulty: firstQuestion?.difficulty || 'easy',
//     subject_id: questionSet.subject_id
//   });

//   setEditingTestId(questionSet.test_id);
//   setShowAddForm(true);
// };

  const handleCreateQuestion = async () => {
  try {
    if (!newQuestion.question_text.trim()) {
      alert('Question text is required');
      return;
    }

    if (!newQuestion.subject_id.trim()) {
      alert('Subject ID is required');
      return;
    }

    const payload = {
      test_id: `QB-${Date.now()}`,
      subject_id: newQuestion.subject_id,
      isInProblemBank: true,
      questions: [
        {
          question_id: `Q-${Date.now()}`,
          question_text: newQuestion.question_text,
          difficulty: newQuestion.difficulty
        }
      ]
    };

//     if (editingTestId) {
//   await createQuestion(activeType, {
//     ...payload,
//     test_id: editingTestId
//   });
// } else {
//   await createQuestion(activeType, payload);
// }
await createQuestion(activeType, payload);

    setShowAddForm(false);
    // setEditingTestId(null);

    setNewQuestion({
      question_text: '',
      difficulty: 'easy',
      subject_id: ''
    });

    await fetchQuestions();
  } catch (error) {
    console.error('Error creating question:', error);
    alert('Failed to create question');
  }
};

const handleCSVUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    let response;

    if (activeType === 'mcq') {
      response = await uploadMCQCSV(formData);
    } else if (activeType === 'coding') {
      response = await uploadCodingCSV(formData);
    } else {
      response = await uploadAssignmentCSV(formData);
    }

    if (response?.success) {
      alert(`${activeType.toUpperCase()} CSV uploaded successfully`);

      setTimeout(() => {
        fetchQuestions();
      }, 500);
    } else {
      alert('CSV upload may have completed, but response was invalid');
    }
  } catch (error) {
    console.error('CSV upload failed:', error);
    alert('CSV upload failed');
  } finally {
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};

const toggleExpand = (id: string) => {
  setExpandedCards((prev) => ({
    ...prev,
    [id]: !prev[id]
  }));
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
  <input
    ref={fileInputRef}
    type="file"
    accept=".csv"
    className="hidden"
    onChange={handleCSVUpload}
  />

  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    disabled={uploading}
    className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-gray-200 rounded-lg transition-colors disabled:opacity-50"
  >
    <FileUp size={20} />
    {uploading ? 'Uploading...' : 'Upload CSV'}
  </button>

  <button
    type="button"
    onClick={() => setShowAddForm(true)}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
  >
    <Plus size={20} />
    Add Questions
  </button>
</div>
</div>

      {showAddForm && (
  <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 space-y-4">
    <h3 className="text-lg font-semibold text-white">
      Add {activeType.toUpperCase()} Question
    </h3>

    <input
      type="text"
      placeholder="Enter question"
      value={newQuestion.question_text}
      onChange={(e) =>
        setNewQuestion((prev) => ({
          ...prev,
          question_text: e.target.value
        }))
      }
      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
    />

    <input
      type="text"
      placeholder="Subject ID"
      value={newQuestion.subject_id}
      onChange={(e) =>
        setNewQuestion((prev) => ({
          ...prev,
          subject_id: e.target.value
        }))
      }
      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
    />

    <select
      value={newQuestion.difficulty}
      onChange={(e) =>
        setNewQuestion((prev) => ({
          ...prev,
          difficulty: e.target.value
        }))
      }
      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
    >
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>

    <div className="flex gap-2">
  <button
    type="button"
    onClick={handleCreateQuestion}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
  >
    Save Question
  </button>

  <button
    type="button"
    onClick={() => setShowAddForm(false)}
    className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg"
  >
    Cancel
  </button>
</div>
  </div>
)}

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
          <div className="flex gap-2">
  <div className="relative">
    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
    <input
      type="text"
      placeholder="Search questions..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setPagination((prev) => ({ ...prev, page: 1 }));
      }}
      className="pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
    />
  </div>

  <input
    type="text"
    placeholder="Filter by Subject ID..."
    value={subjectFilter}
    onChange={(e) => {
      setSubjectFilter(e.target.value);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }}
    className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
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
                        <span>
  Created: {questionSet.createdAt
    ? new Date(questionSet.createdAt).toLocaleDateString()
    : "N/A"}
</span>
                      </div>
                      {questionSet.questions && questionSet.questions.length > 0 && (
  <div className="mt-3 space-y-2">
    {(expandedCards[questionSet._id]
      ? questionSet.questions
      : questionSet.questions.slice(0, 2)
    ).map((q, idx: number) => (
      <div
        key={q.question_id}
        className="text-sm text-gray-300 pl-4 border-l-2 border-neutral-600"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Q{idx + 1}:</span>
          <span className="line-clamp-1">{q.question_text}</span>
          {q.difficulty && getDifficultyBadge(q.difficulty)}
        </div>
      </div>
    ))}

    {questionSet.questions.length > 2 && (
      <button
        type="button"
        onClick={() => toggleExpand(questionSet._id)}
        className="text-sm text-blue-400 hover:text-blue-300 pl-4"
      >
        {expandedCards[questionSet._id]
          ? "Show less"
          : `+${questionSet.questions.length - 2} more questions`}
      </button>
    )}
  </div>
)}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <button
  onClick={() => handleEdit(questionSet)}
  className="p-2 text-gray-400 hover:bg-neutral-600 rounded-lg transition-colors"
  title="Edit"
>
                        <Edit size={18} />
                      </button> */}
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




