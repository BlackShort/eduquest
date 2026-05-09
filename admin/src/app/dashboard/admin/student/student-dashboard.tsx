import { useEffect, useState } from "react";
import { getUsersByRole } from "@/apis/auth-api";
import InsertUsersBar from "@/components/admin/InsertUserBar.tsx";
import UserTable from "@/components/admin/UserTable.tsx";
import AddUserModal from "@/components/admin/AddUserModal.tsx";
import AddManyUserModal from "@/components/admin/AddManyUserModal.tsx";


interface Student {
    _id: string;
    studentId: string;
    username: string;
    email: string;
    lastLogin: string;
    courses: string[];
    semester?: number;
}

export default function StudentDashboard() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openBulkModal, setOpenBulkModal] = useState(false);


    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await getUsersByRole("user");
            setStudents(data.users);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);



    return (
        <div className="text-neutral-100">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Student Details
                    </h1>
                    <p className="text-neutral-400 mt-1">
                        Manage and view all registered students
                    </p>
                </div>

                <InsertUsersBar
                    title="Insert Students"
                    subtitle="Add new students to the database"
                    onAddOne={() => setOpenAddModal(true)}
                    onAddMany={() => setOpenBulkModal(true)}
                />

                <AddUserModal
                    open={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    role="user"
                    onSuccess={fetchStudents}
                />

                <AddManyUserModal
                    open={openBulkModal}
                    onClose={() => setOpenBulkModal(false)}
                    role="user"
                    onSuccess={fetchStudents}
                />

                {
                    loading ? (
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
                            <div className="w-10 h-10 border-4 border-neutral-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-neutral-400">
                                Loading student data...
                            </p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
                            <p className="text-neutral-500 text-lg">
                                No students found
                            </p>
                        </div>
                    ) : (
                        <UserTable
                            users={students}
                            onRefresh={fetchStudents}
                        />
                    )
                }

            </div>

        </div>
    );
}   