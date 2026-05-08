import { useState } from "react";
import { updateUser } from "@/apis/auth-api";

interface User {
    _id: string;
    email: string;
    courses: string[];
    semester?: string;
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

    const [email, setEmail] =
        useState(user?.email || "");

    const [coursesInput, setCoursesInput] =
        useState(
            user?.courses?.join(", ") || ""
        );

    const [semester, setSemester] =
        useState(
            Number(user?.semester) || 1
        );

    const [loading, setLoading] =
        useState(false);

    if (!open || !user) return null;

    const handleUpdate = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setLoading(true);

            await updateUser(
                user._id,
                {
                    email,
                    courses: coursesInput
                        .split(",")
                        .map((c) => c.trim()),
                    semester
                }
            );

            await onSuccess();

            onClose();

        } catch (error) {

            console.log(error);

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
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none"
                    />

                    <input
                        type="text"
                        value={coursesInput}
                        onChange={(e) =>
                            setCoursesInput(e.target.value)
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none"
                    />

                    <input
                        type="number"
                        value={semester}
                        onChange={(e) =>
                            setSemester(Number(e.target.value))
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none"
                    />

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