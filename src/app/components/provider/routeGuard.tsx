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
    const [error, setError] = useState<string | null>(null);
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
                    setError('Error al obtener clientes');
                    console.error('Error al obtener clientes:', resp.status);
                }
            } catch (error) {
                setError('Error al obtener clientes');
                console.error('Error al obtener clientes:', error);
            }
        };
        gettingClients();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const handleNavigation = async () => {
            if (!loading && user) {
                try {
                    setIsVerifyingLevel(true);
                    
                    const clientLevel = clients?.find(
                        client => client?.id_client === user?.userData?.id_client
                    )?.level_client || null;

                    let targetPath = null;

                    if (clientLevel === 5) {
                        // Verificar si tenemos acceso antes de redirigir
                        try {
                            // Aquí puedes agregar una verificación previa si es necesario
                            targetPath = '/addProduct';
                        } catch (error) {
                            console.error('Error al verificar acceso:', error);
                            targetPath = '/onboarding';
                        }
                    } else {
                        targetPath = '/onboarding';
                    }

                    if (pathname !== targetPath) {
                        await router.push(targetPath);
                    }
                } catch (error) {
                    console.error('Error durante la navegación:', error);
                    setError('Error al redirigir. Por favor, intente nuevamente.');
                } finally {
                    setIsVerifyingLevel(false);
                }
            } else if (!loading && !user && pathname !== '/login') {
                router.push('/login');
            }
        };

        handleNavigation();
    }, [user, loading, pathname, clients, router]);

    if (loading || isVerifyingLevel) {
        return (
            <div className='flex items-center justify-center text-black text-2xl pt-10 h-[calc(100vh-100px)]'>
                Verificando acceso...
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
