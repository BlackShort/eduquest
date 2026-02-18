import { Trophy, Medal, Award, TrendingUp, Code2, Target, Zap, Users } from 'lucide-react'

export const LeaderboardHome = () => {
    const leaderboardData = [
        { rank: 1, name: 'Priya Sharma', score: 2850, problemsSolved: 145, streak: 28, avatar: 'PS', trend: 'up', color: 'from-yellow-500 to-amber-600' },
        { rank: 2, name: 'Arjun Patel', score: 2720, problemsSolved: 138, streak: 25, avatar: 'AP', trend: 'up', color: 'from-gray-300 to-gray-400' },
        { rank: 3, name: 'Sneha Reddy', score: 2680, problemsSolved: 132, streak: 22, avatar: 'SR', trend: 'same', color: 'from-orange-400 to-orange-500' },
        { rank: 4, name: 'Rahul Kumar', score: 2540, problemsSolved: 125, streak: 20, avatar: 'RK', trend: 'up', color: '' },
        { rank: 5, name: 'Ananya Singh', score: 2490, problemsSolved: 121, streak: 18, avatar: 'AS', trend: 'down', color: '' },
        { rank: 6, name: 'Vikram Joshi', score: 2450, problemsSolved: 118, streak: 17, avatar: 'VJ', trend: 'up', color: '' },
        { rank: 7, name: 'Divya Iyer', score: 2390, problemsSolved: 115, streak: 16, avatar: 'DI', trend: 'same', color: '' },
        { rank: 8, name: 'Rohan Gupta', score: 2340, problemsSolved: 112, streak: 15, avatar: 'RG', trend: 'up', color: '' },
        { rank: 9, name: 'Kavya Nair', score: 2280, problemsSolved: 108, streak: 14, avatar: 'KN', trend: 'down', color: '' },
        { rank: 10, name: 'Aditya Verma', score: 2250, problemsSolved: 105, streak: 13, avatar: 'AV', trend: 'up', color: '' },
    ];

    const stats = [
        { label: 'Total Participants', value: '1,247', icon: Users, gradient: 'from-blue-500 to-blue-600' },
        { label: 'Your Rank', value: '#45', icon: Trophy, gradient: 'from-purple-500 to-purple-600' },
        { label: 'Your Score', value: '1,850', icon: Target, gradient: 'from-green-500 to-green-600' },
        { label: 'Problems Solved', value: '89', icon: Code2, gradient: 'from-orange-500 to-orange-600' },
    ];

    const categories = ['Overall', 'Weekly', 'Monthly', 'Contest'];

    return (
        <div className="space-y-6 text-neutral-100">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold bg-linear-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-4">
                        Leaderboard
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Compete with peers and climb the rankings by solving problems and participating in contests
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="group relative">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-neutral-600 to-neutral-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                            <div className="relative bg-linear-to-br from-neutral-800 to-neutral-900 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                                <div className={`w-12 h-12 bg-linear-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`text-3xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-neutral-400">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Category Tabs */}
                <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
                    {categories.map((category, idx) => (
                        <button
                            key={idx}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${idx === 0
                                ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Top 3 Podium */}
                <div className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* 2nd Place */}
                        <div className="md:mt-8 order-2 md:order-1">
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-linear-to-r from-gray-400 to-gray-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                                <div className="relative bg-linear-to-br from-neutral-800 to-neutral-900 rounded-2xl p-6 border border-neutral-700 text-center">
                                    <div className={`w-16 h-16 mx-auto mb-4 bg-linear-to-br ${leaderboardData[1].color} rounded-full flex items-center justify-center text-2xl font-bold shadow-lg`}>
                                        {leaderboardData[1].avatar}
                                    </div>
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-linear-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center border-4 border-neutral-900">
                                        <Medal className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{leaderboardData[1].name}</h3>
                                    <div className="text-3xl font-bold bg-linear-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent mb-2">
                                        {leaderboardData[1].score}
                                    </div>
                                    <div className="text-sm text-neutral-400">{leaderboardData[1].problemsSolved} problems solved</div>
                                    <div className="mt-4 pt-4 border-t border-neutral-700">
                                        <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                                            <Zap className="w-4 h-4 text-yellow-500" />
                                            {leaderboardData[1].streak} day streak
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 1st Place */}
                        <div className="order-1 md:order-2">
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 to-amber-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500" />
                                <div className="relative bg-linear-to-br from-neutral-800 to-neutral-900 rounded-2xl p-8 border border-yellow-600/50 text-center">
                                    <div className={`w-20 h-20 mx-auto mb-4 bg-linear-to-br ${leaderboardData[0].color} rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl shadow-yellow-500/30`}>
                                        {leaderboardData[0].avatar}
                                    </div>
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-linear-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center border-4 border-neutral-900 shadow-lg">
                                        <Trophy className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{leaderboardData[0].name}</h3>
                                    <div className="text-4xl font-bold bg-linear-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
                                        {leaderboardData[0].score}
                                    </div>
                                    <div className="text-sm text-neutral-400">{leaderboardData[0].problemsSolved} problems solved</div>
                                    <div className="mt-4 pt-4 border-t border-neutral-700">
                                        <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                                            <Zap className="w-4 h-4 text-yellow-500" />
                                            {leaderboardData[0].streak} day streak
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="md:mt-8 order-3">
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-linear-to-r from-orange-400 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                                <div className="relative bg-linear-to-br from-neutral-800 to-neutral-900 rounded-2xl p-6 border border-neutral-700 text-center">
                                    <div className={`w-16 h-16 mx-auto mb-4 bg-linear-to-br ${leaderboardData[2].color} rounded-full flex items-center justify-center text-2xl font-bold shadow-lg`}>
                                        {leaderboardData[2].avatar}
                                    </div>
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-linear-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-neutral-900">
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{leaderboardData[2].name}</h3>
                                    <div className="text-3xl font-bold bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-2">
                                        {leaderboardData[2].score}
                                    </div>
                                    <div className="text-sm text-neutral-400">{leaderboardData[2].problemsSolved} problems solved</div>
                                    <div className="mt-4 pt-4 border-t border-neutral-700">
                                        <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                                            <Zap className="w-4 h-4 text-yellow-500" />
                                            {leaderboardData[2].streak} day streak
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Remaining Rankings Table */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-20" />
                    <div className="relative bg-linear-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-neutral-700 bg-neutral-800/50">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Rank</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">User</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Score</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Problems Solved</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Streak</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.slice(3).map((user, idx) => (
                                        <tr key={idx} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center text-sm font-bold">
                                                        {user.rank}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                                                        {user.avatar}
                                                    </div>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-white">{user.score}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Code2 className="w-4 h-4 text-blue-400" />
                                                    <span className="text-neutral-300">{user.problemsSolved}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-neutral-300">{user.streak} days</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                                                    user.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-neutral-600/20 text-neutral-400'
                                                    }`}>
                                                    <TrendingUp className={`w-3 h-3 ${user.trend === 'down' ? 'rotate-180' : user.trend === 'same' ? 'rotate-90' : ''}`} />
                                                    {user.trend === 'up' ? 'Rising' : user.trend === 'down' ? 'Falling' : 'Stable'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Load More Button */}
                <div className="text-center mt-8">
                    <button className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300">
                        Load More Rankings
                    </button>
                </div>
            </div>
        </div>
    )
}
