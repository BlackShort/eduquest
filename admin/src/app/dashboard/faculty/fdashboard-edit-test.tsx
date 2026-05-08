import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  Save, 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  Settings as SettingsIcon,
  Loader2,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react';
import {
  getTestById,
  updateTest,
  getQuestions,
  // addQuestionToSet,
  // removeQuestionFromSet
} from '@/apis/faculty-api';
import type { Test } from '@/types/types';

type QuestionType = 'mcq' | 'coding' | 'assignment';
type Difficulty = 'easy' | 'medium' | 'hard';

const getAllowedQuestionTypes = (testType?: string): QuestionType[] => {
  if (testType === 'assignment') return ['assignment'];
  if (testType === 'assessment') return ['mcq', 'coding'];
  return ['mcq', 'coding', 'assignment'];
};

type TestCaseDraft = {
  input: string;
  output: string;
  isHidden: boolean;
  enabled: boolean;
};

type QuestionDraft = {
  question_id: string;
  question_text: string;
  title?: string;
  options: string[];
  correct_answer: string;
  marks?: number;
  difficulty: Difficulty;
  explanation?: string;
  test_cases: TestCaseDraft[];
  tags?: string[];
  timeLimit?: number;
  memoryLimit?: number;
  constraints?: string;
  inputFormat?: string;
  outputFormat?: string;
  sampleInput?: string;
  sampleOutput?: string;
  wordLimit?: number | null;
  attachmentRequired?: boolean;
};

type QuestionItem = {
  _id: string;
  test_id: string;
  subject_id: string;
  questions: Array<Partial<QuestionDraft> & {
    _id?: string;
    question_id?: string;
    question_text: string;
  }>;
};

type EditingQuestion = {
  type: QuestionType;
  setId: string;
  questionId: string;
  draft: QuestionDraft;
};
export default function EditTestPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  

const [searchQuery, setSearchQuery] = useState('');
const [subjectFilter, setSubjectFilter] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
// const [isInitialized, setIsInitialized] = useState(false);


const [subjects, setSubjects] = useState<string[]>([]);

const [questionBankMap, setQuestionBankMap] = useState<{
  mcq: QuestionItem[];
  coding: QuestionItem[];
  assignment: QuestionItem[];
}>({
  mcq: [],
  coding: [],
  assignment: []
});

const [selectedQuestions, setSelectedQuestions] = useState<Record<string, string[]>>({});
const [editedQuestions, setEditedQuestions] = useState<Record<string, QuestionDraft>>({});
const [editingQuestion, setEditingQuestion] = useState<EditingQuestion | null>(null);

  
  const [saving, setSaving] = useState(false);
  const [activeQuestionTab, setActiveQuestionTab] = useState<QuestionType>('mcq');

// const [questionBank, setQuestionBank] = useState<QuestionItem[]>([]);
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

  useEffect(() => {
  const fetchTestData = async () => {
    try {
      setLoading(true);
      const response = await getTestById(testId!);
      setFormData(response.data);
      const refs = response.data.questionRefs || {};

const initialSelected: Record<string, string[]> = {};

// flatten all ids into selection map
['mcqIds', 'codingIds', 'assignmentIds'].forEach((key) => {
  (refs[key] || []).forEach((id: string) => {
    initialSelected[id] = [id];
  });
});

// setSelectedQuestions((prev) => {
//   const updated = { ...prev };

//   Object.entries(initialSelected).forEach(([setId, ids]) => {
//     if (!updated[setId]) {
//       updated[setId] = ids;
//     } else {
//       // merge without duplicates
//       updated[setId] = Array.from(
//         new Set([...updated[setId], ...ids])
//       );
//     }
//   });

//   return updated;
// });

    } catch (error) {
      console.error('Error fetching test:', error);
      alert('Failed to load test data');
      navigate('/faculty-dashboard/assessment');
    } finally {
      setLoading(false);
    }
  };

  if (testId) {
    fetchTestData();
  }
}, [testId, navigate]);

const fetchQuestionBank = useCallback(async (
  type: 'mcq' | 'coding' | 'assignment'
) => {
  try {
    const response = await getQuestions(type, {
      search: debouncedSearch,
      subjectId: subjectFilter,
      isInProblemBank: true
    });

    const data: QuestionItem[] = response?.data || [];

    // ✅ store question bank
    setQuestionBankMap((prev) => ({
      ...prev,
      [type]: data
    }));

    // ✅ extract subjects safely
    const uniqueSubjects: string[] = Array.from(
      new Set(
        data
          .map((item) => item.subject_id)
          .filter((s): s is string => !!s && s.trim() !== "")
      )
    );

    uniqueSubjects.sort();
    setSubjects(uniqueSubjects);

  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}, [debouncedSearch, subjectFilter]);

useEffect(() => {
  fetchQuestionBank(activeQuestionTab);
}, [activeQuestionTab, debouncedSearch, subjectFilter, fetchQuestionBank]);


useEffect(() => {
  if (!formData?.questionRefs) return;

  const initialSelected: Record<string, string[]> = {};
  const initialEdited: Record<string, QuestionDraft> = {};

  const allSets = [
    ...questionBankMap.mcq.map((set) => ({ ...set, type: 'mcq' as const })),
    ...questionBankMap.coding.map((set) => ({ ...set, type: 'coding' as const })),
    ...questionBankMap.assignment.map((set) => ({ ...set, type: 'assignment' as const }))
  ];

  // wait until some data exists
  if (allSets.length === 0) return;

  const addToSelection = (ids: string[]) => {
    ids.forEach((id) => {
      allSets.forEach((set) => {
        if (
          set.questions?.some(
            (q) => (q.question_id || q._id) === id
          )
        ) {
          if (!initialSelected[set._id]) {
            initialSelected[set._id] = [];
          }
          initialSelected[set._id].push(id);
        }
      });
    });
  };

  addToSelection(formData.questionRefs?.mcqIds || []);
  addToSelection(formData.questionRefs?.codingIds || []);
  addToSelection(formData.questionRefs?.assignmentIds || []);

  getAllowedQuestionTypes(formData.type).forEach((type) => {
    const customById = new Map(
      (formData.customQuestions?.[type] || []).map((question) => [
        question.question_id,
        question as QuestionItem['questions'][number]
      ])
    );

    questionBankMap[type].forEach((set) => {
      set.questions?.forEach((question) => {
        const questionId = question.question_id || question._id || '';
        const customQuestion = customById.get(questionId);

        if (questionId && customQuestion) {
          initialEdited[makeQuestionKey(type, set._id, questionId)] = normalizeQuestion(
            customQuestion,
            questionId
          );
        }
      });
    });
  });

  // ✅ MERGE instead of overwrite
  setSelectedQuestions((prev) => {
    const updated = { ...prev };

    Object.entries(initialSelected).forEach(([setId, ids]) => {
      updated[setId] = Array.from(
        new Set([...(updated[setId] || []), ...ids])
      );
    });

    return updated;
  });
  setEditedQuestions((prev) => ({
    ...initialEdited,
    ...prev
  }));

}, [formData, questionBankMap]);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 400);

  return () => clearTimeout(timer);
}, [searchQuery]);



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

const makeQuestionKey = (type: QuestionType, setId: string, questionId: string) =>
  `${type}:${setId}:${questionId}`;

const normalizeQuestion = (
  question: QuestionItem['questions'][number],
  questionId: string
): QuestionDraft => ({
  question_id: questionId,
  question_text: question.question_text || question.title || '',
  title: question.title || '',
  options: question.options && question.options.length > 0 ? [...question.options] : ['', '', '', ''],
  correct_answer: question.correct_answer || '',
  marks: question.marks,
  difficulty: question.difficulty || 'medium',
  explanation: question.explanation || '',
  test_cases: (question.test_cases || []).map((testCase) => ({
    input: testCase.input || '',
    output: testCase.output || '',
    isHidden: Boolean(testCase.isHidden),
    enabled: true
  })),
  tags: question.tags || [],
  timeLimit: question.timeLimit,
  memoryLimit: question.memoryLimit,
  constraints: question.constraints || '',
  inputFormat: question.inputFormat || '',
  outputFormat: question.outputFormat || '',
  sampleInput: question.sampleInput || '',
  sampleOutput: question.sampleOutput || '',
  wordLimit: question.wordLimit ?? null,
  attachmentRequired: Boolean(question.attachmentRequired)
});

const openQuestionEditor = (
  type: QuestionType,
  setId: string,
  questionId: string,
  question: QuestionItem['questions'][number]
) => {
  const key = makeQuestionKey(type, setId, questionId);
  setEditingQuestion({
    type,
    setId,
    questionId,
    draft: editedQuestions[key] || normalizeQuestion(question, questionId)
  });
};

const updateEditingDraft = (updates: Partial<QuestionDraft>) => {
  setEditingQuestion((current) =>
    current ? { ...current, draft: { ...current.draft, ...updates } } : current
  );
};

const updateEditingOption = (index: number, value: string) => {
  setEditingQuestion((current) => {
    if (!current) return current;
    const options = [...current.draft.options];
    options[index] = value;
    return { ...current, draft: { ...current.draft, options } };
  });
};

const updateEditingTestCase = (index: number, updates: Partial<TestCaseDraft>) => {
  setEditingQuestion((current) => {
    if (!current) return current;
    const testCases = current.draft.test_cases.map((testCase, testCaseIndex) =>
      testCaseIndex === index ? { ...testCase, ...updates } : testCase
    );
    return { ...current, draft: { ...current.draft, test_cases: testCases } };
  });
};

const addEditingTestCase = () => {
  setEditingQuestion((current) => {
    if (!current) return current;
    return {
      ...current,
      draft: {
        ...current.draft,
        test_cases: [
          ...current.draft.test_cases,
          { input: '', output: '', isHidden: false, enabled: true }
        ]
      }
    };
  });
};

const removeEditingTestCase = (index: number) => {
  setEditingQuestion((current) => {
    if (!current) return current;
    return {
      ...current,
      draft: {
        ...current.draft,
        test_cases: current.draft.test_cases.filter((_, testCaseIndex) => testCaseIndex !== index)
      }
    };
  });
};

const saveQuestionEdits = () => {
  if (!editingQuestion) return;

  const key = makeQuestionKey(
    editingQuestion.type,
    editingQuestion.setId,
    editingQuestion.questionId
  );

  setEditedQuestions((prev) => ({
    ...prev,
    [key]: editingQuestion.draft
  }));
  setEditingQuestion(null);
};

const buildCustomQuestions = () => {
  const customQuestions = {
    mcq: [] as QuestionDraft[],
    coding: [] as QuestionDraft[],
    assignment: [] as QuestionDraft[]
  };

  getAllowedQuestionTypes(formData.type).forEach((type) => {
    questionBankMap[type].forEach((set) => {
      const selected = selectedQuestions[set._id] || [];

      set.questions.forEach((question) => {
        const questionId = question.question_id || question._id || '';
        if (!questionId || !selected.includes(questionId)) return;

        const key = makeQuestionKey(type, set._id, questionId);
        const draft = editedQuestions[key] || normalizeQuestion(question, questionId);

        if (type === 'mcq') {
          customQuestions.mcq.push(draft);
        } else if (type === 'coding') {
          customQuestions.coding.push({
            ...draft,
            test_cases: draft.test_cases
              .filter((testCase) => testCase.enabled && testCase.input.trim() && testCase.output.trim())
              .map((testCase) => ({ ...testCase, enabled: true }))
          });
        } else {
          customQuestions.assignment.push(draft);
        }
      });
    });
  });

  return customQuestions;
};

//   const handleAddQuestion = async (question: QuestionItem) => {
//   try {
//     const key =
//       activeQuestionTab === 'mcq'
//         ? 'mcqIds'
//         : activeQuestionTab === 'coding'
//         ? 'codingIds'
//         : 'assignmentIds';

//     if (isSelected(question._id)) return;

//     await addQuestionToSet(activeQuestionTab, testId!, {
//       question_id: question._id,
//       title: 'Selected Question'
//     });

//     setFormData((prev) => ({
//       ...prev,
//       questionRefs: {
//         ...prev.questionRefs!,
//         [key]: [
//           ...((prev.questionRefs?.[key] as string[]) || []),
//           question._id
//         ]
//       }
//     }));
//   } catch (error) {
//     console.error('Error adding question:', error);
//   }
// };

// const handleRemoveQuestion = async (questionId: string) => {
//   try {
//     const key =
//       activeQuestionTab === 'mcq'
//         ? 'mcqIds'
//         : activeQuestionTab === 'coding'
//         ? 'codingIds'
//         : 'assignmentIds';

//     await removeQuestionFromSet(
//       activeQuestionTab,
//       testId!,
//       questionId
//     );

//     setFormData((prev) => ({
//       ...prev,
//       questionRefs: {
//         ...prev.questionRefs!,
//         [key]: ((prev.questionRefs?.[key] as string[]) || []).filter(
//           (id) => id !== questionId
//         )
//       }
//     }));
//   } catch (error) {
//     console.error('Error removing question:', error);
//   }
// };
const toggleQuestionSelection = (setId: string, questionId: string) => {
  setSelectedQuestions((prev) => {
    const existing = prev[setId] || [];

    let updated;

    if (existing.includes(questionId)) {
      // remove
      updated = existing.filter((id) => id !== questionId);
    } else {
      // add (NO DUPLICATE)
      updated = [...existing, questionId];
    }

    return {
      ...prev,
      [setId]: updated
    };
  });
};



// const isSelected = (questionId: string) => {
//   const key =
//     activeQuestionTab === 'mcq'
//       ? 'mcqIds'
//       : activeQuestionTab === 'coding'
//       ? 'codingIds'
//       : 'assignmentIds';

//   return ((formData.questionRefs?.[key] as string[]) || []).includes(questionId);
// };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const rawMcqIds: string[] = [];
const rawCodingIds: string[] = [];
const rawAssignmentIds: string[] = [];

getAllowedQuestionTypes(formData.type).forEach((type) => {
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
const totalSelected =
  mcqIds.length + codingIds.length + assignmentIds.length;

if (totalSelected === 0) {
  alert("Please select at least one question.");
  setSaving(false);
  return;
}

const updatedData = {
  ...formData,
  questionRefs: {
    mcqIds: formData.type === 'assignment' ? [] : mcqIds,
    codingIds: formData.type === 'assignment' ? [] : codingIds,
    assignmentIds: formData.type === 'assessment' ? [] : assignmentIds
  },
  customQuestions: buildCustomQuestions(),
  marksAllocation: {
    mcq: formData.type === 'assignment' ? 0 : formData.marksAllocation?.mcq || 0,
    coding: formData.type === 'assignment' ? 0 : formData.marksAllocation?.coding || 0,
    assignment: formData.type === 'assessment' ? 0 : formData.marksAllocation?.assignment || 0
  },
  settings: formData.type === 'assignment'
    ? {
        allowLateSubmission: false,
        showResultsImmediately: false,
        randomizeQuestions: false,
        enableProctoring: false
      }
    : formData.settings,
  instructions: formData.type === 'assignment' ? '' : formData.instructions || ''
};

await updateTest(testId!, updatedData); 
      navigate('/faculty-dashboard/assessment');
    } catch (error) {
      console.error('Error updating test:', error);
      alert('Failed to update test. Please try again.');
    } finally {
      setSaving(false);
    }
  };

//   const totalSelected =
//   mcqIds.length + codingIds.length + assignmentIds.length;

// if (totalSelected === 0) {
//   alert("Please select at least one question.");
//   setLoading(false);
//   return;
// }

const selectedTestType = formData.type || 'assessment';
const allowedQuestionTypes = getAllowedQuestionTypes(selectedTestType);
const showMcqMarks = selectedTestType !== 'assignment';
const showCodingMarks = selectedTestType !== 'assignment';
const showAssignmentMarks = selectedTestType !== 'assessment';
const showTestSettings = selectedTestType !== 'assignment';
const showInstructions = selectedTestType !== 'assignment';

useEffect(() => {
  const allowedTypes = getAllowedQuestionTypes(selectedTestType);
  if (!allowedTypes.includes(activeQuestionTab)) {
    setActiveQuestionTab(allowedTypes[0]);
  }
}, [activeQuestionTab, selectedTestType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }
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
  const allIds = allowedQuestionTypes.flatMap((type) =>
    questionBankMap[type].flatMap((set) => selectedQuestions[set._id] || [])
  );
  return new Set(allIds).size;
};

const buildPreviewData = () => {
const result = {
  mcq: [] as QuestionDraft[],
  coding: [] as QuestionDraft[],
  assignment: [] as QuestionDraft[]
};

  getAllowedQuestionTypes(formData.type).forEach((type) => {
    questionBankMap[type].forEach((set) => {
      const selected = selectedQuestions[set._id] || [];

      set.questions.forEach((q) => {
        const qid = q.question_id || q._id || '';

        if (selected.includes(qid)) {
          const key = makeQuestionKey(type, set._id, qid);
          result[type].push(editedQuestions[key] || normalizeQuestion(q, qid));
        }
      });
    });
  });

  return result;
};

const previewData = buildPreviewData();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Edit Test</h1>
          <p className="text-gray-400 mt-1">Update test configuration and settings</p>
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
              value={formData.scheduledStart ? new Date(formData.scheduledStart).toISOString().slice(0, 16) : ''}
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
              value={formData.scheduledEnd ? new Date(formData.scheduledEnd).toISOString().slice(0, 16) : ''}
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

        <div className={`grid grid-cols-1 gap-4 ${selectedTestType === 'assignment' ? 'md:grid-cols-2' : selectedTestType === 'assessment' ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
          {showMcqMarks && (
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
          )}

          {showCodingMarks && (
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
          )}

          {showAssignmentMarks && (
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
          )}

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
      {showTestSettings && (
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
      )}

      {/* Instructions */}
      {showInstructions && (
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
      )}

      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 space-y-4">
  <h2 className="text-xl font-semibold text-gray-100">Question Builder</h2>

{/* Tabs */}
<div className="flex gap-2">
  {allowedQuestionTypes.map((tab) => (
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

{/* Search + Filter */}
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
    className="px-3 py-2 bg-neutral-700 text-white rounded-lg min-w-45"
  >
    <option value="">All Subjects</option>
    {subjects.map((subj) => (
      <option key={subj} value={subj}>
        {subj}
      </option>
    ))}
  </select>
</div>

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

<div className="space-y-4 max-h-96 overflow-y-auto">
  
  {questionBankMap[activeQuestionTab].length === 0 ? (
    <p className="text-gray-400">No questions available</p>
  ) : (
    questionBankMap[activeQuestionTab].map((set) => (
      <div
        key={set._id}
        className="bg-neutral-900 border border-neutral-700 rounded-lg p-4"
      >
        <h3 className="text-gray-300 font-semibold mb-3">
          Test ID: {set.test_id}
        </h3>

        <div className="space-y-2">
  {set.questions?.map((q, index) => {
    const qid = q.question_id || q._id || '';

    const checked =
      selectedQuestions[set._id]?.includes(qid) || false;
    const questionKey = makeQuestionKey(activeQuestionTab, set._id, qid);
    const editedQuestion = editedQuestions[questionKey];



    return (
      <div
        key={qid}
        className="flex items-start gap-3 text-gray-300"
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() =>
            toggleQuestionSelection(set._id, qid)
          }
          className="w-4 h-4 accent-blue-600 mt-1"
        />

        <div className="min-w-0 flex-1">
          <p className="break-words">
            Q{index + 1}. {editedQuestion?.question_text || q.question_text}
          </p>
          <p className="text-xs text-gray-500">
            Difficulty: {editedQuestion?.difficulty || q.difficulty || 'medium'}
            {editedQuestion ? ' - edited for this test' : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={() => openQuestionEditor(activeQuestionTab, set._id, qid, q)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-md"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      </div>
    );
  })}
</div>
      </div>
    ))
  )}
</div>
</div>

{editingQuestion && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-white">Edit Question</h2>
          <p className="text-sm text-gray-400">
            Changes are saved only inside this test.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditingQuestion(null)}
          className="p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Question Sentence
          </label>
          <textarea
            value={editingQuestion.draft.question_text}
            onChange={(e) => updateEditingDraft({ question_text: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-neutral-800 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            value={editingQuestion.draft.difficulty}
            onChange={(e) => updateEditingDraft({ difficulty: e.target.value as Difficulty })}
            className="w-full px-4 py-2 bg-neutral-800 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {editingQuestion.type === 'mcq' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Options
              </label>
              <div className="space-y-3">
                {editingQuestion.draft.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    value={option}
                    onChange={(e) => updateEditingOption(optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="w-full px-4 py-2 bg-neutral-800 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correct Answer
              </label>
              <input
                type="text"
                value={editingQuestion.draft.correct_answer}
                onChange={(e) => updateEditingDraft({ correct_answer: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {editingQuestion.type === 'coding' && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-100">Test Cases</h3>
              <button
                type="button"
                onClick={addEditingTestCase}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Test Case
              </button>
            </div>

            <div className="space-y-4">
              {editingQuestion.draft.test_cases.map((testCase, testCaseIndex) => (
                <div
                  key={testCaseIndex}
                  className="border border-neutral-700 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={testCase.enabled}
                        onChange={(e) =>
                          updateEditingTestCase(testCaseIndex, { enabled: e.target.checked })
                        }
                      />
                      Include in this test
                    </label>
                    <button
                      type="button"
                      onClick={() => removeEditingTestCase(testCaseIndex)}
                      className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Input</label>
                      <textarea
                        value={testCase.input}
                        onChange={(e) =>
                          updateEditingTestCase(testCaseIndex, { input: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 bg-neutral-800 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Expected Output</label>
                      <textarea
                        value={testCase.output}
                        onChange={(e) =>
                          updateEditingTestCase(testCaseIndex, { output: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 bg-neutral-800 text-gray-100 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={testCase.isHidden}
                      onChange={(e) =>
                        updateEditingTestCase(testCaseIndex, { isHidden: e.target.checked })
                      }
                    />
                    Hidden test case
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setEditingQuestion(null)}
            className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveQuestionEdits}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{showPreview && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-neutral-900 p-6 rounded-lg w-200 max-h-[90vh] overflow-y-auto">

      <h2 className="text-xl font-semibold mb-4 text-white">
        Test Preview
      </h2>

      {/* Instructions */}
      <div className="mb-4">
        <h3 className="text-gray-300 font-medium">Instructions</h3>
        <p className="text-gray-400">{formData.instructions}</p>
      </div>

      {/* Questions */}
      {allowedQuestionTypes.map((type) => {
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
          onClick={() => {
  setShowPreview(false);
  handleSubmit();
}}
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
          disabled={saving}
          className="px-6 py-2 text-gray-300 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowPreview(true)}
          disabled={saving || !formData.title || !formData.subjectId || getTotalSelectedCount() === 0}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}





