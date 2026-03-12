type Question = {
    question_id: string;
    question_text: string;
};

type Assignment = {
    test_id: string;
    subject_id: string;
    num_questions: number;
    questions: Question[];
};

import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Send, AlertCircle, Upload, File, X, Download } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";


export const AssignmentDetail = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 🔹 Fetch assignment from backend
    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5002/v1/assignment/${assignmentId}`
                );

                setAssignment(res.data.data);
            } catch (error) {
                console.error("Failed to load assignment", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    if (loading) {
        return <div className="p-8 text-center text-neutral-300">Loading assignment...</div>;
    }

    if (!assignment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 bg-neutral-800 rounded-xl border border-neutral-700 p-8">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-neutral-100 mb-2">Assignment Not Found</h2>
                <p className="text-neutral-400 mb-6">The assignment you're looking for doesn't exist.</p>
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

        console.log('Submitted file:', uploadedFile);
        alert('Assignment submitted successfully!');
        navigate('/dashboard/assignments');
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const handleDownloadPDF = () => {
        if (!assignment) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxLineWidth = pageWidth - 2 * margin;
        let yPosition = 20;

        // Add title
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(assignment.test_id, margin, yPosition);
        yPosition += 10;

        // Add subject
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Subject: ${assignment.subject_id}`, margin, yPosition);
        yPosition += 15;

        // Add questions header
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Questions", margin, yPosition);
        yPosition += 10;

        // Add each question
        doc.setFontSize(11);
        assignment.questions.forEach((question, index) => {
            // Check if we need a new page
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            // Question number
            doc.setFont("helvetica", "bold");
            doc.text(`${index + 1}.`, margin, yPosition);

            // Question text (wrapped)
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(question.question_text, maxLineWidth - 10);
            doc.text(lines, margin + 8, yPosition);
            yPosition += lines.length * 7 + 10;
        });

        // Download the PDF
        doc.save(`${assignment.test_id}-Assignment.pdf`);
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between bg-neutral-800 backdrop-blur-sm py-4 px-6 rounded-xl border border-neutral-700">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/assignments')}
                        className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-300"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-100">{assignment.test_id}</h1>
                        <p className="text-sm text-neutral-400">Subject: {assignment.subject_id}</p>
                    </div>
                </div>
                <button 
                    onClick={handleDownloadPDF}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-linear-to-br from-neutral-700 to-neutral-800 text-neutral-100 text-sm font-medium tracking-wide rounded-md hover:from-neutral-600 hover:to-neutral-700 transition-all duration-200"
                >
                    <Download size={16} />
                    Download PDF
                </button>
            </div>

            {/* Questions */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-neutral-100">Questions</h3>
                    <span className="text-sm text-neutral-300 bg-neutral-700 px-3 py-1 rounded-full">
                        {assignment.num_questions} Question{assignment.num_questions > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="space-y-5">
                    {assignment.questions.map((question: Question, index: number) => (
                        <div
                            key={question.question_id}
                            className="flex items-start gap-4 pb-5 border-b border-neutral-700 last:border-b-0"
                        >
                            <div className="shrink-0 w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">{index + 1}</span>
                            </div>
                            <p className="flex-1 text-neutral-100 leading-relaxed pt-1">
                                {question.question_text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-neutral-800 rounded-xl border-2 border-dashed border-neutral-600 p-8">
                <h3 className="text-lg font-semibold text-neutral-100 mb-4">Upload Your Assignment</h3>

                {!uploadedFile ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Upload className="text-orange-600 mb-4" size={32} />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Choose PDF File
                        </label>
                    </div>
                ) : (
                    <div className="bg-neutral-700 rounded-lg p-6 border border-neutral-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <File className="text-red-500" size={24} />
                                <div>
                                    <p className="font-medium text-neutral-100">{uploadedFile.name}</p>
                                    <p className="text-sm text-neutral-400">{formatFileSize(uploadedFile.size)}</p>
                                </div>
                            </div>
                            <button onClick={handleRemoveFile} className="text-neutral-400 hover:text-neutral-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4 pb-8">
                <button
                    onClick={handleSubmit}
                    disabled={!uploadedFile}
                    className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={18} />
                    Submit Assignment
                </button>
            </div>
        </div>
    );
};