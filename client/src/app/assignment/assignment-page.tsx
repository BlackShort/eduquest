import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getAllTests } from "@/apis/test-api";
import { ArrowRight, Calendar, Clock, FileText } from "lucide-react";

type Assignment = {
  _id: string;
  title: string;
  subjectId: string;
  durationMinutes: number;
  totalMarks?: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  questionRefs?: {
    assignmentIds?: string[];
  };
};

export const Assignment = () => {

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  useEffect(() => {

    const fetchAssignments = async () => {
      try {

        const res = await getAllTests();

        const list = res.data?.data || [];
        setAssignments(list.filter((test: Assignment & { type?: string }) => test.type === "assignment"));

      } catch (error) {
        console.error("Failed to load assignments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();

  }, []);

  if (loading) {
    return <div className="p-8 text-center text-neutral-300">Loading assignments...</div>;
  }

  return (

    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-100">Assignments</h1>
          <p className="text-neutral-400 mt-1">
            Complete your assignments and track your progress
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <FileText size={20} />
          <span className="font-medium">
            {assignments.length} Total Assignments
          </span>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {assignments.map((assignment) => (

          <Link
            key={assignment._id}
            to={`/assignments/${assignment._id}`}
            className="group bg-white/2 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-200 block"
          >
            {/* Header */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium tracking-wide text-white leading-snug mb-0.5">
                      {assignment.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      Subject: {assignment.subjectId}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-neutral-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-0.5"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-white/5 grid grid-cols-3">
              {[
                { label: "Questions", value: assignment.questionRefs?.assignmentIds?.length || 0 },
                { label: "Duration", value: `${assignment.durationMinutes} mins` },
                { label: "Marks", value: assignment.totalMarks || 0 },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`px-5 py-2.5 flex flex-col gap-1 ${i < 2 ? "border-r border-white/5" : ""}`}
                >
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <span className="text-[13px] font-semibold text-neutral-200">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Dates */}
            <div className="border-t border-white/5 px-5 py-2.5 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
                <Calendar size={12} />
                Starts: {formatDate(assignment.scheduledStart || "")}
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
                <Clock size={12} />
                Ends: {formatDate(assignment.scheduledEnd || "")}
              </div>
            </div>
          </Link>
        ))}

      </div>

      {/* Empty state */}
      {assignments.length === 0 && (

        <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">

          <FileText className="mx-auto text-neutral-500 mb-4" size={48} />

          <h3 className="text-lg font-semibold text-neutral-200 mb-2">
            No Assignments Yet
          </h3>

          <p className="text-neutral-400">
            Check back later for new assignments
          </p>

        </div>

      )}

    </div>
  );
};
