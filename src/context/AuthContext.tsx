import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { account, config } from '../lib/appwrite';

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

    const isAdmin = user ? config.adminUserIds.includes(user.$id) : false;

    useEffect(() => {
        checkSession();
    }, []);

    async function checkSession() {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        try {
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get();

            // Check if user is an admin
            if (!config.adminUserIds.includes(currentUser.$id)) {
                await account.deleteSession('current');
                throw new Error('You are not authorized to access the admin panel.');
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
