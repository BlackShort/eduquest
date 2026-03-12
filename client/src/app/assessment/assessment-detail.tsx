import { useState, useEffect } from 'react';
import { Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProblemDetail } from '@/components/code/problem/problem';

interface AssessmentDetailProps {
  questionType: 'coding' | 'mcq';
  questionId: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onAnswerChange?: (questionId: string, answer: string) => void;
  savedAnswer?: string | null;
}

interface MCQOption {
  id: string;
  text: string;
}

interface MCQQuestionData {
  title: string;
  difficulty: string;
  question: string;
  options: MCQOption[];
}

// Dummy data for MCQ questions
const mcqQuestions: Record<string, MCQQuestionData> = {
  q_mcq_001: {
    title: 'Binary Search Complexity',
    difficulty: 'Medium',
    question: 'What is the time complexity of binary search?',
    options: [
      { id: 'a', text: 'O(n)' },
      { id: 'b', text: 'O(log n)' },
      { id: 'c', text: 'O(n^2)' },
      { id: 'd', text: 'O(1)' }
    ]
  },
  q_mcq_002: {
    title: 'Stack Data Structure',
    difficulty: 'Easy',
    question: 'Which data structure uses LIFO (Last In First Out)?',
    options: [
      { id: 'a', text: 'Queue' },
      { id: 'b', text: 'Stack' },
      { id: 'c', text: 'Array' },
      { id: 'd', text: 'Tree' }
    ]
  },
  q_mcq_003: {
    title: 'OOP Fundamentals',
    difficulty: 'Easy',
    question: 'What does OOP stand for?',
    options: [
      { id: 'a', text: 'Object-Oriented Programming' },
      { id: 'b', text: 'Only One Protocol' },
      { id: 'c', text: 'Open Operating Platform' },
      { id: 'd', text: 'Object Operation Process' }
    ]
  }
};

const MCQQuestion = ({ 
  data, 
  questionId,
  onNext, 
  onPrevious, 
  onAnswerChange,
  savedAnswer 
}: { 
  data: MCQQuestionData; 
  questionId: string;
  onNext?: () => void; 
  onPrevious?: () => void;
  onAnswerChange?: (questionId: string, answer: string) => void;
  savedAnswer?: string | null;
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(savedAnswer || null);

  // Sync with saved answer when question ID changes (user navigates to different question)
  useEffect(() => {
    if (selectedAnswer !== savedAnswer) {
      setSelectedAnswer(savedAnswer || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
    if (onAnswerChange) {
      onAnswerChange(questionId, optionId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{data.title}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              data.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
              data.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {data.difficulty}
            </span>
          </div>
          <p className="text-xl text-neutral-200 leading-relaxed">{data.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {data.options.map((option: MCQOption) => {
            const isSelected = selectedAnswer === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-white' : 'border-neutral-500'
                  }`}>
                    {isSelected && <Circle className="w-3 h-3 fill-current" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold mr-2">{option.id.toUpperCase()}.</span>
                    <span>{option.text}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-700">
          <Button
            onClick={onPrevious}
            disabled={!onPrevious}
            variant="outline"
            className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export const AssessmentDetail = ({ 
  questionType, 
  questionId, 
  onNext, 
  onPrevious, 
  onAnswerChange,
  savedAnswer 
}: AssessmentDetailProps) => {
  
  if (questionType === 'coding') {
    // Use ProblemDetail for coding questions
    return (
      <div className='h-full w-full overflow-hidden'>
        <ProblemDetail 
          problemId={questionId}
          onCodeChange={(code) => {
            console.log('Code changed:', code);
            if (onAnswerChange) {
              onAnswerChange(questionId, code);
            }
          }}
          onLanguageChange={(lang) => console.log('Language changed:', lang)}
        />
      </div>
    );
  }

  // For MCQ questions
  const data = mcqQuestions[questionId];

  if (!data) {
    return (
      <div className='rounded-md border border-neutral-800 bg-neutral-900 h-full w-full p-8 flex items-center justify-center'>
        <p className="text-neutral-400">Question not found</p>
      </div>
    );
  }

  return (
    <div className='rounded-md border border-neutral-800 bg-neutral-900 h-full w-full p-6 overflow-hidden'>
      <MCQQuestion 
        data={data} 
        questionId={questionId}
        onNext={onNext} 
        onPrevious={onPrevious}
        onAnswerChange={onAnswerChange}
        savedAnswer={savedAnswer}
      />
    </div>
  );
};
