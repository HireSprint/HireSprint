'use client';
import React, {useEffect, useState} from "react";
import {parse} from "csv";
import {getClients} from "@/pages/api/apiMongo/getClients";
import {clientType} from "@/types/clients";
import {addCircular} from "@/pages/api/apiMongo/addCircular";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useForm} from "react-hook-form";
import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import { useAuth } from '@/app/components/provider/authprovider';

interface DataRow {
    [key: string]: string | number;
}

const AddCircular = () => {
    const {register, handleSubmit, reset, setValue, watch} = useForm({
        defaultValues: {
            circularName: "",
            weekCircular: "",
            dateCircular: "",
            idClient: "",
        },
        mode: "onChange",
    });

    const [csvFile, setCsvFile] = useState<object[]>([]);
    const { setReloadCircular } = useAuth();
    const [clientes, setClientes] = useState<clientType[] | []>([]);
    const [isReadyToSend, setIsReadyToSend] = useState(false);
    const [columns, setColumns] = useState<any>(null)

    useEffect(() => {
        const gettingClients = async () => {
            const resp = await getClients();
            if (resp.status === 200) {
                setClientes(resp.result);
            }
        };
        gettingClients();
    }, []);

    useEffect(() => {
        const values = watch();
        if (
            values.circularName &&
            values.weekCircular &&
            values.dateCircular &&
            values.idClient
        ) {
            setIsReadyToSend(true);
        } else {
            setIsReadyToSend(false);
        }
    }, [watch()]);

    //@ts-ignore
    const table = useReactTable({
        data: csvFile,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
                setCsvFile((old:any) =>
                    old.map((row:any, index:number) => {
                        if (index === rowIndex) {
                            return { ...row, [columnId]: value };
                        }
                        return row;
                    })
                );
            },
        },
    });

    //@ts-ignore
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result;

            if (typeof text === "string") {
                const [header, ...rows] = text.split("\n").map((row) => row.split(","));

                // Crear columnas dinámicamente
                const parsedColumns = header.map((col) => ({
                    accessorKey: col.trim(),
                    header: col.trim(),
                    cell: ({ getValue, row: { index }, column: { id }, table }: any) => {
                        const initialValue = getValue() as string;
                        const [value, setValue] = React.useState<string>(initialValue);

                        const onBlur = () => {
                            table.options.meta?.updateData(index, id, value);
                        };

                        React.useEffect(() => {
                            setValue(initialValue);
                        }, [initialValue]);

                        return (
                            <input
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onBlur={onBlur}
                            />
                        );
                    },
                }));

                const parsedData = rows.map((row) =>
                    row.reduce((acc, value, index) => {
                        acc[header[index].trim()] = value.trim();
                        return acc;
                    }, {} as Record<string, string>)
                );

                setColumns(parsedColumns);
                setCsvFile(parsedData);

                toast.success("¡Archivo cargado correctamente!");
            } else {
                console.error("Error: El contenido del archivo no es texto.");
                toast.error("Error: El contenido del archivo no es texto.");
            }
        };

        reader.onerror = () => {
            console.error("Error al leer el archivo.");
            toast.error("Error al leer el archivo.");
        };

        reader.readAsText(file);
    };

    const handleDeleteRow = (rowId: any) => {
        if (!csvFile) return;

        const updatedData = Object.values(csvFile).filter((_:any, index:any) => index.toString() !== rowId);
        setCsvFile(updatedData);
    };

    const onSubmit = async (data: any) => {
        if (isReadyToSend) {

            const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(data.dateCircular);
            if (!isValidDate) {
                toast.error("The date format must be YYYY-MM-DD");
                return;
            }

            const body = {
                id_client: Number(data.idClient),
                name_circular: data.circularName,
                week_circular: data.weekCircular,
                date_circular: data.dateCircular,
                circular_products_upc: csvFile,
            };

            const resp = await addCircular(body);
            if (resp.status === 201) {
                toast.success("¡Circular created successfully!");
                reset();
                setCsvFile([]);
                setReloadCircular(true);
            } else if (resp.status === 409) {
                toast.error("Date of the circular already exists!!");
            } else if (resp.status === 500) {
                toast.error(resp.message);
            } else {
                toast.error("Something is wrong!!");
            }
        }
    };

    return (
        <div className="flex bg-[#121212] overflow-y-auto no-scrollbar lg:h-screen">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col border-2 border-gray-600 bg-gray-800 w-3/4 h-full mx-auto my-10 p-6 rounded-lg shadow-lg overflow-y-auto no-scrollbar lg:h-4/5"
            >
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-bold text-white mb-4">Upload Products</h2>
                    <button
                        type="submit"
                        disabled={!isReadyToSend}
                        className="cursor-pointer m-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none"
                    >
                        Send
                    </button>
                </div>

                <div className="flex flex-col bg-gray-900 h-full w-full rounded-lg p-4">
                    <div className="flex flex-col mb-6 gap-5 md:flex-row md:justify-start px-4">
                        {/* Circular Name */}
                        <div className="flex flex-col w-full md:w-2/3">
                            <label
                                htmlFor="circularName"
                                className="text-lg font-semibold text-gray-300 mb-2 text-center md:text-left"
                            >
                                Circular Name
                            </label>
                            <input
                                {...register("circularName")}
                                className="bg-gray-700 text-gray-200 rounded-lg w-full h-12 p-2 focus:outline-none focus:ring-2 focus:ring-[#7cc304]"
                            />
                        </div>

                        {/* Client */}
                        <div className="flex flex-col w-full md:w-1/3">
                            <label
                                htmlFor="clientSelect"
                                className="text-lg font-semibold text-gray-300 mb-2 text-center md:text-left"
                            >
                                Customer
                            </label>
                            <select
                                {...register("idClient")}
                                className="bg-gray-700 text-gray-200 rounded-lg w-full h-12 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                <option value="" disabled selected>
                                    Select a customer
                                </option>
                                {clientes.map((client: clientType) => (
                                    <option key={client.id_client} value={client.id_client}>
                                        {client.client_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 px-6 lg:flex-row lg:items-start">
                        <div className="flex flex-col w-full lg:w-1/3">
                            <label
                                htmlFor="csvInput"
                                className="text-lg font-semibold text-gray-300 mb-2 text-center md:text-left"
                            >
                                Circular Week
                            </label>
                            <input
                                {...register("weekCircular")}
                                type="text"
                                className="bg-gray-700 text-gray-200 rounded-lg w-full h-12 mb-4 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        {/* Fecha Circular */}
                        <div className="flex flex-col w-full lg:w-1/3">
                            <label
                                htmlFor="dateInput"
                                className="text-lg font-semibold text-gray-300 mb-2 text-center md:text-left"
                            >
                                Date Circular
                            </label>
                            <input
                                {...register("dateCircular")}
                                type="date"
                                className="bg-gray-700 text-gray-200 rounded-lg w-full h-12 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full bg-gray-900 p-2 rounded-lg text-gray-200">
                        <label htmlFor="csvInput" className="text-lg font-semibold text-gray-300 mb-2 text-start">
                            Select a CSV File
                        </label>

                        <input
                            id="csvInput"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="  bg-gray-700 text-gray-200 rounded-lg w-2/3 h-12  mb-4 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />

                        <div className="overflow-y-auto bg-gray-800 text-gray-200 p-2 rounded-lg w-full h-64 mt-2">
                            <h2 className="text-lg font-bold mb-2 text-green-400">Data processed:</h2>
                            {csvFile.length > 0 ? (
                                <table
                                    className="min-w-full bg-gray-800 text-white table-auto border-collapse rounded-lg shadow-md overflow-hidden">
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
                                            {/* Columna de encabezado para eliminar */}
                                            <th
                                                className="px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider"
                                            >
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
                                                    className="px-2 py-2 text-md text-black bg-white "
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                            {/* Celda con el botón de eliminar */}
                                            <td className="px-2 py-2 text-md text-black bg-white">
                                                <button
                                                    onClick={() => handleDeleteRow(row.id)}
                                                    className="px-2 py-1 text-sm font-bold  text-red-500 rounded hover:bg-red-600 hover:text-white"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            ) : (
                                <p className="text-gray-400">No se han cargado datos todavía.</p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="light"
            />
        </div>
    )
}

export default AddCircular;
