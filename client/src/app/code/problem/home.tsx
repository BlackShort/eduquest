import { useState } from "react";
import { Link } from "react-router";
import { Search, Filter, Lock } from "lucide-react";
import { dummyCoding } from "@/data/dummy-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Difficulty = "Easy" | "Medium" | "Hard";
type TopicCategory = "all" | "algorithms" | "database" | "shell" | "concurrency" | "javascript";

interface Problem {
  id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  acceptance: string;
  isPremium: boolean;
  category: TopicCategory;
}

export const ProblemHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");

  // Transform dummy data into problem list
  const allProblems: Problem[] = dummyCoding.flatMap((codingTest, testIdx) =>
    codingTest.questions.map((question, qIdx) => ({
      id: question.question_id,
      number: testIdx * 10 + qIdx + 1,
      title: question.question_text,
      difficulty: (["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as Difficulty),
      acceptance: `${(Math.random() * 40 + 30).toFixed(1)}%`,
      isPremium: Math.random() > 0.8,
      category: "algorithms" as TopicCategory,
    }))
  );

  // Filter problems
  const filteredProblems = allProblems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.number.toString().includes(searchQuery);
    const matchesTopic = selectedTopic === "all" || problem.category === selectedTopic;
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 dark:text-green-400";
      case "Medium": return "text-yellow-600 dark:text-yellow-400";
      case "Hard": return "text-red-600 dark:text-red-400";
    }
  };

  const topicCategories = [
    { value: "all", label: "All Topics" },
    { value: "algorithms", label: "🔧 Algorithms" },
    { value: "database", label: "💾 Database" },
    { value: "shell", label: "🐚 Shell" },
    { value: "concurrency", label: "⚡ Concurrency" },
    { value: "javascript", label: "📦 JavaScript" },
  ];

  const trendingCompanies = [
    { name: "Google", count: 231 },
    { name: "Uber", count: 335 },
    { name: "Meta", count: 1384 },
    { name: "Amazon", count: 1931 },
    { name: "Microsoft", count: 1546 },
    { name: "Apple", count: 360 },
    { name: "Bloomberg", count: 1170 },
    { name: "Oracle", count: 345 },
    { name: "LinkedIn", count: 178 },
    { name: "TikTok", count: 266 },
    { name: "Adobe", count: 335 },
    { name: "Salesforce", count: 169 },
    { name: "Citadel", count: 195 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Topic Filter Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {topicCategories.map((topic) => (
                <Button
                  key={topic.value}
                  variant={selectedTopic === topic.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTopic(topic.value as TopicCategory)}
                  className="whitespace-nowrap"
                >
                  {topic.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | "all")}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="all">All Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </div>
          </div>

          {/* Problem List Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredProblems.length} / {allProblems.length} questions
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                0/{allProblems.length} Solved
              </span>
              <div className="size-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">0 Redeem</span>
            </div>
          </div>

          {/* Problem List Table */}
          <div className="rounded-lg border bg-card">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
              <div className="col-span-1">Status</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2 text-center">Acceptance</div>
              <div className="col-span-2 text-center">Difficulty</div>
              <div className="col-span-2 text-center"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {filteredProblems.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No problems found matching your filters
                </div>
              ) : (
                filteredProblems.map((problem) => (
                  <Link
                    key={problem.id}
                    to={`/problems/${problem.id}`}
                    className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-muted/50 transition-colors items-center"
                  >
                    {/* Status */}
                    <div className="col-span-1">
                      <div className="size-4 rounded-full border-2 border-muted-foreground/30"></div>
                    </div>

                    {/* Title */}
                    <div className="col-span-5 flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {problem.number}.
                      </span>
                      <span className="text-sm font-medium hover:text-primary">
                        {problem.title}
                      </span>
                      {problem.isPremium && (
                        <Lock className="size-3 text-yellow-600" />
                      )}
                    </div>

                    {/* Acceptance */}
                    <div className="col-span-2 text-center text-sm">
                      {problem.acceptance}
                    </div>

                    {/* Difficulty */}
                    <div className="col-span-2 text-center">
                      <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    {/* Extra */}
                    <div className="col-span-2 text-center">
                      <Button variant="ghost" size="icon-sm">
                        <Lock className="size-3" />
                      </Button>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Trending Companies Sidebar */}
        <div className="hidden xl:block w-80 border-l p-6 bg-muted/20">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Trending Companies</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-xs">
                ‹
              </Button>
              <Button variant="ghost" size="icon-xs">
                ›
              </Button>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a company"
              className="h-8 pl-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {trendingCompanies.map((company) => (
              <Badge
                key={company.name}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 px-2.5 py-1"
              >
                {company.name}{" "}
                <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold">
                  {company.count}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
