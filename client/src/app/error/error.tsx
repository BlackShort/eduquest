import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AlertCircle size={96} className="text-red-500 mb-4" />
            <h2 className="text-3xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-6">The page you are looking for might have been removed or is temporarily unavailable.</p>
            <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Go to Home
            </Link>
        </div>
    );
};