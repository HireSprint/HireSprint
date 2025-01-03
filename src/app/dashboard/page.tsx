"use client"

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
};

export default DashboardPage; 