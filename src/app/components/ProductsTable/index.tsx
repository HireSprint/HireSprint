"use client"

import React, {useEffect, useState} from "react";
import { useAuth } from "../../components/provider/authprovider"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {ProductTypes} from "@/types/product";
import {getProductsByCircular} from "@/pages/api/apiMongo/getProductsByCircular";
import { useCategoryContext } from "../../context/categoryContext";
import {categoriesInterface} from "@/types/category";
import {meta} from "eslint-plugin-react/lib/rules/jsx-props-no-spread-multi";
import category = meta.docs.category;
import {RowData} from "@tanstack/table-core";
import {clientType} from "@/types/clients";
import {number} from "prop-types";


const columnHelper = createColumnHelper<ProductTypes>();



declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select'
    }
}
//@ts-ignore
const columns = [
    columnHelper.display({
        id: 'row_number',
        header: () => 'Amount',
        cell: info => `${info.row.index + 1}`, // El índice de la fila empieza en 0, se suma 1 para numerar desde 1.
        footer: () => 'Amount',
    }),
    columnHelper.accessor('category', {
        cell: info => info.getValue(),
        header: () => 'Category',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('id_grid', {
        cell: info => info.getValue(),
        header: () => 'id_grid',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('upc', {
        cell: info => info.getValue(),
        header: () => 'UPC',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('master_brand', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Master Brand',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('brand', {
        cell: info => info.getValue(),
        header: () => 'Brand',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('size', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Size',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('desc', {
        cell: info => info.getValue() || 'No Description',
        header: () => 'Description',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('price', {
        cell: info => `$${info.getValue()}`,
        header: () => 'Price',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('sku', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'SKU',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('quality_cf', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Quality CF',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('type_of_meat', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Type of Meat',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('type_of_cut', {
        cell: info => info.getValue() || 'N/A',
        header: () => 'Type of Cut',
        footer: info => info.column.id,
    })
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
    const {user } = useAuth();

    const [circularProducts, setCircularProducts] = useState<ProductTypes[]>([])
    const [filteredProduct, setFilteredProduct] = useState<ProductTypes[]>([])
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<categoriesInterface[]|[]>([])
    const [numberOfPage, setNumberOfPage] = useState<number[]|[]>([])
    const [filters, setFilters] = useState({ id_category: "",page:"", upc: "" });



    useEffect(() => {
        const getProductByCircular = async () => {
            try {
                const reqBody = {
                    "id_circular":Number(id_circular),
                    "id_client":user.userData.id_client
                }
                const respCategories = await fetch("/api/apiMongo/getCategories");
                const data = await respCategories.json();
                const resp = await getProductsByCircular(reqBody)
                if (resp.length <= 0){

                    setLoading(false)
                }else{
                    const productos = resp.result.map((item: ProductTypes) => {
                        const category = data.result.find(
                            (cat: categoriesInterface) => cat.id_category === item.id_category
                        );
                        return { ...item, category: category.name_category || "Unknown" };
                    });


                    setCircularProducts(productos.filter((product: ProductTypes) => product.id_grid !== undefined).sort((a: ProductTypes, b: ProductTypes) => (a.id_grid! - b.id_grid!)))
                    setFilteredProduct(productos.filter((product: ProductTypes) => product.id_grid !== undefined).sort((a: ProductTypes, b: ProductTypes) => (a.id_grid! - b.id_grid!)))
                    setCategories(data.result)
                    setLoading(false)
                }
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        getProductByCircular();
    }, [id_circular, user]);

    useEffect(() => {
        if (circularProducts.length > 0) {
            const arraGrid: number[] = [];

            circularProducts.forEach((item: ProductTypes) => {

                const pageNumber = Math.floor(Number(item?.id_grid) / 1000);
                if (!arraGrid.includes(pageNumber)) {
                    arraGrid.push(pageNumber);
                }
            });

            setNumberOfPage(arraGrid);
        }
    }, [circularProducts]);

    const numberPage = (grid_id:number|undefined) => {
        if(grid_id !== undefined) {
            const numberOfPage = grid_id / 1000;
            return numberOfPage.toFixed(0);
        }else {
            return null
        }
    }

    useEffect(() => {
        if (circularProducts && circularProducts.length > 0) {
            let newProduct = circularProducts
            if(filters.id_category !== "") {
                newProduct = newProduct.filter((item: ProductTypes) => (
                    item.id_category === Number(filters.id_category)
                ))
                console.log("filtro cat",newProduct)
            }
            if(filters.page !== "") {
                newProduct = newProduct.filter((item: ProductTypes) => (
                    numberPage(item.id_grid) === filters.page
                ))
                console.log("filtro page",newProduct,filters.page)
            }
            if(filters.upc !== "") {
                newProduct = newProduct.filter((item: ProductTypes) => (
                    item.upc.includes(filters.upc) // Coincidencia parcial
                ));
                console.log("filtro upc (parcial)", newProduct, filters.upc);
            }
            console.log(newProduct,filters.id_category)
            setFilteredProduct(newProduct)
        }
    }, [filters]);



    const table = useReactTable({
        data: filteredProduct,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });


    return (
        <div className="text-black text-2xl p-8 flex flex-col h-[calc(90vh-50px)] w-full">
            <div className={"flex flex-row items-center justify-between mb-4"}>
                <h2 className="font-bold mb-0">Products table</h2>
            </div>
            <div className="flex flex-row gap-5 mb-4 ">
                <select name="" id="" onChange={(e)=> setFilters({...filters, id_category: e.target.value})} className={"rounded-lg text-lg pl-2 "}>
                    <option value="" disabled selected>
                        Select a Category
                    </option>
                    {categories.map((client: categoriesInterface) => (
                        <option key={client.id_category} value={client.id_category}>
                            {client.name_category}
                        </option>
                    ))}
                </select>
                <select name="" id="" onChange={(e)=> setFilters({...filters, page: e.target.value})} className={"px-4 rounded-lg text-lg"}>
                    <option value="" disabled selected>
                        Select a Page
                    </option>
                    {numberOfPage.map((client) => (
                        <option key={client} value={client}>
                            {client}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Filter by UPC"
                    className="border border-gray-300 p-2  rounded-lg text-lg"
                    onChange={(e)=> setFilters({...filters, upc: e.target.value})}
                />
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
                    <div className="overflow-y-auto max-h-[800px] border border-gray-300 relative">
                        <table className="border-collapse border border-gray-300 w-full">
                            <thead className="bg-[#393939] text-[#7cc304]">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="border-b border-t border-gray-300 p-2 text-left text-lg sticky top-0 z-10 bg-[#393939]"
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
                                            className="border-2 border-gray-300 p-2 text-lg"
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
                        </table>
                        {
                            filteredProduct.length <= 0 &&
                            <div className={"flex flex-row w-full items-center justify-center text-center h-64 bg-white"}>
                                <h1>Product not listed</h1>
                            </div>
                        }
                    </div>

                )}
            </div>
        </div>
    )
};

export default ProductsTable;
