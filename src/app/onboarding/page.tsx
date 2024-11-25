"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../components/provider/authprovider";
import ProductsTable from "@/app/components/ProductsTable";

const OnboardingPage = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm();
    const {user, circulars, setIdCircular } = useAuth();
    const [selectedCircular, setSelectedCircular] = useState<any>(null);

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
        const circular = circulars?.find((circular: any) =>
            circular.date_circular === selectedDate
        );
        setSelectedCircular(circular || null);
    };

    const handleContinue = () => {
        if (selectedCircular) {
            router.push('/');
        }
    };

    // Función para formatear la fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('es-ES', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };


    return (
        <div className="text-black text-2xl pt-10 flex flex-col h-[calc(100vh-100px)]">
            {user ? (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 items-center w-full">
                    <div className="flex flex-col w-64">
                        <label htmlFor="date" className="block text-lg font-medium text-gray-700">Date of circulars</label>
                        <select
                            id="date"
                            {...register("date")}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            onChange={handleDateSelect}
                        >
                            <option value="">select a date</option>
                            {circularOptions.map((circular: any) => (
                                <option key={circular.date_circular} value={circular.date_circular}>
                                    {formatDate(circular.date_circular)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCircular && (
                        <div className={"flex flex-row h-12  w-full justify-center gap-5"}>
                            <button
                                type="button"
                                onClick={handleContinue}
                                className="bg-[#7cc304] text-white p-2 rounded-md text-center w-fit"
                            >
                                Continue
                            </button>
                        </div>
                    )}
                    {
                        selectedCircular && <div className={"flex flex-col w-screen"}>
                            <ProductsTable id_circular={selectedCircular.id_circular}/>
                        </div>
                    }
                </form>
            ) : (
                <div>Cargando...</div>
            )}
        </div>
    );
};

export default OnboardingPage;
