import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// 1. Define user details
interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
}

// 2. Validate
interface AuthContextType {
    user: User | null;
    role: 'admin' | 'superadmin' | null;
    details: UserDetails | null;
    loading: boolean;
}

// 3. Update context 
const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    details: null,
    loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'admin' | 'superadmin' | null>(null);
    const [details, setDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                setUser(currentUser);
                if (currentUser) {
                    const docSnap = await getDoc(doc(db, "users", currentUser.uid));

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setRole(userData.role || null);
                        setDetails({
                            firstName: userData.firstName || '',
                            lastName: userData.lastName || '',
                            email: userData.email || currentUser.email || '',
                        });
                    }
                } else {
                    setRole(null);
                    setDetails(null);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setRole(null);
                setDetails(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (

        <AuthContext.Provider value={{ user, role, details, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);