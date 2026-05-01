import { NavLink, Link, useNavigate } from 'react-router';
import { ChevronRight, LogOut, User, Settings } from "lucide-react";
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

import type { Navigation, NavigationItem } from '@/data/sidebar';
import { useContextAPI } from '@/hooks/useContext';
import { logout } from '@/apis/auth-api';

interface SidebarProps {
    navigation: Navigation;
}

export const Sidebar = ({ navigation }: SidebarProps) => {
    const { user, setUser, setIsLoggedIn, setSidebarOpen, setAppLoading } = useContextAPI();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const settingsPath = user?.role === 'faculty' ? '/faculty-dashboard/settings' : '/dashboard/settings';

    const userMenuItems = [
        { label: 'Settings', icon: Settings, path: settingsPath },
    ];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout, but clearing local session');
        } finally {
            setAppLoading(true);
            setSidebarOpen(false);
            setIsMenuOpen(false);
            sessionStorage.clear();
            navigate('/', { replace: true });

            setUser(null);
            setIsLoggedIn(false);
            setIsLoggingOut(false);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className='flex flex-col w-72 md:w-64 h-full bg-neutral-800 border-r border-neutral-700/50 overflow-hidden'>
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

            {/* User info */}
            <div ref={menuRef} className='relative group shrink-0 border-t border-neutral-700/50 mt-auto'>
                {/* User Info Trigger */}
                <div
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className='flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-neutral-800 transition-colors duration-200'
                >
                    <div className='flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-orange-500/20 text-orange-400'>
                        <User size={18} />
                    </div>
                    <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-neutral-200 truncate leading-snug'>
                            {(user as { username?: string; name?: string }).username ?? (user as { username?: string; name?: string }).name ?? 'User'}
                        </p>
                        <p className='text-xs text-neutral-500 truncate mt-0.5'>
                            {(user as { email?: string }).email ?? ''}
                        </p>
                    </div>
                    <ChevronRight size={16} className={`text-neutral-500 group-hover:text-neutral-300 transition-colors duration-200 ${isMenuOpen ? 'text-neutral-300 rotate-90' : ''}`} />
                </div>

                {/* Popup Menu */}
                <div className={`absolute bottom-full left-2 right-2 mb-2 bg-neutral-900 border border-neutral-700/50 rounded-xl shadow-lg shadow-black/40 overflow-hidden transition-all duration-200 z-50 ${isMenuOpen
                        ? 'opacity-100 visible translate-y-0 md:group-hover:opacity-100 md:group-hover:visible'
                        : 'opacity-0 invisible translate-y-2 md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0'
                    }`}>
                    <div className="flex flex-col p-1.5 gap-0.5">
                        {userMenuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={handleMenuItemClick}
                                className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg text-sm font-medium text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
                            >
                                <div className="relative flex">
                                    <item.icon size={16} className="text-neutral-400" />
                                </div>
                                {item.label}
                            </Link>
                        ))}

                        <div className="h-px bg-neutral-800 my-1 mx-1" />

                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className='cursor-pointer flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoggingOut ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <LogOut size={16} opacity={0.8} />
                                    Log out
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
