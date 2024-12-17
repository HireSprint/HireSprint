import React, { useEffect, useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ProductTypes } from '@/types/product';
import { categoriesInterface } from '@/types/category';

interface EditableProductTableInterface {
    products: ProductTypes[];
    categories: categoriesInterface[]
    openModal: boolean;
    closeModal: (status: boolean) => void;
}

const EditableProductTable = ({
                                  products,
                                  openModal,
                                  closeModal,
                                  categories,
                              }: EditableProductTableInterface) => {
    const [LocalProducts, setLocalProducts] = useState<ProductTypes[]>(products);
    const [modifiedData, setModifiedData] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductTypes[]>(products);
    const [step, setStep] = useState<number>(1);
    const [columns] = useState([
        {
            accessorKey: 'upc',
            header: 'UPC',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'master_brand',
            header: 'Master Brand',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'brand',
            header: 'Brand',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'desc',
            header: 'Description',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'variety',
            header: 'Variety',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
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
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'pack',
            header: 'Pack',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'weight_symbol',
            header: 'Weight Symbol',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'embase',
            header: 'Embase',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'id_category',
            header: 'Category',
            cell: ({ getValue, row, column }: any) => (
                <select
                    className="border border-gray-300 rounded p-1 text-black"
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta.updateData(row.index, column.id, e.target.value)
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
                        table.options.meta.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
    ]);


    // const table = useReactTable({
    //     data:filteredProducts ,
    //     columns,
    //     getCoreRowModel: getCoreRowModel(),
    //     meta: {
    //         updateData: (rowIndex: number, columnId: string, value: unknown) => {
    //             setFilteredProducts((old:any) =>
    //                 old.map((row:any, index:number) => {
    //                     if (index === rowIndex) {
    //                         return { ...row, [columnId]: value };
    //                     }
    //                     return row;
    //                 })
    //             );
    //         },
    //     },
    // });

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

                            // Solo agregar a modifiedData si el valor es distinto
                            if (row[columnId] !== value) {
                                setModifiedData((prevModified) => {
                                    // Verificar si ya existe una entrada modificada
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

                                    // Si no existe, agregar la fila modificada
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
        setFilteredProducts(products.slice(step,step + 100))
    }, [step]);

    return openModal ? (
        <React.Fragment>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-100">
                <div className="relative w-4/5   h-[75vh] ">
                    <div className="absolute -right-5 -top-5 ">
                        <button onClick={() => closeModal(false)}
                                className=" bg-gray-500 p-4 rounded-full border-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28"
                                 viewBox="0 0 384 512">
                                <path fill="#ffffff"
                                      d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                        </button>
                    </div>
                    <div className="bg-gray-900 w-full h-full rounded-lg shadow-md p-6 overflow-y-auto scrollBar-none">
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
                                        <td
                                            key={cell.id}
                                            className="px-2 py-2 text-md text-black"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                    <td className="px-2 py-2 text-md text-black">
                                        <button
                                            onClick={() => {
                                                const filteredProducts = products.filter(
                                                    (_, index) => index !== row.index,
                                                );
                                                updateProducts(filteredProducts);
                                            }}
                                            className="px-2 py-1 text-sm font-bold text-red-500 rounded hover:bg-red-600 hover:text-white"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full flex justify-between text-center p-8 bg-gray-900">
                        <button className={"py-2 px-4 text-white bg-lime-600 rounded-md"}
                                onClick={() => step > 1 ? setStep(step - 1) : setStep(step)}>Back
                        </button>
                        <h1 className={"text-white text-4xl font-bold"}>{step}</h1>
                        <button className={"py-2 px-4 text-white bg-lime-600 rounded-md"}
                                onClick={() => setStep(step + 1)}>Next
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    ) : null;
};

export default EditableProductTable;
