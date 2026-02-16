import { ProblemList } from "./problem-list"

export const ProblemCategory = () => {
    return (
        <div className="flex justify-center py-10">
            <div className="flex gap-10 w-full max-w-5xl">
                <div className="w-md min-h-96 h-max bg-neutral-800 rounded-lg border border-neutral-700 p-6"></div>
                <ProblemList />
            </div>
        </div>
    )
}
