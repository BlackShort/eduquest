import { Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';

export const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-800 font-bold text-lg">EduQuest</span>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 w-64">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Opportunities"
                                className="bg-transparent border-none outline-none text-sm w-full"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <a href="#" className="text-gray-700 hover:text-gray-900">Internships</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900">Competitions</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900">Mentorships</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900">Practice</a>
                        <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                            More <ChevronDown className="w-4 h-4" />
                        </button>
                    </nav>

                    {/* Action Buttons */}
                    <Link to="/auth" className="flex items-center gap-3">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
};
