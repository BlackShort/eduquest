import { useCallback } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Save, 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  Settings as SettingsIcon,
  Plus
} from 'lucide-react';

import { createTest } from '@/apis/faculty-api';
import { getQuestions } from '@/apis/faculty-api';
import type { Test } from '@/types/types';

export default function CreateTestPage() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, string[]>>({});

  const [loading, setLoading] = useState(false);
type QuestionItem = {
  _id: string;
  test_id: string;
  subject_id: string;
  type: 'mcq' | 'coding' | 'assignment'; // ✅ ADD THIS
  questions: {
    question_id?: string;
    _id?: string;
    question_text?: string;
    title?: string;
  }[];
};

const [activeQuestionTab, setActiveQuestionTab] = useState<
  'mcq' | 'coding' | 'assignment'
>('mcq');

const [questionBankMap, setQuestionBankMap] = useState<{
  mcq: QuestionItem[];
  coding: QuestionItem[];
  assignment: QuestionItem[];
}>({
  mcq: [],
  coding: [],
  assignment: []
});
// const [selectedQuestions, setSelectedQuestions] = useState<Record<string, string[]>>({});
const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [formData, setFormData] = useState<Partial<Test>>({
    title: '',
    description: '',
    type: 'assessment',
    subjectId: '',
    status: 'draft',
    durationMinutes: 60,
    questionRefs: {
      mcqIds: [],
      codingIds: [],
      assignmentIds: []
    },
    settings: {
      allowLateSubmission: false,
      showResultsImmediately: false,
      randomizeQuestions: false,
      enableProctoring: false
    },
    marksAllocation: {
      mcq: 1,
      coding: 10,
      assignment: 5
    },
    passingPercentage: 50,
    instructions: ''
  });

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings!, [field]: value }
    }));
  };

  const handleMarksChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      marksAllocation: { ...prev.marksAllocation!, [field]: value }
    }));
  };

//   const handleAddQuestion = (questionId: string) => {
//   const key =
//     activeQuestionTab === 'mcq'
//       ? 'mcqIds'
//       : activeQuestionTab === 'coding'
//       ? 'codingIds'
//       : 'assignmentIds';

//   setFormData((prev) => ({
//     ...prev,
//     questionRefs: {
//       ...prev.questionRefs!,
//       [key]: [...((prev.questionRefs?.[key] as string[]) || []), questionId]
//     }
//   }));
// };

// const isSelected = (questionId: string) => {
//   const key =
//     activeQuestionTab === 'mcq'
//       ? 'mcqIds'
//       : activeQuestionTab === 'coding'
//       ? 'codingIds'
//       : 'assignmentIds';

//   return ((formData.questionRefs?.[key] as string[]) || []).includes(questionId);
// }; 

const fetchQuestionBank = useCallback(async (
  type: 'mcq' | 'coding' | 'assignment'
) => {
  try {
    const response = await getQuestions(type, {
      search: debouncedSearch,
      subjectId: subjectFilter,
      problemBank: true
    });

    const data = response.data || [];

    setQuestionBankMap((prev) => ({
  ...prev,
  [type]: data.map((item: QuestionItem) => ({
    ...item,
    type
  }))
}));
    const uniqueSubjects: string[] = Array.from(
  new Set(
    data
      .map((item: QuestionItem) => item.subject_id)
      .filter((s: string) => s && s.trim() !== "")
  )
);

uniqueSubjects.sort();

setSubjects(uniqueSubjects);

// optional: sort for better UX
// uniqueSubjects.sort();
// setSubjects(uniqueSubjects);

    // ⚠️ Keep your selection logic intact
    
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}, [debouncedSearch, subjectFilter]); // ✅ dependencies

useEffect(() => {
  fetchQuestionBank(activeQuestionTab);
}, [activeQuestionTab, fetchQuestionBank]);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 400);

  return () => clearTimeout(timer);
}, [searchQuery]);



const handleSubmit = async (publishNow = false) => {
  try {
    setLoading(true);

    const status: 'draft' | 'published' | 'archived' =
      publishNow ? 'published' : 'draft';

//     const mcqIds: string[] = [];
// const codingIds: string[] = [];
// const assignmentIds: string[] = [];

// questionBank.forEach((set) => {
//   const selected = selectedQuestions[set._id] || [];

//   if (activeQuestionTab === 'mcq') {
//     mcqIds.push(...selected);
//   } else if (activeQuestionTab === 'coding') {
//     codingIds.push(...selected);
//   } else if (activeQuestionTab === 'assignment') {
//     assignmentIds.push(...selected);
//   }
// });
const rawMcqIds: string[] = [];
const rawCodingIds: string[] = [];
const rawAssignmentIds: string[] = [];

(['mcq', 'coding', 'assignment'] as const).forEach((type) => {
  questionBankMap[type].forEach((set) => {
    const selected = selectedQuestions[set._id] || [];

    if (type === 'mcq') {
      rawMcqIds.push(...selected);
    } else if (type === 'coding') {
      rawCodingIds.push(...selected);
    } else {
      rawAssignmentIds.push(...selected);
    }
  });
});

const mcqIds = Array.from(new Set(rawMcqIds));
const codingIds = Array.from(new Set(rawCodingIds));
const assignmentIds = Array.from(new Set(rawAssignmentIds));

    const dataToSubmit = {
      ...formData,
     questionRefs: {
      mcqIds,
      codingIds,
      assignmentIds
    },
      status,
      ...(formData.scheduledStart
        ? { scheduledStart: formData.scheduledStart }
        : {}),
      ...(formData.scheduledEnd
        ? { scheduledEnd: formData.scheduledEnd }
        : {})
    };

    console.log("FINAL PAYLOAD:", {
  mcqIds,
  codingIds,
  assignmentIds
});

if (
  mcqIds.length === 0 &&
  codingIds.length === 0 &&
  assignmentIds.length === 0
) {
  alert("Please select at least one question");
  return;
}

    await createTest(dataToSubmit);
    navigate('/faculty-dashboard/assessment');
  } catch (error) {
    console.error('Error creating test:', error);
    alert('Failed to create test. Please try again.');
  } finally {
    setLoading(false);
  }
};

const buildPreviewData = () => {
  type QuestionPreview = {
  question_text?: string;
  title?: string;
};

const result = {
  mcq: [] as QuestionPreview[],
  coding: [] as QuestionPreview[],
  assignment: [] as QuestionPreview[]
};

  (['mcq', 'coding', 'assignment'] as const).forEach((type) => {
    questionBankMap[type].forEach((set) => {
      const selected = selectedQuestions[set._id] || [];

      set.questions.forEach((q) => {
        const qid = q.question_id || q._id || '';

        if (selected.includes(qid)) {
          result[type].push(q);
        }
      });
    });
  });

  return result;
};

const toggleQuestionSelection = (setId: string, questionId: string) => {
  setSelectedQuestions((prev) => {
    const existing = prev[setId] || [];

    const updated = existing.includes(questionId)
      ? existing.filter((id) => id !== questionId)
      : [...existing, questionId];

    return {
      ...prev,
      [setId]: updated
    };
  });
};

const getSelectedCount = (type: 'mcq' | 'coding' | 'assignment') => {
  const sets = questionBankMap[type] || [];

  let count = 0;

  sets.forEach((set) => {
    const selected = selectedQuestions[set._id] || [];
    count += selected.length;
  });

  return count;
};

const getTotalSelectedCount = () => {
  return Object.values(selectedQuestions)
    .flat()
    .length;
};

const previewData = buildPreviewData();



  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Create New Test</h1>
          <p className="text-gray-400 mt-1">Set up a new assessment, assignment, or contest</p>
        </div>
        <button
          onClick={() => navigate('/faculty-dashboard/assessment')}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      {/* Basic Information */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Test Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Data Structures Mid-term Assessment"
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Test Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="assessment">Assessment</option>
              <option value="assignment">Assignment</option>  
              <option value="contest">Contest</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject ID *
            </label>
            <input
              type="text"
              value={formData.subjectId}
              onChange={(e) => handleChange('subjectId', e.target.value)}
              placeholder="e.g., CS101"
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the test..."
              rows={3}
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Scheduling */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Schedule & Duration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledStart || ''}
              onChange={(e) => handleChange('scheduledStart', e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledEnd || ''}
              onChange={(e) => handleChange('scheduledEnd', e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Clock className="w-4 h-4" />
              Duration (minutes) *
            </label>
            <input
              type="number"
              value={formData.durationMinutes}
              onChange={(e) => handleChange('durationMinutes', parseInt(e.target.value))}
              min="1"
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Marks Allocation */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-100">Marks Allocation</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              MCQ Marks (per question)
            </label>
            <input
              type="number"
              value={formData.marksAllocation?.mcq}
              onChange={(e) => handleMarksChange('mcq', parseInt(e.target.value))}
              min="0"
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Coding Marks (per question)
            </label>
            <input
              type="number"
              value={formData.marksAllocation?.coding}
              onChange={(e) => handleMarksChange('coding', parseInt(e.target.value))}
              min="0"
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Assignment Marks (per question)
            </label>
            <input
              type="number"
              value={formData.marksAllocation?.assignment}
              onChange={(e) => handleMarksChange('assignment', parseInt(e.target.value))}
              min="0"
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Passing Percentage
            </label>
            <input
              type="number"
              value={formData.passingPercentage}
              onChange={(e) => handleChange('passingPercentage', parseInt(e.target.value))}
              min="0"
              max="100"
              className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          Test Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 border border-neutral-700 rounded-lg hover:bg-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.settings?.allowLateSubmission}
              onChange={(e) => handleSettingsChange('allowLateSubmission', e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-300">Allow Late Submission</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-neutral-700 rounded-lg hover:bg-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.settings?.showResultsImmediately}
              onChange={(e) => handleSettingsChange('showResultsImmediately', e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-300">Show Results Immediately</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-neutral-700 rounded-lg hover:bg-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.settings?.randomizeQuestions}
              onChange={(e) => handleSettingsChange('randomizeQuestions', e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-300">Randomize Questions</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-neutral-700 rounded-lg hover:bg-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.settings?.enableProctoring}
              onChange={(e) => handleSettingsChange('enableProctoring', e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-300">Enable Proctoring</span>
          </label>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-100">Instructions for Students</h2>
        <textarea
          value={formData.instructions}
          onChange={(e) => handleChange('instructions', e.target.value)}
          placeholder="Enter instructions for students taking this test..."
          rows={5}
          className="w-full px-4 py-2 bg-neutral-900 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 space-y-4">
  <h2 className="text-xl font-semibold text-gray-100">Question Builder</h2>
  

  <div className="flex gap-2">
    {(['mcq', 'coding', 'assignment'] as const).map((tab) => (
  <button
    key={tab}
    onClick={() => setActiveQuestionTab(tab)}
    className={`px-4 py-2 rounded-lg ${
      activeQuestionTab === tab
        ? 'bg-blue-600 text-white'
        : 'bg-neutral-700 text-gray-300'
    }`}
  >
    {tab.toUpperCase()} ({getSelectedCount(tab)})
  </button>
))}
  </div>

  <div className="flex gap-2 mb-4">
  <input
    type="text"
    placeholder="Search questions..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="px-3 py-2 bg-neutral-700 text-white rounded-lg"
  />

 <select
  value={subjectFilter}
  onChange={(e) => setSubjectFilter(e.target.value)}
  className="px-3 py-2 bg-neutral-700 text-white rounded-lg min-w-[180px]"
>
  <option value="">All Subjects</option>

  {subjects.map((subj) => (
    <option key={subj} value={subj}>
      {subj}
    </option>
  ))}
</select>
</div>

{/* ✅ ADD THIS BLOCK HERE */}
<div className="flex justify-between items-center mb-2">
  <span className="text-sm text-gray-400">
    Selected: {getSelectedCount(activeQuestionTab)}
  </span>

  <span className="text-sm text-gray-400">
  Total Selected: {getTotalSelectedCount()}
</span>

  <button
    onClick={() => {
      const updated = { ...selectedQuestions };

      (questionBankMap[activeQuestionTab] || []).forEach((set) => {
        updated[set._id] = [];
      });

      setSelectedQuestions(updated);
    }}
    className="text-sm text-red-400 hover:text-red-300"
  >
    Clear Selection
  </button>
</div>

{/* 👇 YOUR EXISTING LIST STARTS */}
{/* <div className="space-y-4 max-h-96 overflow-y-auto"></div> */}

 <div className="space-y-4 max-h-96 overflow-y-auto">
  {questionBankMap[activeQuestionTab].length === 0 ? (
    <p className="text-gray-400">No question sets available</p>
  ) : (
    questionBankMap[activeQuestionTab].map((set) => (
      <div
        key={set._id}
        className="bg-neutral-900 border border-neutral-700 rounded-lg p-4"
      >
        <h3 className="text-white font-semibold mb-3">
          Test ID: {set.test_id}
        </h3>

        <div className="space-y-2">
          {set.questions?.map((q, index) => {
            const qid = q.question_id || q._id || '';
            const checked =
  selectedQuestions[set._id]?.includes(qid) || false;

            return (
              <label
                key={qid}
                className="flex items-center gap-3 text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    toggleQuestionSelection(set._id, qid)
                  }
                />

                <span>
                  Q{index + 1}.{' '}
                  {q.question_text || q.title || 'Untitled'}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    ))
  )}
</div>
</div>
{showPreview && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-neutral-900 p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">

      <h2 className="text-xl font-semibold mb-4 text-white">
        Test Preview
      </h2>

      {/* Instructions */}
      <div className="mb-4">
        <h3 className="text-gray-300 font-medium">Instructions</h3>
        <p className="text-gray-400">{formData.instructions}</p>
      </div>

      {/* Questions */}
      {(['mcq', 'coding', 'assignment'] as const).map((type) => {
        const questions = previewData[type];

        if (questions.length === 0) return null;

        return (
          <div key={type} className="mb-4">
            <h3 className="text-blue-400 font-semibold mb-2">
              {type.toUpperCase()} ({questions.length})
            </h3>

            {questions.map((q, i) => (
              <p key={i} className="text-gray-300 text-sm mb-1">
                Q{i + 1}. {q.question_text || q.title}
              </p>
            ))}
          </div>
        );
      })}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowPreview(false)}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Back
        </button>

        <button
          onClick={() => handleSubmit(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Confirm & Publish
        </button>
      </div>
    </div>
  </div>
)}



      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pb-6">
        <button
          onClick={() => navigate('/faculty-dashboard/assessment')}
          disabled={loading}
          className="px-6 py-2 text-gray-300 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading || !formData.title || !formData.subjectId || getTotalSelectedCount() === 0}

          className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save as Draft
        </button>
        <button
          onClick={() => setShowPreview(true)}
          disabled={loading || !formData.title || !formData.subjectId}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create & Publish
        </button>
      </div>
    </div>



  );

  
}





