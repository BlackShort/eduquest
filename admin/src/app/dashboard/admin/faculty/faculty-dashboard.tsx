import { useEffect, useState } from "react";
import { getUsersByRole } from "@/apis/auth-api";
import InsertUsersBar from "@/components/admin/InsertUserBar.tsx";
import UserTable from "@/components/admin/UserTable.tsx";
import AddUserModal from "@/components/admin/AddUserModal";
import AddManyUserModal from "@/components/admin/AddManyUserModal";

interface Faculty {
    _id: string;
    studentId?: string;
    username: string;
    email: string;
    lastLogin: string;
    course: string;
    semester: string;
}

export default function FacultyDashboard() {

    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);

    const [openAddModal, setOpenAddModal] = useState(false);

    const [openBulkModal, setOpenBulkModal] =
        useState(false);

    const fetchFaculty = async () => {

        try {

            setLoading(true);

            const data = await getUsersByRole(
                "faculty"
            );

            setFaculty(data.users);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchFaculty();

    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6">

            <div className="max-w-6xl mx-auto">

                <div className="mb-6">

                    <h1 className="text-3xl font-bold">
                        Faculty Dashboard
                    </h1>

                    <p className="text-neutral-400 mt-1">
                        Manage and view all faculty members
                    </p>

                </div>

                <InsertUsersBar
                    title="Insert Faculty"
                    subtitle="Add new faculty members to the database"
                    onAddOne={() =>
                        setOpenAddModal(true)
                    }
                    onAddMany={() =>
                        setOpenBulkModal(true)
                    }
                />

                <AddUserModal
                    open={openAddModal}
                    onClose={() =>
                        setOpenAddModal(false)
                    }
                    role="faculty"
                    onSuccess={fetchFaculty}
                />

                <AddManyUserModal
                    open={openBulkModal}
                    onClose={() =>
                        setOpenBulkModal(false)
                    }
                    role="faculty"
                    onSuccess={fetchFaculty}
                />

                {
                    loading ? (

                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">

                            <div className="w-10 h-10 border-4 border-neutral-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>

                            <p className="text-neutral-400">
                                Loading faculty data...
                            </p>

                        </div>

                    ) : faculty.length === 0 ? (

                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">

                            <p className="text-neutral-500 text-lg">
                                No faculty members found
                            </p>

                        </div>

                    ) : (

                        <UserTable users={faculty} />

                    )
                }

            </div>

        </div>
    );
}