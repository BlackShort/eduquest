import { Link } from 'react-router'
import { User } from 'lucide-react';
import { logo } from '@/assets/logo'
import { useContextAPI } from '@/hooks/useContext';
import { CgMenuLeftAlt } from "react-icons/cg";

interface HeaderProps {
    layout?: "site" | "student" | "faculty" | "admin";
    variant?: "default" | "sticky" | "fixed";
    theme?: "light" | "dark";
    menu?: boolean;
}

export function Header({ layout = "site", variant = "default", theme = "light", menu = true }: HeaderProps) {
    const { isLoggedIn, user, toggleSidebar, dashboardPath } = useContextAPI();

    // const links = [
    //     { name: "Problems", path: "/problemset" },
    //     { name: "Contests", path: "/contest" },
    //     { name: "Leaderboard", path: "/leaderboard" },
    // ];


    return (
        <header className={`${variant === "sticky" ? "sticky top-0 z-50" : ""} w-full border-b ${theme === "light" ? "border-gray-200 bg-white/95" : "border-neutral-500 bg-neutral-800"} backdrop-blur-md shadow-sm`}>


            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between ${layout === "faculty" || layout === "admin" ? "h-12" : "h-14"}`}>
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-pointer group"
                        aria-label="Toggle sidebar"
                    >
                        <CgMenuLeftAlt size={24} className={`transition-colors duration-200 ${theme === "light" ? "text-neutral-800 group-hover:text-orange-500" : "text-neutral-300 group-hover:text-orange-400"}`} />
                    </button>

                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-full h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                            <img
                                src={theme === "light" ? logo.codealpha.codealphaB : logo.codealpha.codealphaL}
                                alt="CodeAlpha"
                                className="w-full h-8 object-cover"
                            />
                        </div>
                    </Link>

                    
                    {menu && <nav
                        className={`hidden lg:flex items-center gap-8 font-normal ${theme === "light" ? "text-gray-700" : "text-neutral-400"
                            }`}
                    >
                        {/* {links.map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.path}
                                className={({ isActive }) =>
                                    `transition-colors duration-300 ${isActive && "text-neutral-200"} ${theme === "light" ? "hover:text-neutral-900" : "hover:text-neutral-200"}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))} */}
                    </nav>}



                    <div className="flex items-center gap-2">
                        {isLoggedIn && user ? (
                            <Link to={dashboardPath}>
                                <button
                                    type="button"
                                    className="cursor-pointer flex items-center justify-center gap-2 px-1.5 md:px-3 py-1.5 text-sm font-medium text-neutral-100 border border-orange-600/60 bg-orange-500 rounded-full hover:bg-orange-600 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/50"
                                >
                                    <User size={18} />
                                    <span className="select-none hidden md:inline">Profile</span>
                                </button>
                            </Link>

                        ) : (
                            <Link to={'/auth/login'}>
                                <button
                                    type="button"
                                    className="cursor-pointer px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/50 whitespace-nowrap"
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
