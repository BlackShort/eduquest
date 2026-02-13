
import { Link } from "react-router";
import { dummyAssignments } from "@/data/dummy-data";
import { Calendar, Clock, FileText, ChevronRight } from "lucide-react";

export const Assignment = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Complete your assignments and track your progress</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText size={20} />
          <span className="font-medium">{dummyAssignments.length} Total Assignments</span>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-4">
        {dummyAssignments.map((assignment) => (
          <Link
            key={assignment._id}
            to={`/assignments/${assignment.test_id}`}
            className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Assignment Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <FileText className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {assignment.test_id}
                    </h3>
                    <p className="text-sm text-gray-500">Subject: {assignment.subject_id}</p>
                  </div>
                </div>

                {/* Questions Preview */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-700">
                    {assignment.num_questions} Question{assignment.num_questions > 1 ? 's' : ''}
                  </p>
                  {assignment.questions.slice(0, 2).map((question, idx) => (
                    <div key={question.question_id} className="text-sm text-gray-600 pl-3 border-l-2 border-gray-200">
                      {idx + 1}. {question.question_text.substring(0, 100)}{question.question_text.length > 100 ? '...' : ''}
                    </div>
                  ))}
                  {assignment.questions.length > 2 && (
                    <p className="text-xs text-gray-500 pl-3">+{assignment.questions.length - 2} more questions</p>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Created: {formatDate(assignment.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Updated: {formatDate(assignment.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="ml-4">
                <ChevronRight 
                  className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-200" 
                  size={24} 
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {dummyAssignments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments Yet</h3>
          <p className="text-gray-600">Check back later for new assignments</p>
        </div>
      )}
    </div>
  );
}
