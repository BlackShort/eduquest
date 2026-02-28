import { useState } from 'react';
import { Download, Info } from 'lucide-react';
import CSVUploadComponent from '@/components/dashboard/CSVUploadComponent';
import { uploadMCQCSV, uploadCodingCSV, uploadAssignmentCSV } from '@/apis/faculty-api';

type UploadTab = 'mcq' | 'coding' | 'assignment';

export default function BulkImportPage() {
  const [activeTab, setActiveTab] = useState<UploadTab>('mcq');

  const handleMCQUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadMCQCSV(formData);
      return {
        success: true,
        message: `Successfully uploaded ${response.data.count} MCQ questions`,
        data: {
          details: [
            `Total questions: ${response.data.count}`,
            `Success: ${response.data.success}`,
            response.data.failed > 0 ? `Failed: ${response.data.failed}` : ''
          ].filter(d => d !== '')
        }
      };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string; errors?: string[] } } };
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to upload MCQ CSV',
        data: {
          errors: err.response?.data?.errors || ['Unknown error occurred']
        }
      };
    }
  };

  const handleCodingUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadCodingCSV(formData);
      return {
        success: true,
        message: `Successfully uploaded ${response.data.count} coding problems`,
        data: {
          details: [
            `Total problems: ${response.data.count}`,
            `Success: ${response.data.success}`,
            response.data.failed > 0 ? `Failed: ${response.data.failed}` : ''
          ].filter(d => d !== '')
        }
      };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string; errors?: string[] } } };
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to upload Coding CSV',
        data: {
          errors: err.response?.data?.errors || ['Unknown error occurred']
        }
      };
    }
  };

  const handleAssignmentUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadAssignmentCSV(formData);
      return {
        success: true,
        message: `Successfully uploaded ${response.data.count} assignment questions`,
        data: {
          details: [
            `Total questions: ${response.data.count}`,
            `Success: ${response.data.success}`,
            response.data.failed > 0 ? `Failed: ${response.data.failed}` : ''
          ].filter(d => d !== '')
        }
      };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string; errors?: string[] } } };
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to upload Assignment CSV',
        data: {
          errors: err.response?.data?.errors || ['Unknown error occurred']
        }
      };
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Bulk Import</h1>
        <p className="text-gray-400">
          Upload CSV files to add multiple questions at once
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-900/20 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Before you upload:</p>
            <ul className="space-y-1">
              <li>• Download the appropriate CSV template for your question type</li>
              <li>• Fill in all required fields according to the format guide</li>
              <li>• Validate your data to avoid upload errors</li>
              <li>• Maximum file size is 10MB per upload</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-700">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('mcq')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'mcq'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            MCQ Questions
          </button>
          <button
            onClick={() => setActiveTab('coding')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'coding'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Coding Problems
          </button>
          <button
            onClick={() => setActiveTab('assignment')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'assignment'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Assignment Questions
          </button>
        </div>
      </div>

      {/* Upload Component */}
      <div className="mt-6">
        {activeTab === 'mcq' && (
          <CSVUploadComponent
            uploadType="mcq"
            onUpload={handleMCQUpload}
            templateUrl="/api/faculty/template/mcq"
          />
        )}
        {activeTab === 'coding' && (
          <CSVUploadComponent
            uploadType="coding"
            onUpload={handleCodingUpload}
            templateUrl="/api/faculty/template/coding"
          />
        )}
        {activeTab === 'assignment' && (
          <CSVUploadComponent
            uploadType="assignment"
            onUpload={handleAssignmentUpload}
            templateUrl="/api/faculty/template/assignment"
          />
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/api/faculty/template/mcq"
            download
            className="flex items-center gap-3 p-4 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-100">MCQ Template</p>
              <p className="text-sm text-gray-400">Download CSV template</p>
            </div>
          </a>

          <a
            href="/api/faculty/template/coding"
            download
            className="flex items-center gap-3 p-4 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <div className="p-2 bg-green-900/20 rounded-lg">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-100">Coding Template</p>
              <p className="text-sm text-gray-400">Download CSV template</p>
            </div>
          </a>

          <a
            href="/api/faculty/template/assignment"
            download
            className="flex items-center gap-3 p-4 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <div className="p-2 bg-purple-900/20 rounded-lg">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-100">Assignment Template</p>
              <p className="text-sm text-gray-400">Download CSV template</p>
            </div>
          </a>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Best Practices for CSV Upload
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-100 mb-2">Data Formatting</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Use UTF-8 encoding for special characters</li>
              <li>• Enclose text with commas in quotes</li>
              <li>• Use consistent date formats (YYYY-MM-DD)</li>
              <li>• Keep field values within character limits</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-100 mb-2">Quality Control</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Review data for accuracy before upload</li>
              <li>• Remove duplicate entries</li>
              <li>• Validate test cases for coding problems</li>
              <li>• Check difficulty levels and marks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}





