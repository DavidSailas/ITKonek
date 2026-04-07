import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

export const useLogout = () => {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut(auth);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return { logout, isLoggingOut };
};