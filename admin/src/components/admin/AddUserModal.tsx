import { useState } from "react";
import { register } from "@/apis/auth-api";

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
    role: string;
    onSuccess: () => void;
}

export default function AddUserModal({
    open,
    onClose,
    role,
    onSuccess
}: AddUserModalProps) {

    const [email, setEmail] = useState("");
    const [coursesInput, setCoursesInput] = useState("");
    const [semester, setSemester] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        setError("");
        e.preventDefault();

        try {

            setLoading(true);

            const username =
                email.split("@")[0].split(".")[0];

            const password =
                `${username}@123`;

            const formattedCourses =
                role === "faculty"
                    ? coursesInput
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean)
                    : coursesInput ? [coursesInput] : [];

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
            setEmail("");
            setCoursesInput("")
            setSemester(1);

        } finally {

            setLoading(false);

        }

    };
    const handleClose = () => {

        setEmail("");
        setCoursesInput("")
        setSemester(1);
        setError("");

        onClose();

    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6">

                <h2 className="text-2xl font-bold text-white mb-6">
                    Add User
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
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

                    {(role == "user" || role == "faculty") &&
                        <input
                            type="text"
                            placeholder={
                                role === "faculty"
                                    ? "Enter courses separated by commas (optional)"
                                    : "Enter course"
                            }
                            value={coursesInput}
                            onChange={(e) =>
                                setCoursesInput(e.target.value)
                            }
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none"
                            required={role === "user"}
                        />}

                    {(role == "user" || role == "faculty") &&
                        <input
                            type="number"
                            placeholder="Semester"
                            value={semester}
                            onChange={(e) =>
                                setSemester(Number(e.target.value))
                            }
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none"
                            required
                        />
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
                            className="px-4 py-2 rounded-xl bg-neutral-800 text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-xl bg-white text-black font-medium"
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