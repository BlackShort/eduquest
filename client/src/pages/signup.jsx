import { useState } from 'react';

export default function AuthPages() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            console.log('Login:', { email, password });
            alert('Login submitted! (This is a demo)');
        } else {
            console.log('Signup:', { name, email, password });
            alert('Account created! (This is a demo)');
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 mb-4">
                        <span className="text-white text-3xl font-bold">G</span>
                    </div>
                    <h1 className="text-2xl font-normal text-gray-800 mb-2">
                        {isLogin ? 'Sign in' : 'Create your Account'}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {isLogin ? 'to continue to Demo' : 'to get started'}
                    </p>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <div className="space-y-6">
                        {/* Name field (signup only) */}
                        {!isLogin && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={!isLogin}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        )}

                        {/* Email field */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Password field */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {/* Forgot password (login only) */}
                        {isLogin && (
                            <div className="text-left">
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Terms text (signup only) */}
                        {!isLogin && (
                            <p className="text-xs text-gray-600">
                                By creating an account, you agree to our Terms of Service and Privacy Policy
                            </p>
                        )}

                        {/* Buttons */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setName('');
                                    setEmail('');
                                    setPassword('');
                                }}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {isLogin ? 'Create account' : 'Sign in instead'}
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {isLogin ? 'Next' : 'Sign up'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-600">
                    <button className="hover:text-gray-800">Help</button>
                    <button className="hover:text-gray-800">Privacy</button>
                    <button className="hover:text-gray-800">Terms</button>
                </div>
            </div>
        </div>
    );
}