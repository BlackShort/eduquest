import { Link, NavLink } from 'react-router'
import { User } from 'lucide-react';
import eduquest from '@/assets/logo/eduquest.png'
import eduquestLight from '@/assets/logo/eduquest-invert.png'
import { useContextAPI } from '@/hooks/useContext';

interface HeaderProps {
    variant?: "default" | "sticky";
    theme?: "light" | "dark";
}

export function Header({ variant = "default", theme = "light" }: HeaderProps) {
    const { isLoggedIn, user } = useContextAPI();

    const links = [
        { name: "Problems", path: "/problemset" },
        { name: "Contests", path: "/contest" },
        { name: "Leaderboard", path: "/leaderboard" },
        { name: "Discuss", path: "/discuss" },
    ];


    return (
        <header className={`${variant === "sticky" ? "sticky top-0 z-50" : ""} w-full border-b ${theme === "light" ? "border-gray-200 bg-white/95" : "border-neutral-500 bg-neutral-800"} backdrop-blur-md shadow-sm`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-full h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                            <img
                                src={theme === "light" ? eduquestLight : eduquest}
                                alt="EduQuest"
                                className="w-full h-8 object-cover"
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
                    <nav
                        className={`hidden lg:flex items-center gap-8 font-normal ${theme === "light" ? "text-gray-700" : "text-neutral-400"
                            }`}
                    >
                        {links.map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.path}
                                className={({ isActive }) =>
                                    `transition-colors duration-300 ${isActive && "text-neutral-200"} hover:text-neutral-200`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>



                    <div className="flex items-center gap-2">
                        {isLoggedIn && user ? (
                            <button
                                type="button"
                                className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-500 border border-orange-600/60 bg-orange-50/30 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-200"
                            >
                                <User size={18} />
                                <span className="select-none">Profile</span>
                            </button>

                        ) : (
                            <Link to={'/login'}>
                                <button
                                    type="button"
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all hover:shadow-orange-300"
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
