"use client";

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {Calendar} from 'primereact/calendar';
import {Nullable} from "primereact/ts-helpers";
import {useProductContext} from '../context/productContext';
import {MessageIcon, ProfileIcon, VideoIcon} from './icons';
import {usePathname} from 'next/navigation';
import {addGoogleSheet3} from "@/app/api/productos/prductosRF";
import {useCategoryContext} from "@/app/context/categoryContext";
import { useAuth } from './provider/authprovider';

export default function Header() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user || pathname === '/login') {
        return null;
    }

    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
    const {currentPage, setCurrentPage, productsData, setProductsData} = useProductContext();
    const [direction, setDirection] = useState(0);
    const {categoriesData} = useCategoryContext()
    const {selectedProducts} = useProductContext();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getProduct");
                const data = await resp.json();
                setProductsData(data.result);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        getProductView();
    }, []);


    const handleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const changePage = (newPage: number) => {
        setDirection(newPage > currentPage ? 1 : -1);
        setCurrentPage(newPage);
    };
   
    const enviarGoogle = () =>{
        addGoogleSheet3('hojaPrueba2', categoriesData, selectedProducts);
    }
  
    return (
        
        <div className="flex items-center p-4 bg-[#393939] space-x-4 justify-between ">
            <div className='flex items-center justify-center '>
                <button className="flex items-center justify-center" onClick={() => router.push('/')}>
                    <Image src="/HPlogo.png" alt="Retail Fluent" width={70} height={70}/>
                    <Image src="/nameLogo.png" alt="Retail Fluent" width={120} height={100} className='pt-3'/>

                </button>
            </div>
            <div className="flex space-x-4 md:hidden">
                <button onClick={handleMenu} className="bg-green-200 text-black p-2">Menu</button>
            </div>
            <div className="justify-center items-center space-x-4 hidden lg:flex xl:flex md:flex ">
                {/* <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection showIcon />*/}
                <p className='text-white text-xl font-bold hover:underline cursor-pointer' onClick={() => router.push('/profile')}>Client: {user?.userData.name}</p>
            </div>
            <div className='flex items-center justify-center space-x-2 pl-8'>
                <button>
                    <VideoIcon/>
                </button>
                <div className="relative">
                    <button onClick={() => setShowDropdown(!showDropdown)}>
                        <ProfileIcon/>
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <button
                                onClick={() => {
                                    logout();
                                    setShowDropdown(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                <button onClick={() => enviarGoogle()}>
                    <MessageIcon/>
                </button>
            </div>
            {isMenuOpen && (
                <div className="flex flex-col space-y-4 md:hidden items-start absolute bg-black p-3 top-16 right-0">
                    <button onClick={() => router.push('/diseno')}
                            className="underline cursor-pointer hover:text-green-200">Agregar nuevo Diseño
                    </button>
                    <button className="underline cursor-pointer hover:text-green-200"
                            onClick={() => router.push('/productos')}>Productos
                    </button>
                </div>
            )}
        </div>
    );
}
