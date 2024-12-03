"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProductContext } from '../context/productContext';
import { MessageIcon, ProfileIcon, VideoIcon } from './icons';
import { usePathname } from 'next/navigation';
import { useAuth } from './provider/authprovider';
import ModalProductsTable from "@/app/components/ModalProductsTable";
import { formatDate } from './formaDate';

export default function Header() {
    const { user, logout, idCircular, setIdCircular } = useAuth();
    const { currentPage, setCurrentPage, setProductsData, setIsSendModalOpen } = useProductContext();
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [direction, setDirection] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [productTableOpen, setProductTableOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

    useEffect(() => {
        const getCircularDate = async () => {
            if (idCircular && pathname === '/') {
                try {
                    const circular = user?.circulars?.find(
                        (circ: any) => circ.id_circular === idCircular
                    );
                    
                } catch (error) {
                    console.error("Error al obtener la fecha del circular:", error);
                }
            }
        };

        getCircularDate();
    }, [idCircular, pathname, user]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        if (showDropdown) {
            timeoutId = setTimeout(() => {
                setShowDropdown(false);
            }, 5000); // 5000 ms = 5 segundos
        }

        // Limpieza del timeout cuando el componente se desmonta o showDropdown cambia
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [showDropdown]);

    const changePage = (newPage: number) => {
        setDirection(newPage > currentPage ? 1 : -1);
        setCurrentPage(newPage);
    };

    const handleOpenSendModal = () => {
        setIsSendModalOpen(true)
    }

    if (!user || pathname === '/login') {
        return null;
    }

    if (pathname === '/addProduct') {
        return (
            <div className="flex items-center p-4 bg-[#393939] space-x-4 justify-between ">
                <div className='flex items-center justify-center '>
                    <button className="flex items-center justify-center" onClick={() => router.push('/')}>
                        <Image src="/HPlogo.png" alt="Retail Fluent" width={70} height={70} />
                        <Image src="/nameLogo.png" alt="Retail Fluent" width={120} height={100} className='pt-3' />

                    </button>
                </div>
                <div className="justify-center items-center space-x-4 hidden lg:flex xl:flex md:flex ">
                    <p className='text-white text-xl font-bold hover:underline cursor-pointer'>Add Product</p>
                </div>
                <div className="relative">
                    <button onClick={() => setShowDropdown(!showDropdown)}>
                        <ProfileIcon />
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
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center p-4 bg-[#393939] space-x-4 justify-between ">
                <div className='flex items-center justify-center '>
                    <button className="flex items-center justify-center" onClick={() => router.push('/')}>
                        <Image src="/HPlogo.png" alt="Retail Fluent" width={70} height={70} />
                        <Image src="/nameLogo.png" alt="Retail Fluent" width={120} height={100} className='pt-3' />

                    </button>
                </div>
                <div className="justify-center items-center space-x-4 hidden lg:flex xl:flex md:flex ">
                    <p className='text-white text-xl font-bold hover:underline cursor-pointer'>
                        Client: {user?.userData.name}
                    </p>
                    {pathname === '/' && selectedDate && (
                        <p className='text-white text-xl font-bold hover:underline cursor-pointer'>
                            Circular: {selectedDate}
                        </p>
                    )}
                </div>
                <div className='flex items-center justify-center space-x-4 '>
                    {
                        pathname === '/' && (
                            <div className='flex items-center justify-center space-x-2 '>
                                <h1 className='text-white text-xl font-bold'>Page:</h1>
                                <button
                                    className={`bg-[#585858] text-white font-bold text-md h-8 w-8 rounded-lg hover:bg-[#7cc304] hover:text-black ${currentPage === 2 ? 'bg-[#7cc304] text-black' : ''}`}
                                    onClick={() => changePage(2)}>2
                                </button>
                                <button
                                    className={`bg-[#585858] text-white font-bold text-md h-8 w-8 rounded-lg hover:bg-[#7cc304] hover:text-black ${currentPage === 3 ? 'bg-[#7cc304] text-black' : ''}`}
                                    onClick={() => changePage(3)}>3
                                </button>
                                <button
                                    className={`bg-[#585858] text-white font-bold text-md h-8 w-8 rounded-lg hover:bg-[#7cc304] hover:text-black ${currentPage === 4 ? 'bg-[#7cc304] text-black' : ''}`}
                                    onClick={() => changePage(4)}>4
                                </button>
                            </div>
                        )
                    }
                    <div className="relative ">
                        <button onClick={() => setShowDropdown(!showDropdown)}>
                            <ProfileIcon />
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[100]">
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowDropdown(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                                <button
                                    onClick={() => {
                                        setProductTableOpen(true);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    View Products
                                </button>
                                <button
                                    onClick={() => {
                                        setIdCircular(null);
                                        localStorage.removeItem('id_circular');
                                        router.push('/onboarding');
                                        setShowDropdown(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Select Date
                                </button>
                            </div>
                        )}
                    </div>
                    {
                        pathname === '/' && (
                            <button onClick={handleOpenSendModal}>
                                <MessageIcon/>
                            </button>
                        )
                    }

                </div>
            </div>
            {
                productTableOpen && <ModalProductsTable  id_circular={idCircular} setProductTableOpen={setProductTableOpen} />
            }
        </>
    );
}
