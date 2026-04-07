import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useLogin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            // 1. Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Fetch
            const userDocSnap = await getDoc(doc(db, "users", user.uid));

            if (!userDocSnap.exists()) {
                await signOut(auth);
                throw new Error("User record not found. Contact admin.");
            }

            const { role, status } = userDocSnap.data();

            // 3. Validate 
            if (role !== "admin" && role !== "superadmin") {
                await signOut(auth);
                throw new Error("Access denied. Admin privileges required.");
            }

            if (status !== "active") {
                await signOut(auth);
                throw new Error("Your account is currently inactive.");
            }

            // 4. Success
            navigate("/dashboard");

        } catch (err: any) {
            console.error(err);
            if (err.code === "auth/invalid-credential") {
                setError("Invalid email or password.");
            } else {
                setError(err.message || "An error occurred during login.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
}