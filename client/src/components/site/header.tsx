import { Link, NavLink } from 'react-router'
import { User } from 'lucide-react';
import eduquest from '@/assets/logo/eduquest-invert.png'
import { useContextAPI } from '@/hooks/useContext';

interface HeaderProps {
    variant?: "default" | "sticky";
}

export function Header({ variant = "default" }: HeaderProps) {
    const { isLoggedIn, user } = useContextAPI();

    return (
        <header className={`${variant === "sticky" ? "sticky top-0 z-50" : ""} w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-full h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                            <img
                                src={eduquest}
                                alt="EduQuest"
                                className="w-full h-10 object-cover"
                            />
                        </div>
                    </Link>

                    {/* <div className="flex flex-row-reverse md:flex-row items-center gap-4"> */}
                    {/* Search Bar */}
                    {/* <div className="hidden border border-gray-300 md:flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 w-full max-w-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Opportunities"
                            className="bg-transparent border-none outline-none text-sm tracking-wider w-full"
                        />
                    </div> */}

                    {/* Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <NavLink to="/problemset" className="text-gray-700 hover:text-gray-900 font-normal">Problems</NavLink>
                        <NavLink to="/contest" className="text-gray-700 hover:text-gray-900 font-normal">Contests</NavLink>
                        <NavLink to="/leaderboard" className="text-gray-700 hover:text-gray-900 font-normal">Leaderboard</NavLink>
                        <NavLink to="/discuss" className="text-gray-700 hover:text-gray-900 font-normal">Discuss</NavLink>
                    </nav>


                    <div className="flex items-center gap-2">
                        {isLoggedIn && user?._id ? (
                            <Link to={`/profile/${user._id}/me`} className="border border-slate-500 flex items-center gap-2 bg-neutral-500/50 rounded-full px-2 md:px-3 py-1 cursor-pointer">
                                <User size={18} />
                                <span className="text-sm md:text-base font-medium cursor-pointer select-none" id="user">Profile</span>
                            </Link>
                        ) : (
                            <Link to={'/login'}>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all hover:shadow-md hover:shadow-orange-300"
                                >
                                    Get Started
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header >
    )
}
