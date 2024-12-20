'use client'

import { useEffect, useState } from 'react';
import { getClientContribution } from '@/pages/api/apiMongo/getClientContribution';

interface clientContributionReportInterface {
    client_name:string
    id_client:number
    level_client:number
    product_count:number
}

const contributionReport = () => {

    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [clientContributors, setClientContributors] = useState<clientContributionReportInterface[]|[]>([]);

    useEffect(() => {
        const getContributionReport = async () => {
            const resp = await getClientContribution();
            console.log("test",resp);
            setTotalProducts(resp.totalProducts);
            setClientContributors(resp.result);
        }
        getContributionReport()
    }, []);

    return(
        <div className={'flex flex-col w-full h-full bg-gray-50 py-8'}>
            {/* Header Section */}
            <div className={'w-full text-center mb-8'}>
                <h1 className={'text-gray-800 text-5xl font-extrabold'}>Total Productos</h1>
                <h2 className={'text-lime-600 text-4xl font-bold mt-2'}>{totalProducts}</h2>
            </div>

            {/* Contributors Section */}
            <div className={'flex flex-wrap w-full justify-center gap-8'}>
                {clientContributors.length > 0 && clientContributors.map((clientContributor) => {
                    const percentage = Math.round((clientContributor.product_count / totalProducts) * 100);
                    const strokeDasharray = `${percentage} ${100 - percentage}`;

                    return (
                        <div
                            className={'w-1/4 bg-white shadow-md rounded-lg py-6 flex flex-col items-center border border-gray-200'}
                            key={clientContributor.id_client}
                        >
                            <h2 className={'text-xl font-semibold text-gray-700 mb-2'}>{clientContributor.client_name}</h2>
                            <div className="relative w-32 h-32">
                                <svg
                                    className="transform -rotate-90"
                                    width="140"
                                    height="140"
                                    viewBox="0 0 36 36"
                                >
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        stroke="#e5e7eb" // Background color
                                        strokeWidth="4"
                                    />
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        stroke="#65a30d" // Progress color
                                        strokeWidth="4"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset="25"
                                    />
                                </svg>
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center text-blue-600 font-bold">
                                    <span className="text-lg">{percentage}%</span>
                                    <span
                                        className="text-sm text-gray-500">{clientContributor.product_count} / {totalProducts}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
};

export default contributionReport;
