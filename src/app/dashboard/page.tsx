"use client"

<<<<<<< Updated upstream
import React from 'react';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const DashboardCard = ({ title, description, icon, href }: DashboardCardProps) => {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-purple-100">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Control de Diseño</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Proyectos"
          description="Gestiona proyectos de diseño activos"
          icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
          href="/proyectos"
        />

        <DashboardCard
          title="Recursos"
          description="Biblioteca de recursos gráficos"
          icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          href="/recursos"
        />

        <DashboardCard
          title="Clientes"
          description="Administra información de clientes"
          icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          href="/clientes"
        />

        <DashboardCard
          title="Plantillas"
          description="Gestiona plantillas de diseño"
          icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>}
          href="/plantillas"
        />

        <DashboardCard
          title="Calendario"
          description="Programa y gestiona entregas"
          icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          href="/calendario"
        />

        <DashboardCard
          title="Estadísticas"
          description="Métricas y análisis de proyectos"
          icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          href="/estadisticas"
        />
      </div>
    </div>
  );
=======
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../components/provider/authprovider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DashboardCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const DashboardCard = ({ title, description, icon, onClick }: DashboardCardProps) => {
    return (
        <div 
            onClick={onClick}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 group relative overflow-hidden"
        >
            {/* Efecto de hover */}
            <div className="absolute inset-0 bg-[#4C9A2A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#4C9A2A]/10 group-hover:bg-[#4C9A2A]/20 transition-colors">
                    <div className="text-[#4C9A2A]">
                        {icon}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#4C9A2A] transition-colors">
                        {title}
                    </h3>
                    <p className="text-gray-500 mt-1 text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const router = useRouter();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex flex-col w-screen items-center justify-center p-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4C9A2A]"></div>
                <p className="text-gray-600 mt-4">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="light"
            />
            
            <div className="max-w-7xl mx-auto p-8">
                {/* Header con degradado */}
                <div className="bg-gradient-to-r from-[#4C9A2A] to-[#5BB032] rounded-2xl p-8 mb-8 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="mt-2 text-white/80">Gestiona Circulares y Mas!</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">
                            <div className="text-right">
                                <p className="text-sm text-white/80">Bienvenido,</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <span className="font-medium">{user.email?.[0].toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Grid de tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DashboardCard
                        title="Circulares"
                        description="Gestiona las circulares activas"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>}
                        onClick={() => router.push('/onboarding')}
                    />

                    <DashboardCard
                        title="Manager Sale "
                        description="Crea tus shelf stackers"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>}
                        onClick={() => router.push('/addProduct')}
                    />

                    <DashboardCard
                        title="Nueva Circular"
                        description="Crea una nueva circular"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>}
                        onClick={() => router.push('/addCircular')}
                    />

                    <DashboardCard
                        title="Whiteboard"
                        description="Previsualiza tus circulares y shelf stackers"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>}
                        onClick={() => router.push('/products')}
                    />

                    <DashboardCard
                        title="Estadísticas"
                        description="Visualiza métricas y reportes"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>}
                        onClick={() => router.push('/statistics')}
                    />

                    <DashboardCard
                        title="Configuración"
                        description="Ajustes de la aplicación"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>}
                        onClick={() => router.push('/settings')}
                    />

                    <DashboardCard
                        title="Tracking"
                        description="Seguimiento de producción de circulares"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>}
                        onClick={() => router.push('/tracking')}
                    />
                </div>
            </div>
        </div>
    );
>>>>>>> Stashed changes
};

export default DashboardPage; 