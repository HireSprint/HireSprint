"use client"

import React from 'react';
import { useState } from 'react';
import DesignComponent from './desing';
import { useRouter } from 'next/navigation';


export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesignOpen, setIsDesignOpen] = useState(false);
  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  const toggleDesign = () => {
    setIsDesignOpen(!isDesignOpen); 
  };


  return (
    <div className="flex justify-between items-center p-4 bg-background">
      <h1 className="text-2xl font-bold text-foreground">Retail Fluent</h1>
      <div className="flex space-x-4 md:hidden">
          <button onClick={handleMenu} className="bg-green-200 text-black p-2">Menu</button>
      </div>
      <div className="flex justify-center items-center space-x-4 hidden lg:block xl:block md:block md:flex lg:flex">
          <button onClick={toggleDesign} className="underline cursor-pointer hover:text-green-200">Agregar nuevo Diseño </button>
          <button className="underline cursor-pointer hover:text-green-200">Guardar Configuracion</button>
          <button className="underline cursor-pointer hover:text-green-200">Cargar Configuracion</button>
          <button className="underline cursor-pointer hover:text-green-200" onClick={ () => router.push('/productos')}>Productos</button>
          <input type="text" className="p-2 text-center" placeholder="Nombre de la tabla" />
          <button className="bg-green-200 text-black p-2">Sincronizar con airtable</button>
        </div>
        {isDesignOpen && (
        <div className="absolute bg-white shadow-lg p-4 h-48 top-[72px] left-[800px]">
          <DesignComponent />
        </div>
      )}
        {isMenuOpen && (
        <div className="flex flex-col space-y-4 md:hidden items-start absolute bg-black p-3 top-16 right-0">
          <button className="underline cursor-pointer hover:text-green-200">Agregar nuevo Diseño</button>
          <button className="underline cursor-pointer hover:text-green-200">Guardar Configuracion</button>
          <button className="underline cursor-pointer hover:text-green-200">Cargar Configuracion</button>
          <button className="underline cursor-pointer hover:text-green-200">Exportar a Excel</button>
          <input type="text" className="p-2 text-center w-3/4" placeholder="Nombre de la tabla" />
          <button className="bg-green-200 text-black p-2">Sincronizar con airtable</button>
        </div>
      )}
    </div>
    
  );
}

