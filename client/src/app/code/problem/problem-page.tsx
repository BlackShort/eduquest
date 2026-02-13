import { useState } from "react";
import { Link } from "react-router";
import { Search, Filter } from "lucide-react";
import { dummyQuestions } from "@/data/dummy-data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Difficulty = "Easy" | "Medium" | "Hard";

interface Problem {
  id: string;
  number: number;
  title: string;
  difficulty: string;
  acceptance: string;
  category: string;
}

export const ProblemHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");

  // Transform dummy data into problem list
  const allProblems: Problem[] = dummyQuestions.map((question) => ({
    id: question.question_id,
    number: question.number,
    title: question.question_text,
    difficulty: question.difficulty,
    acceptance: question.acceptance,
    category: question.category,
  })
  );

  // Filter problems
  const filteredProblems = allProblems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.number.toString().includes(searchQuery);
    const matchesTopic = selectedTopic === "all" || problem.category === selectedTopic;
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
    }
  };

  const topicCategories = [
    { value: "all", label: "All Topics" },
    { value: "array", label: "Array" },
    { value: "string", label: "String" },
    { value: "dynamic-programming", label: "Dynamic Programming" },
    { value: "tree", label: "Tree" },
    { value: "graph", label: "Graph" },
    { value: "database", label: "Database" },
    { value: "shell", label: "Shell" },


  ];

  const handleDifficultyChange = (newDifficulty: Difficulty | "all") => {
    setDifficultyFilter(newDifficulty);
  };

  return (
    <div className="flex justify-center py-8 px-4">
      {/* Main Content */}
      <div className="w-full max-w-5xl mx-auto">
        {/* Topic Filter Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2 overflow-x-auto scrollbar-hide">
            {topicCategories.map((topic) => (
              <Button
                key={topic.value}
                variant={selectedTopic === topic.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTopic(topic.value)}
                className={`cursor-pointer whitespace-nowrap rounded-full duration-300 transition-colors ${selectedTopic === topic.value
                    ? "bg-orange-600 text-white border-orange-500 hover:bg-orange-700"
                    : "text-neutral-200 hover:text-neutral-400 bg-neutral-700/50 border border-neutral-600 hover:border-neutral-500 hover:bg-neutral-600/50"
                  }`}
              >
                {topic.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-row items-center justify-between gap-3">
          <div className="flex gap-5">
            {/* Search Bar */}
            <div className="hidden border border-neutral-600 md:flex items-center gap-2 text-neutral-200 bg-neutral-700/50 rounded-full px-3 py-2 w-full max-w-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
              <Search className="w-5 h-5 text-neutral-600" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm tracking-wider w-full"
              />
            </div>

            <div className="flex gap-2">
              <Select value={difficultyFilter} onValueChange={handleDifficultyChange}>
                <SelectTrigger className="
                    cursor-pointer
                    w-max h-8 text-gray-300 text-sm 
                    border-neutral-600
                    focus:outline-none
                    focus:ring-0
                    focus-visible:outline-none
                    focus-visible:ring-0
                    focus-visible:ring-offset-0
                    ring-0
                    data-[state=open]:ring-0
                    data-[state=open]:outline-none
                    data-[state=open]:shadow-none"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2d2d2d] border-[#3a3a3a] text-gray-300">
                  <SelectItem value="all" className="hover:bg-[#3a3a3a]">All</SelectItem>
                  <SelectItem value="easy" className="hover:bg-[#3a3a3a]">Easy</SelectItem>
                  <SelectItem value="medium" className="hover:bg-[#3a3a3a]">Medium</SelectItem>
                  <SelectItem value="hard" className="hover:bg-[#3a3a3a]">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="default" size="icon" className="border border-neutral-600 cursor-pointer">
                <Filter className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between gap-5">
            <div className="text-sm text-neutral-300">
              {filteredProblems.length} / {allProblems.length} questions
            </div>
            <Badge variant={'success'} className="text-sm font-normal border-green-600 bg-green-500 text-neutral-100 rounded-full flex items-center gap-2">
              0/{allProblems.length} Solved
            </Badge>
          </div>
        </div>


        {/* Problem List Table */}
        <div className="rounded-lg border bg-neutral-700/50 border-neutral-600">
          {/* Table Body */}
          <div className="divide-y">
            {filteredProblems.length === 0 ? (
              <div className="py-12 text-center text-neutral-300">
                No problems found matching your filters
              </div>
            ) : (
              filteredProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problems/${problem.id}`}
                  className="border-neutral-600 grid grid-cols-12 gap-4 px-4 py-4 hover:bg-neutral-800/50 transition-colors items-center"
                >
                  {/* Status */}
                  <div className="col-span-1">
                    <div className="size-4 rounded-full border-2 border-neutral-600"></div>
                  </div>

                  {/* Title */}
                  <div className="col-span-7 flex items-center gap-3">
                    <span className="text-sm font-medium text-neutral-300">
                      {problem.number}.
                    </span>
                    <span className="text-sm font-medium text-neutral-200">
                      {problem.title}
                    </span>
                  </div>

                  {/* Acceptance */}
                  <div className="col-span-2 text-center text-sm text-neutral-300">
                    {problem.acceptance}
                  </div>

                  {/* Difficulty */}
                  <div className="col-span-2 text-center">
                    <span className={`text-sm capitalize font-normal ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
