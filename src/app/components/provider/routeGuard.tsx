"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './authprovider';

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, idCircular } = useAuth();
    const [isVerifyingLevel, setIsVerifyingLevel] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
<<<<<<< Updated upstream
    const allowRoutes = ["/addProduct","/addCircular", "/dashboard"];

=======
    const allowRoutes = ["/addProduct", "/addCircular", "/onboarding", "/dashboard", "/tracking"];
>>>>>>> Stashed changes

    useEffect(() => {
        if (!loading) {
            if (!user && pathname !== '/login') {
                router.push('/login');
            }

            setIsVerifyingLevel(true);
            if (user && user.userData?.level_client === 5 && idCircular === null) {
                router.push('/addProduct');
            } else if (user && pathname === '/login') {
                router.push('/dashboard');
            } else if (user && idCircular === null && pathname && !allowRoutes.includes(pathname)) {
                router.push('/dashboard');
            }
            setIsVerifyingLevel(false);
        }
    }, [user, loading, pathname, idCircular]);

    if (loading || isVerifyingLevel) {
        return (
            <div className='flex items-center justify-center text-black text-2xl pt-10 h-[calc(100vh-100px)]'>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center text-red-500 text-2xl pt-10 h-[calc(100vh-100px)]'>
                {error}
            </div>
        );
    }

    return <>{children}</>;
};