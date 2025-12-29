import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { account } from '../lib/appwrite';

// User type for Appwrite
interface AppwriteUser {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    email: string;
    emailVerification: boolean;
    phone: string;
    phoneVerification: boolean;
    status: boolean;
    labels: string[];
    prefs: Record<string, unknown>;
}

interface AuthContextType {
    user: AppwriteUser | null;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppwriteUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = user ? user.labels && user.labels.includes('admin') : false;

    useEffect(() => {
        checkSession();
    }, []);

    async function checkSession() {
        try {
            const currentUser = await account.get();
            setUser(currentUser as unknown as AppwriteUser);
        } catch (error) {
            // User not logged in - this is expected for public visitors
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        try {
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get() as unknown as AppwriteUser;

            // Check if user is an admin by label
            const hasAdminLabel = currentUser.labels && currentUser.labels.includes('admin');

            if (!hasAdminLabel) {
                console.error('❌ Login Failed: User missing "admin" label. Labels:', currentUser.labels);
                await account.deleteSession('current');
                throw new Error(`You are not authorized. You need the "admin" label.`);
            }

            setUser(currentUser);
        } catch (error) {
            throw error;
        }
    }

    async function logout() {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
