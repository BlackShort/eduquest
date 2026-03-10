import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Eye, EyeOff } from "lucide-react";
import { useContextAPI } from "@/hooks/useContext.js";
import { register } from "@/apis/auth-api";
import logo from "@/assets/logo/favicon.png";
import { Loader } from "@/components/site/loader";

export const Register = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContextAPI();
    const [loading, setLoading] = useState(false);
    const [authChecking, setAuthChecking] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        const checkAuth = localStorage.getItem("isAuthenticated");
        if (checkAuth === "true") {
            setIsLoggedIn(true);
            navigate('/dashboard');
        } else {
            setAuthChecking(false);
        }
    }, [setIsLoggedIn, navigate]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await register(loginData.username, loginData.email, loginData.password);
            setLoginData({ username: "", email: "", password: "" });
            toast.success(data.message + ' — Please log in.');
            navigate('/auth/login');
        } catch (error: unknown) {
            const errormsg = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errormsg);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'email' ? value.toLowerCase() : value;
        setLoginData({ ...loginData, [name]: newValue });
    };

    if (authChecking) {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-neutral-950">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-neutral-950">
            <div className="my-auto flex flex-col items-center w-full max-w-sm px-4">
                {/* Card */}
                <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
                    {/* Logo + Title */}
                    <div className="flex items-start justify-center mb-7">
                        <div className="flex items-center justify-center gap-2">
                            <img src={logo} alt="EduQuest" className="w-8 h-8 object-cover" />
                            <h1 className="text-2xl font-bold text-white tracking-tight">EduQuest</h1>
                        </div>
                    </div>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4" method="post">

                        {/* Username */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="username" className="text-sm font-medium text-neutral-300">Username</label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={loginData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                disabled={loading}
                                className="w-full h-11 px-3.5 rounded-lg bg-neutral-950 border border-neutral-700 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-neutral-400 transition-colors disabled:opacity-50"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleChange}
                                placeholder="Enter your Email"
                                required
                                disabled={loading}
                                className="w-full h-11 px-3.5 rounded-lg bg-neutral-950 border border-neutral-700 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-neutral-400 transition-colors disabled:opacity-50"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                    className="w-full h-11 px-3.5 pr-11 rounded-lg bg-neutral-950 border border-neutral-700 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-neutral-400 transition-colors disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 w-full h-11 mt-1 rounded-lg bg-neutral-100 hover:bg-white active:bg-neutral-200 text-neutral-950 font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <span>Register</span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-neutral-800" />
                        <span className="text-xs text-neutral-500 font-medium">OR</span>
                        <div className="flex-1 h-px bg-neutral-800" />
                    </div>

                    {/* Social buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-3 w-full h-11 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-200 text-sm font-medium hover:bg-neutral-800 hover:border-neutral-600 transition-colors"
                        >
                            {/* Google icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-3 w-full h-11 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-200 text-sm font-medium hover:bg-neutral-800 hover:border-neutral-600 transition-colors"
                        >
                            {/* Apple icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.4.07 2.38.74 3.2.8 1.21-.24 2.38-.93 3.67-.84 1.58.13 2.77.74 3.54 1.89-3.26 1.95-2.49 5.89.39 7.07-.57 1.46-1.32 2.91-2.8 3.96zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            Continue with Apple
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-5 text-sm text-neutral-500">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-neutral-200 hover:text-white font-medium transition-colors underline underline-offset-2">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};
