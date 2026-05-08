import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

import { useState } from "react";
import { deleteUser } from "@/apis/auth-api";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";

interface User {
    _id: string;
    studentId?: string;
    username: string;
    email: string;
    lastLogin: string;
    courses: string[];
    semester: string;
}

interface UserTableProps {
    users: User[];
}

export default function UserTable({
    users
}: UserTableProps) {

    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    const [openView, setOpenView] =
        useState(false);

    const [openEdit, setOpenEdit] =
        useState(false);
    
    const handleDelete = async (
        id: string
    ) => {

        try {

            await deleteUser(id);

            window.location.reload();

        } catch (error) {

            console.log(error);

        }

        };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-neutral-800 text-neutral-300">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold">
                                ID
                            </th>

                            <th className="text-left px-6 py-4 font-semibold">
                                Username
                            </th>

                            <th className="text-left px-6 py-4 font-semibold">
                                Email
                            </th>

                            <th className="text-left px-6 py-4 font-semibold">
                                Course
                            </th>

                            <th className="text-left px-6 py-4 font-semibold">
                                Semester
                            </th>

                            <th className="text-left px-6 py-4 font-semibold">
                                Last Login
                            </th>

                            <th className="text-left px-6 py-4 font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            users.map((user, index) => (

                                <tr
                                    key={user._id}
                                    className={`
                                        border-t border-neutral-800
                                        hover:bg-neutral-800/50
                                        transition-all duration-200
                                        ${index % 2 === 0
                                            ? "bg-neutral-900"
                                            : "bg-neutral-900/60"
                                        }
                                    `}
                                >

                                    <td className="px-4 py-4 text-neutral-300">
                                        {user.studentId}
                                    </td>


                                    <td className="px-6 py-4 font-medium">
                                        {user.username}
                                    </td>

                                    <td className="px-6 py-4 text-neutral-300">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-4 text-neutral-300">
                                        {user.courses && user.courses.length > 0 ? user.courses.join(", ") : "N/A"}
                                    </td>

                                    <td className="px-6 py-4 text-neutral-300">
                                        {user.semester == null ? "N/A" : user.semester}
                                    </td>

                                    <td className="px-4 py-4 text-neutral-400">
                                        {
                                            user.lastLogin
                                                ? new Date(user.lastLogin).toLocaleString()
                                                : "Never Logged In"
                                        }
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-3">

                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setOpenView(true);
                                                }}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setOpenEdit(true);
                                                }}
                                                className="text-yellow-400 hover:text-yellow-300"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(user._id)
                                                }
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>
            <ViewUserModal
                open={openView}
                onClose={() => setOpenView(false)}
                user={selectedUser}
            />

            <EditUserModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                user={selectedUser}
                onSuccess={() =>
                    window.location.reload()
                }
            />
        </div>
    );
}