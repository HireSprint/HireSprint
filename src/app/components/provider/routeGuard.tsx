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
                router.push('/onboarding');
            }
        }
    }, [user, loading, pathname]);

    if (loading) {
        return <div className='text-black text-2xl pt-10 flex h-[calc(100vh-100px)]'>Cargando...</div>;
    }

    return <>{children}</>;
};
