import { Link } from "react-router";
import { dummyCoding } from "@/data/dummy-data";

export const ProblemList = () => {
  // Flatten all questions from all coding tests
  const allProblems = dummyCoding.flatMap((codingTest) =>
    codingTest.questions.map((question, index) => ({
      id: question.question_id,
      title: question.question_text,
      testCases: question.test_cases.length,
      testId: codingTest.test_id,
      number: index + 1,
    }))
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Problem List</h1>
        <p className="text-gray-600">
          {allProblems.length} coding problems available
        </p>
      </div>

      <div className="space-y-3">
        {allProblems.map((problem, idx) => (
          <Link
            key={problem.id}
            to={`/problems/${problem.id}`}
            className="block p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-gray-500">
                    #{idx + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {problem.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>ID: {problem.id}</span>
                  <span>•</span>
                  <span>{problem.testCases} test cases</span>
                </div>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Coding
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
