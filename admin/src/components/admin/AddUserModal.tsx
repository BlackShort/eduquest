import { useState } from "react";
import { register } from "@/apis/auth-api";

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
    role: string;
    onSuccess: () => void;
}

const COURSES = [
    "B.Tech CSE",
    "B.Tech",
    "B.C.A",
    "M.C.A",
    "M.B.A",
    "B.B.A"
];

export default function AddUserModal({
    open,
    onClose,
    role,
    onSuccess
}: AddUserModalProps) {

    const [email, setEmail] = useState("");

    const [selectedCourse, setSelectedCourse] =
        useState("");

    const [selectedCourses, setSelectedCourses] =
        useState<string[]>([]);

    const [semester, setSemester] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    if (!open) return null;

    const handleCourseToggle = (
        course: string
    ) => {

        setSelectedCourses((prev) => {

            if (prev.includes(course)) {

                return prev.filter(
                    (c) => c !== course
                );

            }

            return [...prev, course];

        });

    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        setError("");

        e.preventDefault();

        try {

            setLoading(true);

            const username =
                email
                    .split("@")[0]
                    .split(".")[0];

            const password =
                `${username}@123`;

            const formattedCourses =
                role === "faculty"
                    ? selectedCourses
                    : selectedCourse
                        ? [selectedCourse]
                        : [];

            await register(
                email,
                password,
                formattedCourses,
                semester,
                role
            );

            await onSuccess();

            handleClose();

        } catch (error: any) {

            console.log(error);

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleClose = () => {

        setEmail("");

        setSelectedCourse("");

        setSelectedCourses([]);

        setSemester(1);

        setError("");

        onClose();

    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md p-6">

                <h2 className="text-2xl font-bold text-white mb-6">
                    Add User
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none"
                        required
                    />

                    {
                        role === "user" && (

                            <div>

                                <label className="block text-sm text-neutral-400 mb-2">
                                    Select Course
                                </label>

                                <div className="relative">

                                    <select
                                        value={selectedCourse}
                                        onChange={(e) =>
                                            setSelectedCourse(
                                                e.target.value
                                            )
                                        }
                                        className="
                w-full
                appearance-none
                bg-neutral-800
                border border-neutral-700
                rounded-xl
                px-4 py-3
                pr-12
                text-white
                outline-none
                focus:border-neutral-500
                transition-all
            "
                                        required
                                    >

                                        <option value="">
                                            Select course
                                        </option>

                                        {
                                            COURSES.map(
                                                (course) => (

                                                    <option
                                                        key={course}
                                                        value={course}
                                                        className="bg-neutral-900"
                                                    >
                                                        {course}
                                                    </option>

                                                )
                                            )
                                        }

                                    </select>

                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-neutral-400"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                            />
                                        </svg>

                                    </div>

                                </div>

                            </div>

                        )
                    }

                    {
                        role === "faculty" && (

                            <div>

                                <label className="block text-sm text-neutral-400 mb-3">
                                    Select Courses
                                </label>

                                <div className="grid grid-cols-2 gap-3">

                                    {
                                        COURSES.map(
                                            (course) => (

                                                <label
                                                    key={course}
                                                    className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-3 cursor-pointer hover:bg-neutral-700 transition-all"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedCourses.includes(
                                                                course
                                                            )
                                                        }
                                                        onChange={() =>
                                                            handleCourseToggle(
                                                                course
                                                            )
                                                        }
                                                        className="accent-white"
                                                    />

                                                    <span className="text-sm text-white">
                                                        {course}
                                                    </span>

                                                </label>

                                            )
                                        )
                                    }

                                </div>

                            </div>

                        )
                    }

                    {
                        (role === "user" ||
                            role === "faculty") && (

                            <input
                                type="number"
                                placeholder="Semester"
                                value={semester}
                                onChange={(e) =>
                                    setSemester(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none"
                                required
                            />

                        )
                    }

                    {
                        error && (

                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">

                                {error}

                            </div>

                        )
                    }

                    <div className="flex items-center justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-xl bg-white text-black font-medium hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {
                                loading
                                    ? "Creating..."
                                    : "Create User"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}   