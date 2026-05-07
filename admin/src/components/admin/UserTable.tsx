
interface User {
    _id: string;
    studentId?: string;
    username: string;
    email: string;
    lastLogin: string;
    course: string;
    semester: string;
}

interface UserTableProps {
    users: User[];
}

export default function UserTable({
    users
}: UserTableProps) {

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
                                        {user.course==null ? "N/A": user.course}
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

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>
        </div>
    );
}