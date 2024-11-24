"use client"
import React, { createContext, useContext, useState, useLayoutEffect, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {getCircularByClient} from "@/pages/api/apiMongo/getCircularByClient";

interface AuthContextProps {
    user: any;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    update: any;
    setUpdate: (update: any) => void;
    circulars: Array<{
        id_circular: number;
        date_circular: string;
        user_id: number;
        circular_products_upc: object;
    }>;
    idCircular: number | null;
    setIdCircular: (id: number | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState (null);
    const router = useRouter();
    const pathname = usePathname();
    const [circulars, setCirculars] = useState<any[]>([]);
    const [idCircular, setIdCircular] = useState<number | null>(null);
    useLayoutEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const storedIdCircular = localStorage.getItem('id_circular');

            if (storedUser) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUser(JSON.parse(storedUser));

                if (storedIdCircular && storedIdCircular !== 'null') {
                    const parsedId = JSON.parse(storedIdCircular);
                    setIdCircular(parsedId);

                    if (pathname === '/onboarding') {
                        router.push('/');
                    }
                }

                if (pathname === '/login') {
                    router.push('/onboarding');
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
                router.push('/onboarding');
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
            localStorage.removeItem('id_circular');
            localStorage.removeItem('selectedProducts');
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getProductView = async () => {
            try {
                const body = {
                    "id_cliente": user.userData.id_client,
                }
                const resp = await getCircularByClient(body);
                if (resp.status === 200) {
                    setCirculars(resp.result);
                }
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        };
        getProductView();
    }, [user]);

    const setCircularId = (id: number | null) => {
        setIdCircular(id);
        if (id) {
            localStorage.setItem('id_circular', JSON.stringify(id));
        } else {
            localStorage.removeItem('id_circular');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            update,
            setUpdate,
            circulars,
            idCircular,
            setIdCircular: setCircularId
        }}>
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
