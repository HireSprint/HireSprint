"use client"
import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextProps {
    user: any;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    update: any;
    setUpdate: (update: any) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState (null);
    const router = useRouter();
    const pathname = usePathname();

    useLayoutEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUser(JSON.parse(storedUser));
                if (pathname === '/login') {
                    router.push('/');
                }
            } else if (pathname !== '/login') {
                router.push('/login');
            }
            setLoading(false);
        };

        checkAuth();
    }, [pathname]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch('https://hiresprintcanvas.dreamhosters.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json()
            if (res.ok) {
                setUser(data.result);
                localStorage.setItem('user', JSON.stringify(data.result));

                router.push('/');
            } else {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
        } catch (error: any) {
            console.error('Error al iniciar sesión:', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setLoading(true);
        try {
            setUser(null);
            localStorage.removeItem('user');
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, update, setUpdate }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
