"use client"
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './authprovider';

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user && pathname !== '/login') {
                router.push('/login');
            }
            if (user && pathname === '/login') {
                router.push('/');
            }
        }
    }, [user, loading, pathname]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return <>{children}</>;
};