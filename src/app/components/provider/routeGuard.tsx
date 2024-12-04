"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './authprovider';
import { getClients } from '@/pages/api/apiMongo/getClients';
import { clientType } from '@/types/clients';

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, idCircular } = useAuth();
    const [clients, setClients] = useState<clientType[] | []>([]);
    const [isVerifyingLevel, setIsVerifyingLevel] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let isMounted = true;

        const gettingClients = async () => {
            try {
                const resp = await getClients();
                if (resp.status === 200 && isMounted) {
                    setClients(resp.result);
                } else {
                    console.error('Error al obtener clientes:', resp.status);
                }
            } catch (error) {
                console.error('Error al obtener clientes:', error);
            }
        };
        gettingClients();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!loading && user) {
            setIsVerifyingLevel(true);
            
            const clientLevel = clients?.find(
                client => client?.id_cliente === user?.userData?.id_client
            )?.level_client || null;

            let targetPath = null;

            if (clientLevel === 5) {
                targetPath = '/addProduct';
            } else {
                targetPath = '/onboarding';
            }

            if (pathname !== targetPath) {
                router.push(targetPath);
            }
            
            setIsVerifyingLevel(false);
        } else if (!loading && !user && pathname !== '/login') {
            router.push('/login');
        }
    }, [user, loading, pathname, clients, router]);

    if (loading || isVerifyingLevel) {
        return (
            <div className='flex items-center justify-center text-black text-2xl pt-10 h-[calc(100vh-100px)]'>
                Loading...
            </div>
        );
    }

    return <>{children}</>;
};
