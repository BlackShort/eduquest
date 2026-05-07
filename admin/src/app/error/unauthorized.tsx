import { Link } from "react-router";
import { ShieldAlert } from "lucide-react";

export const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
            <div className="text-center">
                <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-300 mb-4">Unauthorized Access</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    You don't have permission to access this resource. If you believe this is an error, please contact support.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                        to="/"
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Go Home
                    </Link>
                    <Link
                        to="/dashboard"
                        className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};
