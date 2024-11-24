"use client"

import { useRouter, useParams} from "next/navigation";
import React, {useEffect, useMemo, useState} from "react";
import { useAuth } from "../../components/provider/authprovider"
import { useProductContext } from "../../context/productContext";


import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {ProductTypes} from "@/types/product";
import {getProductsByCircular} from "@/pages/api/apiMongo/getProductsByCircular";
import Link from "next/link";
import {STRING} from "postcss-selector-parser";

const columnHelper = createColumnHelper<ProductTypes>();

//@ts-ignore
const columns = [
    columnHelper.display({
        id: 'row_number',
        header: () => '#',
        cell: info => `#${info.row.index + 1}`, // El índice de la fila empieza en 0, se suma 1 para numerar desde 1.
        footer: () => '#',
    }),
    columnHelper.accessor('id_grid', {
        cell: info => info.getValue(),
        header: () => 'id_grid',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('id_category', {
        cell: info => info.getValue(),
        header: () => 'Category ID',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('name', {
        cell: info => info.getValue() || 'No Name',
        header: () => 'Name',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('brand', {
        cell: info => info.getValue(),
        header: () => 'Brand',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('upc', {
        cell: info => info.getValue(),
        header: () => 'UPC',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('size', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Size',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('price', {
        cell: info => `$${info.getValue().toFixed(2)}`,
        header: () => 'Price',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('sale_price', {
        cell: info => `$${info.getValue() || '0.00'}`,
        header: () => 'Sale Price',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('id_product', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Product ID',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('quantity', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Quantity',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('type_of_meat', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Type of Meat',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('master_brand', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Master Brand',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('type_of_cut', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Type of Cut',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('quality_cf', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Quality CF',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('conditions', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Conditions',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('sku', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'SKU',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('desc', {
        cell: info => info.getValue() || 'No Description',
        header: () => 'Description',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('main', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Main',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('addl', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Additional',
        footer: info => info.column.id,
    }),
    // columnHelper.accessor('url_image', {
    //     cell: (info) => info.getValue()?"True":"False",
    //     header: () => 'url_image',
    //     footer: (info) => info.column.id,
    // }),
];

type ParamsType = {
    id_circular: number; // Cambia el tipo según corresponda
};


const ProductsTable = ({id_circular}:ParamsType) => {
    const {user, circulars, setIdCircular } = useAuth();

    const [circularProducts, setCircularProducts] = useState<ProductTypes[]>([])
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const getProductByCircular = async () => {
            try {
                const reqBody = {
                    "id_circular":Number(id_circular),
                    "id_client":user.userData.id_client
                }
                const resp = await getProductsByCircular(reqBody)
                console.log(resp)
                setCircularProducts(resp.result)
                setLoading(false)
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        getProductByCircular();
    }, [id_circular, user]);

    const table = useReactTable({
        data: circularProducts.sort((a:ProductTypes,b:ProductTypes) => a.id_grid - b.id_grid),
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="text-black text-2xl p-8 flex flex-col h-[calc(80vh-100px)] w-screen">
            <div className={"flex flex-row items-center justify-between mb-4"}>
                <h2 className="font-bold mb-2">Products table</h2>
            </div>
            <div className="flex flex-col w-full h-full  overflow-x-auto overflow-y-auto">
                {loading ? (
                    // Skeleton Loader
                    <div className="animate-pulse space-y-4">
                        <div className="bg-gray-300 h-8 w-full rounded-md"></div>
                        <div className="bg-gray-300 h-16 w-full rounded-md"></div>
                        <div className="bg-gray-300 h-16 w-full rounded-md"></div>
                        <div className="bg-gray-300 h-16 w-full rounded-md"></div>
                    </div>
                ) : (
                    <table className="border border-gray-300">
                        <thead>
                        {table.getHeaderGroups().map((headerGroup,index) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border-b border-gray-300 p-2 text-left bg-lime-600 text-gray-700 "

                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="bg-gray-100">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="border-2 border-gray-300 p-2"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        {table.getFooterGroups().map((footerGroup) => (
                            <tr key={footerGroup.id}>
                                {footerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border-t border-gray-300 p-2 text-left bg-lime-600 text-gray-700"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.footer,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </tfoot>
                    </table>
                )}
            </div>
        </div>
    )
};

export default ProductsTable;
