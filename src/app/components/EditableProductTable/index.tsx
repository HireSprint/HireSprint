import React, { useEffect, useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ProductTypes } from '@/types/product';
import { categoriesInterface } from '@/types/category';
import { toast, ToastContainer } from 'react-toastify';
import { updateProduct } from '@/pages/api/apiMongo/updateProduct';

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends unknown> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}

interface EditableProductTableInterface {
    products: ProductTypes[];
    categories: categoriesInterface[]
    openModal: boolean;
    closeModal: (status: boolean) => void;
    reloadData: (status: boolean) => void;
}

const EditableProductTable = ({
    products,
    openModal,
    closeModal,
    categories,
    reloadData
}: EditableProductTableInterface) => {
    const [LocalProducts, setLocalProducts] = useState<ProductTypes[]>(products?.filter((item) => item.status_active === true).sort((a, b) => new Date(String(a.createdAt)).getTime() - new Date(String(b.createdAt)).getTime()));
    const [modifiedData, setModifiedData] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductTypes[]>(products?.filter((item) => item.status_active === true).sort((a, b) => new Date(String(a.createdAt)).getTime() - new Date(String(b.createdAt)).getTime()).slice(0, 100));
    const [filters, setFilters] = useState({ id_category: "", upc: "", brand: "", master_brand: "", desc: "", variety: "", date: "" });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [step, setStep] = useState<number>(1);
    const [reload, setReload] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(true);

    const [columns] = useState([
        {
            accessorKey: 'upc',
            header: 'UPC',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'master_brand',
            header: 'Master Brand',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'brand',
            header: 'Brand',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'desc',
            header: 'Description',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'variety',
            header: 'Variety',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'size',
            header: 'Size',
            cell: ({ getValue, row, column }: any) => (
                <input
                    type="number"
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'pack',
            header: 'Pack',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'weight_symbol',
            header: 'Weight Symbol',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'embase',
            header: 'Embase',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'id_category',
            header: 'Category',
            cell: ({ getValue, row, column }: any) => (
                <select
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                >
                    <option value=""> Select category</option>
                    {categories?.length > 0 && categories?.map((category: categoriesInterface) => (
                        <option key={category?.id_category} value={category?.id_category}>
                            {category?.name_category}
                        </option>
                    ))}
                    <option value="create">+ Add new category</option>
                </select>
            ),
        },
        {
            accessorKey: 'type_of_meat',
            header: 'Type of Meat',
            cell:
                ({ getValue, row, column }: any) => (
                    <input
                        className="border border-gray-300 rounded p-1 text-black"
                        value={getValue() || ''}
                        onChange={(e) =>
                            table.options.meta?.updateData(row.index, column.id, e.target.value)
                        }
                    />
                ),
        },
    ]);


    const table = useReactTable({
        data: filteredProducts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
                setFilteredProducts((old: any) =>
                    old.map((row: any, index: number) => {
                        if (index === rowIndex) {
                            const updatedRow = { ...row, [columnId]: value };

                            if (row[columnId] !== value) {
                                setModifiedData((prevModified) => {
                                    const exists = prevModified.some(
                                        (item) => item.index === rowIndex
                                    );

                                    if (exists) {
                                        return prevModified.map((item) =>
                                            item.index === rowIndex
                                                ? { ...updatedRow, index: rowIndex }
                                                : item
                                        );
                                    }

                                    return [...prevModified, { ...updatedRow, index: rowIndex }];
                                });
                            }

                            return updatedRow;
                        }
                        return row;
                    })
                );
            },
        },
    });

    useEffect(() => {
        if (!LocalProducts?.length) return;

        const filterMap = {
            id_category: (item: ProductTypes, value: string) =>
                value === "" || item.id_category === Number(value),
            upc: (item: ProductTypes, value: string) =>
                value.length < 3 || item.upc?.toLowerCase().includes(value.toLowerCase()),
            brand: (item: ProductTypes, value: string) =>
                value.length < 3 || item.brand?.toLowerCase().includes(value.toLowerCase()),
            master_brand: (item: ProductTypes, value: string) =>
                value.length < 3 || item.master_brand?.toLowerCase().includes(value.toLowerCase()),
            desc: (item: ProductTypes, value: string) =>
                value.length < 3 || item.desc?.toLowerCase().includes(value.toLowerCase()),
            variety: (item: ProductTypes, value: string) =>
                value.length < 3 || item.variety?.includes(value.toLowerCase()),
            date: (item: ProductTypes, value: string) => {
                if (value === "") return true; // No filtrar si el valor está vacío
                const itemDate = new Date(String(item.createdAt).split("T")[0]).toString(); // Asegúrate de obtener solo la fecha
                const filterDate = new Date(value).toString();
                return itemDate === filterDate;
            },
        };


        let newProduct = LocalProducts;

        newProduct = LocalProducts?.filter(item =>
            Object.entries(filterMap).every(([key, filterFn]) =>
                filterFn(item, debouncedFilters[key as keyof typeof debouncedFilters])
            )
        );

        // newProduct.sort((a, b) => {
        //     const comparison = new Date(String(a?.createdAt)).getTime() - new Date(String(b?.createdAt)).getTime();
        //     return debouncedFilters.orden === "true" ? comparison : -comparison;
        // });

        if (newProduct?.length < 100) {
            setStep(1);
            setFilteredProducts(newProduct);
        } else {
            const start = (step - 1) * 100;
            const end = start + 100;
            setFilteredProducts(newProduct.slice(start, end));
        }

        setTimeout(() => setLoadingScreen(false), 1000);
    }, [step, debouncedFilters, LocalProducts, reload]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    const isEdited = (targetItem: any) => {
        const isItemInList = modifiedData.some(
            (item) => item._id === targetItem._id && item.upc === targetItem.upc
        );
        return isItemInList;
    };

    const handledUpdate = async (item: ProductTypes | ProductTypes[]) => {
        const sendItem: ProductTypes = Array.isArray(item) ? item[0] : item

        const body = {
            "id_product": Number(sendItem.id_product),
            "upc": sendItem.upc,
            "master_brand": sendItem.master_brand,
            "brand": sendItem.brand,
            "desc": sendItem.desc,
            "size": sendItem.size,
            "pack": sendItem.pack,
            "w_simbol": sendItem.w_simbol,
            "embase": sendItem.embase,
            "id_category": sendItem.id_category,
            "type_of_meat": sendItem.type_of_meat
        }
        const resp = await updateProduct(body);
        if (resp.status === 200) {
            const lista_update = LocalProducts.map((item: ProductTypes) => item.id_product === sendItem.id_product ? sendItem : item)
            const lista_filtered = filteredProducts.map((item: ProductTypes) => item.id_product === sendItem.id_product ? sendItem : item)
            setLocalProducts(lista_update)
            setFilteredProducts(lista_filtered)
            setModifiedData(modifiedData.filter((item: ProductTypes) => item.id_product !== sendItem.id_product))
            toast.success(`Product ${sendItem.upc} updated successfully.`);
            return true
        } else {
            toast.error(`Product ${sendItem.upc} updated unsuccessfully.`);
            return false;
        }
    };

    const updateAllChange = async () => {
        const tempDataModified = [...modifiedData];

        const listaDeActualizada = await Promise.all(
            tempDataModified.map(async (sendItem: ProductTypes) => {
                const body = {
                    id_product: Number(sendItem.id_product),
                    upc: sendItem.upc,
                    master_brand: sendItem.master_brand,
                    brand: sendItem.brand,
                    desc: sendItem.desc,
                    size: sendItem.size,
                    pack: sendItem.pack,
                    w_simbol: sendItem.w_simbol,
                    embase: sendItem.embase,
                    id_category: sendItem.id_category,
                    type_of_meat: sendItem.type_of_meat,
                };

                try {
                    const resp = await updateProduct(body);
                    if (resp.status === 200) {
                        toast.success(`Product ${sendItem.upc} updated successfully.`);
                        return { success: true, sendItem };
                    } else {
                        toast.error(`Product ${sendItem.upc} updated unsuccessfully.`);
                        return { success: false, sendItem };
                    }
                } catch (error) {
                    toast.error(`Error updating product ${sendItem.upc}`);
                    return { success: false, sendItem };
                }
            })
        );

        const updatedProducts = listaDeActualizada
            .filter(item => item.success)
            .map(item => item.sendItem);

        const lista_update = LocalProducts.map((item: ProductTypes) =>
            updatedProducts.find(updated => updated.id_product === item.id_product) || item
        );

        const lista_filtered = filteredProducts.map((item: ProductTypes) =>
            updatedProducts.find(updated => updated.id_product === item.id_product) || item
        );

        setLocalProducts(lista_update);
        setFilteredProducts(lista_filtered);

        const idsUpdated = updatedProducts.map(item => item.id_product);
        setModifiedData(modifiedData.filter((item: ProductTypes) => !idsUpdated.includes(item.id_product)));

        console.log("Lista de subida:", listaDeActualizada);

        setReload(!reload);
    };

    useEffect(() => {
        console.log("filtros",filters)
    }, [filters]);

    return openModal ? (
        <React.Fragment>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-100 p-5">
                <div className="relative w-full h-[85vh] ">
                    <div className="absolute -right-5 -top-5 ">
                        <button onClick={() => (closeModal(false), reloadData(true))}
                            className=" bg-gray-500 p-4 rounded-full border-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28"
                                viewBox="0 0 384 512">
                                <path fill="#ffffff"
                                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                        </button>
                    </div>
                    <div className="w-full flex p-4 bg-gray-900 gap-5">
                        <div className="justify-start">
                            <label
                                htmlFor="dateInput"
                                className='text-start text-white'
                            >
                                Date Circular
                            </label>
                            <input
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                type="date"
                                className="w-full bg-gray-500 text-white p-2 rounded-md"
                            />
                        </div>
                        <div className="justify-start">
                            <label className={'text-start text-white'}>Master Brand</label>
                            <input className="w-full bg-gray-500 text-white p-2 rounded-md"
                                   onChange={(e) => setFilters({ ...filters, master_brand: e.target.value })} />
                        </div>
                        <div className="justify-start">
                            <label className={'text-start text-white'}>Brand</label>
                            <input className="w-full bg-gray-500 text-white p-2 rounded-md"
                                   onChange={(e) => setFilters({ ...filters, brand: e.target.value })} />
                        </div>
                        <div className="justify-start">
                            <label className={'text-start text-white'}>Description </label>
                            <input className="w-full bg-gray-500 text-white p-2 rounded-md"
                                onChange={(e) => setFilters({ ...filters, desc: e.target.value })} />
                        </div>
                        <div className="justify-start">
                            <label className={'text-start text-white'}>Variety</label>
                            <input className="w-full bg-gray-500 text-white p-2 rounded-md"
                                onChange={(e) => setFilters({ ...filters, variety: e.target.value })} />
                        </div>
                        <div className="justify-start">
                            <label className={'text-start text-white'}>Category</label>
                            <select
                                name=""
                                id=""
                                onChange={(e) => setFilters({ ...filters, id_category: e.target.value })}
                                className={'w-full bg-gray-500 text-white p-2 rounded-md'}
                                defaultValue=""
                            >
                                <option value="">
                                    Seleccionar una Categoría
                                </option>
                                {categories.map((client: categoriesInterface) => (
                                    <option key={client.id_category} value={client.id_category}>
                                        {client.name_category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="justify-start mx-10">
                            <label className={'text-start text-white'}>save</label>
                            <button
                                disabled={!(modifiedData.length > 0)}
                                onClick={() => updateAllChange()}
                                className="w-full px-4 py-2 text-sm font-bold text-white rounded bg-lime-600 hover:scale-110 disabled:bg-gray-500 "
                            >
                                Update All
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-900 w-full h-4/5 shadow-md p-4 overflow-y-auto scrollBar-none">
                        {loadingScreen ? (
                            <div className="space-y-4">
                                {/* Header Skeleton */}
                                <div
                                    className="bg-gray-800 text-white table-auto border-collapse rounded-lg overflow-hidden">
                                    <div className="bg-gray-900">
                                        <div
                                            className="px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider h-8 bg-gray-700 animate-pulse"></div>
                                        <div
                                            className="px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider h-8 bg-gray-700 animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Rows Skeleton */}
                                <div className="space-y-2">
                                    {Array(5)
                                        .fill(0)
                                        .map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-2 px-4 bg-gray-800 border-t border-gray-700 animate-pulse"
                                            >
                                                <div className="w-1/3 h-6 bg-gray-700 rounded"></div>
                                                <div className="w-1/3 h-6 bg-gray-700 rounded"></div>
                                                <div className="w-1/3 h-6 bg-gray-700 rounded"></div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ) : (
                            <table
                                className="min-w-full bg-gray-800 text-white table-auto border-collapse rounded-lg overflow-hidden">
                                <thead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id} className="bg-gray-900">
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    className="px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider"
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </th>
                                            ))}
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider">
                                                Acción
                                            </th>
                                        </tr>
                                    ))}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-700 border-t border-gray-600">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-2 py-2 text-md text-black">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                            <td className="px-2 py-2 text-md text-black items-center">
                                                <button
                                                    disabled={!isEdited(row.original)}
                                                    onClick={() => {
                                                        const filteredProduct = filteredProducts.filter(
                                                            (_, index) => index === row.index
                                                        );
                                                        handledUpdate(filteredProduct);
                                                    }}
                                                    className="px-6 py-1 text-sm font-bold text-white rounded bg-lime-600 hover:scale-110 disabled:bg-gray-500"
                                                >
                                                    save
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="w-full flex justify-between text-center p-8 bg-gray-900">
                        <button className={"py-2 px-4 text-white bg-lime-600 rounded-md"}
                            onClick={() => { step > 1 ? (setStep(step - 1), setLoadingScreen(true)) : setStep(step); }}>Back
                        </button>
                        <h1 className={"text-white text-4xl font-bold"}>{step}</h1>
                        <button className={"py-2 px-4 text-white bg-lime-600 rounded-md"}
                            onClick={() => { filteredProducts.length > 99 && (setStep(step + 1), setLoadingScreen(true)) }}>Next
                        </button>
                    </div>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    theme="light"
                />
            </div>
        </React.Fragment>
    ) : null;
};

export default EditableProductTable;
