import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Download, FileText } from 'lucide-react';

interface UploadResult {
    success: boolean;
    message: string;
    data?: {
        details?: string[];
        errors?: string[];
    };
}

interface CSVUploadProps {
    uploadType: 'mcq' | 'coding' | 'assignment';
    onUpload: (file: File) => Promise<UploadResult>;
    templateUrl?: string;
}

interface UploadStatus {
    status: 'idle' | 'uploading' | 'success' | 'error';
    message: string;
    details?: string[];
}

export default function CSVUploadComponent({ uploadType, onUpload, templateUrl }: CSVUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
        status: 'idle',
        message: ''
    });
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const typeLabels = {
        mcq: 'MCQ Questions',
        coding: 'Coding Problems',
        assignment: 'Assignment Questions'
    };

    const templateUrls = {
        mcq: templateUrl || '/templates/sample_mcq.csv',
        coding: templateUrl || '/templates/sample_coding.csv',
        assignment: templateUrl || '/templates/sample_assignment.csv'
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        // Validate file type
        if (!file.name.endsWith('.csv')) {
            setUploadStatus({
                status: 'error',
                message: 'Invalid file type. Please upload a CSV file.'
            });
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setUploadStatus({
                status: 'error',
                message: 'File too large. Maximum size is 10MB.'
            });
            return;
        }

        setSelectedFile(file);
        setUploadStatus({
            status: 'idle',
            message: ''
        });
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setUploadStatus({
                status: 'uploading',
                message: 'Uploading and processing CSV file...'
            });

            const result = await onUpload(selectedFile);

            if (result.success) {
                setUploadStatus({
                    status: 'success',
                    message: result.message || 'File uploaded successfully!',
                    details: result.data?.details
                });
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setUploadStatus({
                    status: 'error',
                    message: result.message || 'Upload failed',
                    details: result.data?.errors
                });
            }
        } catch (error) {
            const err = error as { message?: string; response?: { data?: { errors?: string[] } } };
            setUploadStatus({
                status: 'error',
                message: 'Upload failed: ' + (err.message || 'Unknown error'),
                details: err.response?.data?.errors
            });
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadStatus({
            status: 'idle',
            message: ''
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">
                    Upload {typeLabels[uploadType]}
                </h3>
                <a
                    href={templateUrls[uploadType]}
                    download
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                    <Download className="w-4 h-4" />
                    Download Template
                </a>
            </div>

            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-neutral-600 hover:border-neutral-500'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                />

                {!selectedFile ? (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-300 font-medium mb-1">
                                Drag and drop your CSV file here
                            </p>
                            <p className="text-sm text-gray-400">or</p>
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Files
                        </button>
                        <p className="text-xs text-gray-400">
                            Maximum file size: 10MB
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div className="text-left">
                                <p className="font-medium text-gray-100">{selectedFile.name}</p>
                                <p className="text-sm text-gray-400">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                            <button
                                onClick={handleRemoveFile}
                                className="p-1 hover:bg-neutral-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={uploadStatus.status === 'uploading'}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
                        >
                            {uploadStatus.status === 'uploading' ? 'Uploading...' : 'Upload CSV'}
                        </button>
                    </div>
                )}
            </div>

            {/* Status Messages */}
            {uploadStatus.message && (
                <div className="mt-4">
                    {uploadStatus.status === 'uploading' && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <p className="text-blue-800">{uploadStatus.message}</p>
                        </div>
                    )}

                    {uploadStatus.status === 'success' && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-green-800 font-medium">{uploadStatus.message}</p>
                                    {uploadStatus.details && uploadStatus.details.length > 0 && (
                                        <ul className="mt-2 space-y-1 text-sm text-green-700">
                                            {uploadStatus.details.map((detail, index) => (
                                                <li key={index}>• {detail}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {uploadStatus.status === 'error' && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-red-800 font-medium">{uploadStatus.message}</p>
                                    {uploadStatus.details && uploadStatus.details.length > 0 && (
                                        <ul className="mt-2 space-y-1 text-sm text-red-700">
                                            {uploadStatus.details.map((detail, index) => (
                                                <li key={index}>• {detail}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Format Guide */}
            <div className="mt-6 p-4 bg-neutral-700 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-100 mb-2">CSV Format Guide</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                    {uploadType === 'mcq' && (
                        <>
                            <li>• First row should contain headers</li>
                            <li>• Required columns: question, optionA, optionB, optionC, optionD, correctAnswer, difficulty, marks</li>
                            <li>• Optional columns: tags, explanation</li>
                        </>
                    )}
                    {uploadType === 'coding' && (
                        <>
                            <li>• First row should contain headers</li>
                            <li>• Required columns: title, description, difficulty, timeLimit, memoryLimit, testCases, marks</li>
                            <li>• Optional columns: tags, constraints, sampleInput, sampleOutput</li>
                        </>
                    )}
                    {uploadType === 'assignment' && (
                        <>
                            <li>• First row should contain headers</li>
                            <li>• Required columns: question, description, difficulty, marks</li>
                            <li>• Optional columns: tags, attachments, rubric</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}


