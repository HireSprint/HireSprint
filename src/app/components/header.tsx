"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 

  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  return (
    <div className="flex justify-between items-center p-4 bg-background">
      <button className="text-2xl font-bold text-foreground" onClick={() => router.push('/')}>Retail Fluent</button>
      <div className="flex space-x-4 md:hidden">
        <button onClick={handleMenu} className="bg-green-200 text-black p-2">Menu</button>
      </div>
      <div className="justify-center items-center space-x-4 hidden lg:flex xl:flex md:flex">
        <button onClick={() => router.push('/diseno')} className="underline cursor-pointer hover:text-green-200">Agregar nuevo Diseño</button>
        <button className="underline cursor-pointer hover:text-green-200">Guardar Configuracion</button>
        <button className="underline cursor-pointer hover:text-green-200">Cargar Configuracion</button>
        <button className="underline cursor-pointer hover:text-green-200" onClick={() => router.push('/productos')}>Productos</button>

      </div>

      {isMenuOpen && (
        <div className="flex flex-col space-y-4 md:hidden items-start absolute bg-black p-3 top-16 right-0">
        <button onClick={() => router.push('/diseno')} className="underline cursor-pointer hover:text-green-200">Agregar nuevo Diseño</button>
        <button className="underline cursor-pointer hover:text-green-200">Guardar Configuracion</button>
        <button className="underline cursor-pointer hover:text-green-200">Cargar Configuracion</button>
        <button className="underline cursor-pointer hover:text-green-200" onClick={() => router.push('/productos')}>Productos</button>
        </div>
      )}
    </div>
  );
}