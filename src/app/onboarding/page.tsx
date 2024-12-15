"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../components/provider/authprovider";
import ProductsTable from "@/app/components/ProductsTable";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatDate } from "../components/formaDate";

const OnboardingPage = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm();
    const { user, circulars, setIdCircular } = useAuth();
    const [selectedCircular, setSelectedCircular] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const onSubmit = (data: any) => {
        const selectedCircular = circulars.find((circular: any) =>
            circular.date_circular === data.date
        );

        if (selectedCircular?.id_circular) {
            setIdCircular(selectedCircular.id_circular);
            router.push('/');
        } else {
            console.error("No se encontró un ID de circular válido");
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    const circularOptions = user ? circulars.filter((cic: any) => cic.user_id === user.id) : [];

    const handleDateSelect = (e: any) => {
        const selectedDate = e.target.value;
        setIsLoading(true);

        // Encontrar el circular correspondiente
        const circular = circulars?.find((circular: any) =>
            circular.date_circular === selectedDate
        );

        // Limpiar el circular seleccionado primero
        setSelectedCircular(null);

        // Simular loading
        setTimeout(() => {
            setSelectedCircular(circular || null);
            setIsLoading(false);
        }, 2000);
    };

    const handleContinue = async () => {
        try {
            setIsRedirecting(true);
            if (selectedCircular?.id_circular) {
                setIdCircular(selectedCircular.id_circular);
                await router.push('/');
            } else {
                toast.error("No se ha seleccionado un circular válido");
            }
        } catch (error) {
            console.error("Error al redireccionar:", error);
            toast.error("Error al redireccionar");
        } finally {
            setIsRedirecting(false);
        }
    };

    return (
        <div className="text-black bg-gray-100 text-2xl py-5 flex flex-col h-[calc(100vh)]">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="light"
            />
            {user ? (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 items-center w-full">
                    <div className="flex flex-row w-2/3 justify-center items-center">
                        <div className="flex flex-row w-2/3 justify-center items-center gap-5">
                            <label htmlFor="date" className="block text-lg font-medium text-gray-700">Date of
                                circulars</label>
                            <select
                                id="date"
                                {...register("date")}
                                className="mt-1 block w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                onChange={handleDateSelect}
                            >
                                <option
                                    value="">{circularOptions.length === 0 ? "No circulars available" : "Select a date"}</option>
                                {circularOptions.map((circular: any) => (
                                    <option key={circular.date_circular} value={circular.date_circular}>
                                        {formatDate(circular.date_circular)}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleContinue}
                                disabled={isRedirecting}
                                className={`bg-[#7cc304] text-white p-1 rounded-md text-center text-lg ${isRedirecting ? 'opacity-50 cursor-not-allowed' : `hover:bg-[#6bb003] ${selectedCircular?'none':'hidden'}`
                                }`}
                            >
                                {isRedirecting ? (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        Redirigiendo...
                                    </div>
                                ) : (
                                    'Continue'
                                )}
                            </button>
                        </div>


                    </div>

                    {(isLoading || isRedirecting) ? (
                        <div className={"flex flex-col w-screen items-center justify-center p-10"}>
                            <div
                                className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7cc304]"></div>
                            <p className="text-gray-600 mt-4">
                                {isRedirecting ? "Redirecting..." : "Products loading..."}
                            </p>
                        </div>
                    ) : (
                        selectedCircular &&
                        <div className={"flex flex-col w-screen"}>
                            <ProductsTable id_circular={selectedCircular.id_circular}/>
                        </div>
                    )}
                </form>
            ) : (
                <div>Cargando...</div>
            )}
        </div>
    );
};

export default OnboardingPage;
