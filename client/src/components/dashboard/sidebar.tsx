import { NavLink } from 'react-router';
import { CodeXml, FileCodeCorner, ChartNoAxesColumn, FileText, FolderClosed, UserRound, Settings, QrCode, ChevronRight } from "lucide-react";

export const Sidebar = () => {
    // const { setUser, setIsLoggedIn } = useContextAPI();
    // const navigate = useNavigate();

    const navigation = {
        dashboard: [
            { path: `assignments`, icon: FileCodeCorner, title: 'Assignments' },
            { path: `/problems`, icon: CodeXml, title: 'Problems' },
            { path: `/contests`, icon: ChartNoAxesColumn, title: 'Contests' },
        ],

        learning: [
            { path: `courses`, icon: FileText, title: 'Courses' },
            { path: `resources`, icon: FolderClosed, title: 'Resources' },
        ],

        account: [
            { path: `me`, icon: UserRound, title: 'Profile' },
            { path: `settings`, icon: Settings, title: 'Settings' },
        ],

        app: [
            { path: `appshare`, icon: QrCode, title: 'Share App' },
        ],
    };


    // const handleLogout = async () => {
    //     try {
    //         const response = await axios.get(`${serverUrl}/auth/logout`, {
    //             withCredentials: true
    //         });
    //         if (response.status === 200) {
    //             setIsLoggedIn(false);
    //             toast.success('Logout Successful!');
    //             setUser({});
    //             navigate('/');
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error('Error logging out!');
    //     }
    // }

    return (
        <div className='flex flex-col w-64 h-full bg-white border-r border-gray-200 overflow-hidden'>
            <div className='flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent'>
                {Object.entries(navigation).map(([group, items]) => (
                    <div key={group}>
                        <div className='flex flex-col gap-1'>
                            {items.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-normal transition-all duration-200
                                            ${isActive
                                            ? "text-orange-500 bg-orange-50"
                                            : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon size={18} strokeWidth={2.5} />
                                            {item.title}
                                            {!isActive && (
                                                <ChevronRight 
                                                    size={24} 
                                                    className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" 
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout Button - Sticky at bottom */}
            {/* <div className='shrink-0 p-4 border-t border-gray-200 bg-gray-50'>
                <button
                    onClick={handleLogout}
                    className='flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-white bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]'
                >
                    <LogOut size={18} />
                    Log out
                </button>
            </div> */}
        </div>
    );
}
