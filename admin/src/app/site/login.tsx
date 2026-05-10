import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Eye, EyeOff } from "lucide-react";
import { useContextAPI } from "@/hooks/useContext.js";
import { login } from "@/apis/auth-api";
import { logo } from "@/assets/logo";
import { Loader } from "@/components/site/loader";
import type { ApiError } from "@/types/error";

export const Login = () => {
    const navigate = useNavigate();
    
    const { dashboardPath, isLoggedIn, appLoading, isLoggingOut, setIsLoggedIn, setUser } = useContextAPI();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (!appLoading && isLoggedIn && dashboardPath !== "/auth/login") {
            navigate(dashboardPath, { replace: true });
        }
    }, [isLoggedIn, appLoading, navigate, dashboardPath]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await login(loginData.email, loginData.password);

            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
            }

            setUser(data.user);
            setIsLoggedIn(true);
            toast.success(data.message);
            navigate(dashboardPath);

            setLoginData({ email: "", password: "" });
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const message = apiError?.message || "An unknown error occurred";

            if (apiError?.status === 404) {
                toast.error("User does not exist. Please register first.");
                navigate("/auth/register");
                return;
            }

            setIsLoggedIn(false);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'email' ? value.toLowerCase() : value;
        setLoginData({ ...loginData, [name]: newValue });
    };

    if (appLoading || isLoggingOut) {
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
                        <Link to={'/'}>
                            <div className="flex items-center justify-center gap-2">
                                <img src={logo.codealpha.codealphaB} alt="CodeAlpha" className="w-max h-9 object-cover" />
                            </div>
                        </Link>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4" method="post">

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
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</label>
                                <button
                                    type="button"
                                    className="text-xs text-neutral-400 hover:text-white transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
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
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Log In</span>
                            )}
                        </button>
                    </form>

                </div>

                {/* Footer */}
                <p className="mt-5 text-sm text-neutral-500">
                    Don't have an account?{" "}
                    <Link to="/auth/register" className="text-neutral-200 hover:text-white font-medium transition-colors underline underline-offset-2">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};
