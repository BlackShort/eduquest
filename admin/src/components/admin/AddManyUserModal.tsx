import { useState } from "react";
// @ts-ignore
import Papa from "papaparse";
import { bulkRegisterUsers } from "@/apis/auth-api.ts";
// import type { User } from "@/types/types";


interface AddManyUsersModalProps {
    open: boolean;
    onClose: () => void;
    role: string;
    onSuccess: () => void;
}

export default function AddManyUsersModal({
    open,
    onClose,
    role,
    onSuccess
}: AddManyUsersModalProps) {

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
    const [failedUsers, setFailedUsers] =
        useState<any[]>([]);

    const [successCount, setSuccessCount] =
        useState(0);

    if (!open) return null;

    const handleUpload = async () => {

        if (!file) return;

        try {

            setLoading(true);
            setError("");

            Papa.parse(file, {

                header: true,

                skipEmptyLines: true,

                complete: async (results: any) => {

                    try {

                        const formattedUsers = results.data.map(
                            (user: any) => {
                                if (role === "faculty") {
                                    return {
                                        email: user.email,
                                        courses: (user.courses || user.course || "")
                                            .split(",")
                                            .map((c: string) => c.trim())
                                            .filter(Boolean),
                                        semester: Number(user.semester)
                                    };
                                }
                                return {
                                    email: user.email,
                                    courses: (user.courses || user.course || "")
                                        .split(",")
                                        .map((c: string) => c.trim())
                                        .filter(Boolean),
                                    semester: Number(user.semester)
                                };

                            }
                        );

                        const result = await bulkRegisterUsers(
                            formattedUsers,
                            role
                        );
                        console.log(result);
                        setFailedUsers(
                            result.failedUsers || []
                        );

                        setSuccessCount(
                            result.successCount || 0
                        );
                        // Set registered users to show in the UI

                        await onSuccess();

                        if (
                            !result.failedUsers ||
                            result.failedUsers.length === 0
                        ) {

                            handleClose();

                        }

                    } catch (error: any) {

                        setError(
                            error?.response?.data?.message ||
                            error?.message ||
                            "Upload failed"
                        );

                    } finally {

                        setLoading(false);

                    }

                }

            });

        } catch (error: any) {

            setLoading(false);

            setError(
                error?.message ||
                "Something went wrong"
            );

        }

    };

    const handleClose = () => {
        setFile(null);
        setFailedUsers([]);
        setSuccessCount(0);
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 ">

            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl">

                <div className="border-b border-neutral-800 px-6 py-5">

                    <h2 className="text-2xl font-bold text-white">
                        Upload CSV File
                    </h2>

                    <p className="text-neutral-400 text-sm mt-1">
                        Bulk add {role === "faculty" ? "faculty members" : "students"} using a CSV file
                    </p>

                </div>

                <div className="p-6">

                    <div className="border-2 border-dashed border-neutral-700 rounded-2xl p-8 text-center hover:border-neutral-500 transition-all duration-200">

                        <input
                            type="file"
                            accept=".csv"
                            id="csvUpload"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setFile(e.target.files[0]);
                                }
                            }}
                        />

                        <label
                            htmlFor="csvUpload"
                            className="cursor-pointer flex flex-col items-center"
                        >

                            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-8 h-8 text-white"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 16.5V3m0 13.5l-3.75-3.75M12 16.5l3.75-3.75M3 20.25h18"
                                    />
                                </svg>

                            </div>

                            <p className="text-white font-medium">
                                Click to upload CSV
                            </p>

                            <p className="text-neutral-500 text-sm mt-2">
                                Supported format: .csv
                            </p>

                        </label>

                    </div>

                    {
                        file && (
                            <div className="mt-5 bg-neutral-800 border border-neutral-700 rounded-2xl px-4 py-3 flex items-center justify-between">

                                <div>
                                    <p className="text-white font-medium">
                                        {file.name}
                                    </p>

                                    <p className="text-neutral-400 text-sm">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>

                                <button
                                    onClick={() => setFile(null)}
                                    className="text-red-400 hover:text-red-300 transition-all"
                                >
                                    Remove
                                </button>

                            </div>
                        )
                    }

                    <div className="mt-6 bg-neutral-800/50 border border-neutral-700 rounded-2xl p-4">

                        <h3 className="text-white font-semibold mb-2">
                            CSV Format
                        </h3>

                        {
                            role === "faculty" ? (

                                <div className="text-sm text-neutral-400 space-y-1">
                                    <p>email,courses,semester</p>
                                    <p>johndoe.220111111@gehu.ac.in,"BTech CSE,MCA",2</p>
                                </div>

                            ) : (

                                <div className="text-sm text-neutral-400 space-y-1">
                                        <p>email,courses,semester</p>
                                        <p>johndoe.220111111@gehu.ac.in,"B.Tech",6</p>
                                </div>

                            )
                        }

                    </div>

                </div>

                {
                    error && (
                        <div className="mx-6 mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )
                }
                {
                    successCount > 0 && (

                        <div className="mx-6 mb-4 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm">

                            Successfully uploaded
                            {" "}
                            <span className="font-semibold">
                                {successCount}
                            </span>
                            {" "}
                            users

                        </div>

                    )
                }
                {
                    failedUsers.length > 0 && (

                        <div className="mx-6 mb-4 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">

                            <h3 className="text-red-400 font-semibold mb-3">
                                Failed Uploads
                            </h3>

                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">

                                {
                                    failedUsers.map(
                                        (user, index) => (

                                            <div
                                                key={index}
                                                className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3"
                                            >

                                                <p className="text-white text-sm break-all">
                                                    {user.email}
                                                </p>

                                                <p className="text-red-400 text-xs mt-1">
                                                    {user.reason}
                                                </p>

                                            </div>

                                        )
                                    )
                                }

                            </div>

                        </div>

                    )
                }

                <div className="border-t border-neutral-800 px-6 py-4 flex items-center justify-end gap-3">

                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="px-5 py-2.5 rounded-xl bg-white text-black font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {
                            loading
                                ? "Uploading..."
                                : "Upload CSV"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}