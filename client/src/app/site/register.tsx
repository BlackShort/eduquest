import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Eye, EyeOff } from "lucide-react";
import { useContextAPI } from "@/hooks/useContext.js";
import { register } from "@/apis/auth-api";
import { logo } from "@/assets/logo";
import { Loader } from "@/components/site/loader";
import type { ApiError } from "@/types/error";

export const Register = () => {
    const navigate = useNavigate();
    const { dashboardPath, isLoggedIn, appLoading } = useContextAPI();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const gehuEmailError =
        loginData.email.length > 0 && !/^([a-z0-9._%+-]+)\.(\d+)@gehu\.ac\.in$/.test(loginData.email)
            ? "Use your GEHU email in this format: username.studentId@gehu.ac.in"
            : "";

    const passwordError =
        loginData.password.length > 0 && loginData.password.length < 8
            ? "Password must be at least 8 characters."
            : "";

    const confirmPasswordError =
        loginData.confirmPassword.length > 0 && loginData.confirmPassword !== loginData.password
            ? "Passwords do not match."
            : "";

    useEffect(() => {
        if (!appLoading && isLoggedIn) {
            navigate(dashboardPath);
        }
    }, [isLoggedIn, appLoading, navigate, dashboardPath]);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (gehuEmailError) {
            toast.error(gehuEmailError);
            return;
        }

        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        if (loginData.password !== loginData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const data = await register(loginData.email, loginData.password);
            toast.success(data.message + ' — Please log in.');
            navigate("/auth/login");

            setLoginData({ email: "", password: "", confirmPassword: "" });
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const message = apiError?.message || "An unknown error occurred";

            if (apiError?.status === 409) {
                toast.error("User already exists with this email");
                navigate("/auth/login");
                return;
            }

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

    if (appLoading) {
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
                                <img src={logo.codealpha.codealphaB} alt="CodeAlpha" className="w-max h-8 object-cover" />
                            </div>
                        </Link>
                    </div>

                    <form onSubmit={handleRegister} className="flex flex-col gap-4" method="post">

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
                            {gehuEmailError ? <p className="text-xs text-red-400">{gehuEmailError}</p> : null}
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
                            {passwordError ? <p className="text-xs text-red-400">{passwordError}</p> : null}
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-300">Confirm Password</label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={loginData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
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
                            {confirmPasswordError ? <p className="text-xs text-red-400">{confirmPasswordError}</p> : null}
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
