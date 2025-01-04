"use client"

<<<<<<< Updated upstream
import React from 'react';
import DashboardCard from '../components/dashboard/dashboardCard';
import { dashboardIcons } from '../components/dashboard/dashboardIcons';



const DashboardPage = () => {

  const cardsTitle = ["Proyectos", "Recursos", "Clientes", "Plantillas", "Calendario", "Estadísticas"];
  const cardsDescription = ["Gestiona proyectos de diseño activos", "Biblioteca de recursos gráficos", "Administra información de clientes", "Gestiona plantillas de diseño", "Programa y gestiona entregas", "Métricas y análisis de proyectos"];
  const cardsIcon = dashboardIcons;
  const cardsHref = ["/proyectos", "/recursos", "/clientes", "/plantillas", "/calendario", "/estadisticas"];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Control de Diseño</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <DashboardCard
            key={index}
            title={cardsTitle[index]}
            description={cardsDescription[index]}
            icon={cardsIcon[cardsTitle[index] as keyof typeof cardsIcon]}
            href={cardsHref[index]}
          />
        ))}
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
                        title="Manager Sale"
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