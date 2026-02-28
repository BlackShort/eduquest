import { useState } from 'react';
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
import type { Test } from '@/types/types';

export default function CreateTestPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (publishNow = false) => {
    try {
      setLoading(true);
      const status: 'draft' | 'published' | 'archived' = publishNow ? 'published' : 'draft';
      const dataToSubmit: Partial<Test> = {
        ...formData,
        status
      };
      
      await createTest(dataToSubmit);
      navigate('/faculty-dashboard/assessment');
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Failed to create test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          disabled={loading || !formData.title || !formData.subjectId}
          className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save as Draft
        </button>
        <button
          onClick={() => handleSubmit(true)}
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





