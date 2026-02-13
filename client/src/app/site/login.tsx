import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import { useContextAPI } from "@/hooks/useContext.js";
import { serverUrl } from "@/apis/server-api";

export const Login = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContextAPI();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const checkAuth = localStorage.getItem("isAuthenticated");
        if (checkAuth === "true") {
            setIsLoggedIn(true);
            navigate('/dashboard');
        }
    }, [setIsLoggedIn, navigate]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // send user data to server for authentication
        try {
            const response = await axios.post(`${serverUrl}/auth/login`, loginData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.status >= 200 && response.status < 300) {
                setLoginData({ email: "", password: "" });
                toast.success(response?.data?.message);
                setIsLoggedIn(true);
                // Save authentication state to localStorage
                localStorage.setItem("isAuthenticated", "true");
                navigate('/dashboard');
            }
        } catch (error: unknown) {
            const errormsg = error instanceof Error ? error.message : "An unknown error occurred";
            setIsLoggedIn(false);
            toast.error(errormsg);
            navigate('/login');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'email' ? value.toLowerCase() : value;
        setLoginData({ ...loginData, [name]: newValue });
    };

    return (
        <div className="flex flex-col items-center justify-start w-full h-screen">
            <div className="flex flex-col items-center justify-center w-100 md:w-1/3 gap-8 mt-20">
                <div className="w-3/4">
                    <p className="font-bold text-4xl">Log in</p>
                </div>
                <form onSubmit={handleLogin} className="flex flex-col items-center w-full gap-2" method="post">
                    <div className="flex flex-col w-3/4 gap-4">
                        <div className='flex flex-row w-full h-[2.7rem] items-center justify-center px-3 enter border-2 border-gray-600 rounded-lg'>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                required
                                className="w-full h-full text-base outline-none bg-transparent tracking-wide placeholder:text-gray-500"
                            />
                        </div>
                        <div className='flex flex-row w-full h-[2.7rem] items-center justify-center px-3 enter border-2 border-gray-600 rounded-lg'>
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                required
                                className="w-full h-full text-base outline-none bg-transparent tracking-wide placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                    <button type='submit' className='h-[2.7rem] my-6 rounded-lg bg-sky-900 w-3/4'><p className='font-medium text-lg text-white'>Continue</p></button>
                    <div className="flex gap-2 text-center pb-3">
                        <span>Don't have an account?</span>
                        <Link to="/signup" className="text-blue-600">Signup</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
