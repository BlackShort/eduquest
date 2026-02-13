import { ContextAPI } from "@/contexts/Context";
import { useContext } from "react";

export const useContextAPI = () => {
    const context = useContext(ContextAPI);
    if (!context) {
        throw new Error('useContextAPI must be used within a ContextApp provider');
    }
    return context;
};