
import { useParams, useNavigate } from "react-router";
import { dummyAssignments } from "@/data/dummy-data";
import { ArrowLeft, Send, FileText, AlertCircle, Upload, File, X, Download } from "lucide-react";
import { useState, useRef } from "react";

export const AssignmentDetail = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const assignment = dummyAssignments.find(a => a.test_id === assignmentId);

    if (!assignment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 bg-white rounded-xl border border-gray-200 p-8">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Not Found</h2>
                <p className="text-gray-600 mb-6">The assignment you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/dashboard/assignments')}
                    className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Back to Assignments
                </button>
            </div>
        );
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file);
        } else {
            alert('Please select a PDF file');
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = () => {
        if (!uploadedFile) {
            alert('Please upload your assignment PDF before submitting');
            return;
        }
        // Handle submission logic here
        console.log('Submitted file:', uploadedFile);
        alert('Assignment submitted successfully!');
        navigate('/dashboard/assignments');
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className="space-y-6">
            {/* Header with Back Button and Submit */}
            <div className="flex items-center justify-between backdrop-blur-sm py-4 px-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/assignments')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{assignment.test_id}</h1>
                        <p className="text-sm text-gray-600">Subject: {assignment.subject_id}</p>
                    </div>
                </div>
                <button
                    className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-linear-to-br from-neutral-700 to-neutral-800 text-neutral-100 text-sm font-medium tracking-wide rounded-md transition-all duration-200"
                >
                    <Download size={16} />
                    Download PDF
                </button>

            </div>

            {/* Questions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Questions</h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {assignment.num_questions} Question{assignment.num_questions > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="space-y-6">
                    {assignment.questions.map((question, index) => (
                        <div
                            key={question.question_id}
                            className="pb-6 border-b border-gray-200 last:border-b-0"
                        >
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-600 font-semibold text-sm">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText size={16} className="text-gray-400" />
                                        <span className="text-xs font-medium text-gray-500">
                                            Question ID: {question.question_id}
                                        </span>
                                    </div>
                                    <p className="text-base text-gray-900 leading-relaxed">
                                        {question.question_text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Assignment</h3>

                {!uploadedFile ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="text-orange-600" size={32} />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Upload PDF File</h4>
                        <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
                            Click the button below to select your completed assignment in PDF format
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
                        >
                            Choose PDF File
                        </label>
                        <p className="text-xs text-gray-500 mt-3">Maximum file size: 10MB</p>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <File className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                                    <p className="text-sm text-gray-600">{formatFileSize(uploadedFile.size)}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveFile}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Remove file"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-green-600 font-medium">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            File uploaded successfully! Click "Submit Assignment" to submit.
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Submit Button */}
            <div className="flex justify-end pt-4 pb-8">
                <button
                    onClick={handleSubmit}
                    disabled={!uploadedFile}
                    className={`flex items-center gap-2 px-8 py-3 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${uploadedFile
                        ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <Send size={18} />
                    Submit Assignment
                </button>
            </div>
        </div>
    );
}
