"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
    user: any;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter()

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const res = await fetch('https://hiresprintcanvas.dreamhosters.com/login', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'same-origin'
                });
                
                if (!res.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                
                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                console.error('Error al verificar el usuario:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    console.log(user, "user")

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
            console.log(res, "res")

            const data = res.headers.get('content-type')?.includes('application/json') 
                ? await res.json()
                : null;
            if (res.ok) {
                setUser(data.user);
                router.push('/');
            } else {
                throw new Error(data.json() || 'Error al iniciar sesión');
            }
        } catch (error: any) {
            console.error('Error al iniciar sesión:', error.json());
        } finally {
            setLoading(false);
        }
    };
    console.log(user, "user")

    const logout = async () => {
        setLoading(true);
        try {
            const res = await fetch('', {
                method: 'POST',
            });

            if (res.ok) {
                setUser(null);
                router.push('/login');
            } else {
                throw new Error('Error al cerrar sesión');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
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
