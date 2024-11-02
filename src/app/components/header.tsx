"use client";

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {getProduct} from "@/app/api/mongo/getProduct";


export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


    useEffect(() => {
        const getProductoFetch = async () => {
            await getProduct();
        }
        getProductoFetch();

    }, []);




  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  return (
    <div className="flex justify-between items-center p-4 bg-[#393939]">
      <button className="text-2xl font-bold text-foreground" onClick={() => router.push('/')}>
        <Image src="/file/logo1.png" alt="Retail Fluent" width={70} height={70} />
      </button>
      <div className="flex space-x-4 md:hidden">
        <button onClick={handleMenu} className="bg-green-200 text-black p-2">Menu</button>
      </div>
      <div className="justify-center items-center space-x-4 hidden lg:flex xl:flex md:flex">
        <button onClick={() => router.push('/diseno')} className="underline cursor-pointer hover:text-[#7cc304]">Agregar nuevo Diseño</button>
        <button className="underline cursor-pointer hover:text-[#7cc304]" onClick={() => router.push('/productos')}>Productos</button>
        <button className="underline cursor-pointer hover:text-[#7cc304]" onClick={() => router.push('/pdfComp')}>PDF</button>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col space-y-4 md:hidden items-start absolute bg-black p-3 top-16 right-0">
        <button onClick={() => router.push('/diseno')} className="underline cursor-pointer hover:text-green-200">Agregar nuevo Diseño</button>
        <button className="underline cursor-pointer hover:text-green-200" onClick={() => router.push('/productos')}>Productos</button>
        </div>
      )}
    </div>
  );
}
