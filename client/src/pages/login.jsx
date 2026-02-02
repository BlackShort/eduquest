import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { serverAPI } from "../api/server-api.js";
import { ContextAPI } from "../context/context.jsx";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router";


export const AuthPage = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setUser } = useContext(ContextAPI);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const checkAuth = localStorage.getItem("isLoggedIn");
        if (checkAuth === "true") {
            setIsLoggedIn(true);
            navigate('/');
        }
    }, [setIsLoggedIn, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${serverAPI.login}`, loginData,
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
                setUser(response.data);
                localStorage.setItem("isLoggedIn", "true");
                navigate('/');
            }
        } catch (error) {
            setIsLoggedIn(false);
            toast.error(error.response?.data?.message || "Server Error!");
            navigate('/auth');
        }
    };

    const handleChange = (e) => {
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
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email">Email</label>
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
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password">Password</label>
                                <Link to="/signup" className="text-blue-600">Forget Password?</Link>
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
                    </div>
                    <button type='submit' className='h-[2.7rem] my-6 rounded-lg bg-sky-900 w-3/4'><p className='font-medium text-lg text-white'>Continue</p></button>
                </form>
            </div>
        </div>
    );
};