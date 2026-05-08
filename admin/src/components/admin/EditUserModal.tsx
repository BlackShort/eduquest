import { useEffect, useState } from "react";
import { updateUser } from "@/apis/auth-api";

interface User {
    _id: string;
    email: string;
    courses: string[];
    semester?: number;
}

interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
    onSuccess: () => void;
}

export default function EditUserModal({
    open,
    onClose,
    user,
    onSuccess
}: EditUserModalProps) {

    const [email, setEmail] = useState("");

    const [coursesInput, setCoursesInput] =
        useState("");

    const [semester, setSemester] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        if (user) {

            setEmail(user.email);

            setCoursesInput(
                user.courses?.join(", ") || ""
            );

            setSemester(
                Number(user.semester) || 1
            );

        }

    }, [user, open]);

    if (!open || !user) return null;

    const handleUpdate = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();
        setError("");

        try {

            setLoading(true);

            await updateUser(
                user._id,
                {
                    email,
                    courses: coursesInput
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean),
                    semester: Number(semester)
                }
            );

            await onSuccess();

            onClose();

        } catch (error: any) {

            console.log(error);
            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update user"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6">

                <h2 className="text-2xl font-bold text-white mb-6">
                    Edit User
                </h2>

                <form
                    onSubmit={handleUpdate}
                    className="space-y-4"
                >

                    <input
                        type="email"
                        value={email}
                        disabled
                        placeholder="Email"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-500 outline-none cursor-not-allowed"
                    />

                    <input
                        type="text"
                        value={coursesInput}
                        placeholder="Enter courses separated by commas"
                        onChange={(e) =>
                            setCoursesInput(
                                e.target.value
                            )
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none"
                    />

                    <input
                        type="number"
                        value={semester}
                        placeholder="Semester"
                        onChange={(e) =>
                            setSemester(
                                Number(e.target.value)
                            )
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none"
                    />

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
                            onClick={onClose}
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
                                    ? "Updating..."
                                    : "Update"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}