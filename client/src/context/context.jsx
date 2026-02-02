import { createContext, useEffect, useState } from "react";

const ContextAPI = createContext();

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [userID, setUserID] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });

    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn);
    }, [isLoggedIn  ]);

    return (
        <ContextAPI.Provider value={{
            user, setUser,
            userID, setUserID,
            isLoggedIn, setIsLoggedIn,
        }}>
            {children}
        </ContextAPI.Provider>
    )
}

export { ContextProvider, ContextAPI };