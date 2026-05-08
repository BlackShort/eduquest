interface User {
    _id: string;
    studentId?: string;
    username: string;
    email: string;
    role?: string;
    courses: string[];
    semester?: string;
    lastLogin?: string;
    createdAt?: string;
    isVerified?: boolean;
    isActive?: boolean;
}

interface ViewUserModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

export default function ViewUserModal({
    open,
    onClose,
    user
}: ViewUserModalProps) {

    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

            <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6">

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-bold text-white">
                        User Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white"
                    >
                        ✕
                    </button>

                </div>

                <div className="space-y-4">

                    <div>
                        <p className="text-neutral-400 text-sm">
                            Username
                        </p>

                        <p className="text-white">
                            {user.username}
                        </p>
                    </div>

                    <div>
                        <p className="text-neutral-400 text-sm">
                            Student ID
                        </p>

                        <p className="text-white">
                            {user.studentId || "N/A"}
                        </p>
                    </div>

                    <div>
                        <p className="text-neutral-400 text-sm">
                            Email
                        </p>

                        <p className="text-white">
                            {user.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-neutral-400 text-sm">
                            Courses
                        </p>

                        <p className="text-white">
                            {
                                user.courses?.length > 0
                                    ? user.courses.join(", ")
                                    : "N/A"
                            }
                        </p>
                    </div>

                    <div>
                        <p className="text-neutral-400 text-sm">
                            Semester
                        </p>

                        <p className="text-white">
                            {user.semester || "N/A"}
                        </p>
                    </div>

                    <div>
                        <p className="text-neutral-400 text-sm">
                            Last Login
                        </p>

                        <p className="text-white">
                            {
                                user.lastLogin
                                    ? new Date(user.lastLogin).toLocaleString()
                                    : "Never Logged In"
                            }
                        </p>
                    </div>

                    <div>
                        <p className="text-neutral-400 text-sm">
                            Verified
                        </p>

                        <p className="text-white">
                            {user.isVerified ? "Yes" : "No"}
                        </p>
                    </div>

                    <div>
                        <p className="text-neutral-400 text-sm">
                            Active
                        </p>

                        <p className="text-white">
                            {user.isActive ? "Yes" : "No"}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}