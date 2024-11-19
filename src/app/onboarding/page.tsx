"use client"

import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const OnboardingPage = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="text-black text-2xl pt-10 flex flex-col h-[calc(100vh-100px)]">
            <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-4 justify-center items-center w-full">
                <div className="flex flex-col">
                    <label htmlFor="date" className="block text-lg font-medium text-gray-700">Date</label>
                    <select id="date" {...register("date")} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="11/22/2024">11/22/2024</option>
                        <option value="11/30/2024">11/30/2024</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="shape" className="block text-lg font-medium text-gray-700">Circular Options</label>
                    <select id="shape" {...register("shape")} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="Circular 1">Option 1</option>
                    </select>
                </div>
            </form>
            <button type="submit" className="bg-[#7cc304] text-white p-2 rounded-md text-center w-fit mx-auto mt-4" onClick={() => router.push('/')}>Submit</button>
        </div>
    );
};

export default OnboardingPage;