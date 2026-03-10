import { NavLink, useNavigate } from 'react-router';
import { ChevronRight, LogOut, User } from "lucide-react";
import type { Navigation, NavigationItem } from '@/data/sidebar';
import { useContextAPI } from '@/hooks/useContext';
import { logout } from '@/apis/auth-api';

interface SidebarProps {
    navigation: Navigation;
}

export const Sidebar = ({ navigation }: SidebarProps) => {
    const { user, setUser, setIsLoggedIn } = useContextAPI();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            // proceed with local cleanup even if request fails
        } finally {
            setIsLoggedIn(false);
            setUser({});
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("user");
            navigate('/auth/login');
        }
    };

    return (
        <div className='flex flex-col w-64 h-full bg-neutral-800 border-r border-neutral-700/50 overflow-hidden'>
            {/* User info */}
            <div className='shrink-0 flex items-center gap-3 px-4 py-3 border-b border-neutral-700/50'>
                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 text-orange-400'>
                    <User size={16} />
                </div>
                <div className='min-w-0'>
                    <p className='text-sm font-medium text-neutral-200 truncate'>
                        {(user as { username?: string; name?: string }).username ?? (user as { username?: string; name?: string }).name ?? 'User'}
                    </p>
                    <p className='text-xs text-neutral-500 truncate'>
                        {(user as { email?: string }).email ?? ''}
                    </p>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent'>
                {Object.entries(navigation).map(([group, items]) => (
                    <div key={group}>
                        <div className='flex flex-col gap-1'>
                            {(items as NavigationItem[]).map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    end={item.path.startsWith('/')}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-normal transition-all duration-200
                                            ${isActive
                                            ? "text-gray-200 bg-neutral-700/30"
                                            : "text-gray-400 hover:bg-neutral-700/30 hover:text-gray-300"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon size={18} strokeWidth={2.5} />
                                            {item.title}
                                            <div className="flex items-center gap-2 ml-auto">
                                                {item.featured && (
                                                    <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.75 rounded-full">New</span>
                                                )}
                                                {!isActive && (
                                                    <ChevronRight
                                                        size={24}
                                                        className="text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                                                    />
                                                )}
                                            </div>
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout Button - Sticky at bottom */}
            <div className='shrink-0 p-4 border-t border-neutral-700/50'>
                <button
                    onClick={handleLogout}
                    className='cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200'
                >
                    <LogOut size={18} />
                    Log out
                </button>
            </div>
        </div>
    );
}
