'use client';
import {useEffect, useState} from "react";
import {parse} from "csv";
import {getClients} from "@/pages/api/apiMongo/getClients";
import {clientType} from "@/types/clients";
import {addCircular} from "@/pages/api/apiMongo/addCircular";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useForm} from "react-hook-form";

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

    const [csvFile, setCsvFile] = useState<[] | object | null>(null);
    const [clientes, setClientes] = useState<clientType[] | []>([]);
    const [isReadyToSend, setIsReadyToSend] = useState(false);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const text = reader.result;

                if (typeof text === "string") {
                    parse(
                        text,
                        {
                            columns: true,
                            skip_empty_lines: true,
                        },
                        (err, records: object[]) => {
                            if (err) {
                                console.error("Error al procesar el archivo CSV:", err);
                                toast.error("Error al procesar el archivo CSV");
                                return;
                            }
                            setCsvFile(records);
                            toast.success("¡Archivo cargado correctamente!");
                        }
                    );
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
        }
    };

    const onSubmit = async (data: any) => {
        if (isReadyToSend) {
            // Validar formato de la fecha antes de enviar
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
                setCsvFile(null);
            } else if (resp.status === 409) {
                toast.error("Date of the circular already exists!!");
            } else {
                toast.error("Something is wrong!!");
            }
        }
    };

    return (
        <div className="flex bg-[#121212] overflow-y-auto no-scrollbar lg:h-screen">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col border-2 border-gray-600 bg-gray-800 w-2/3 h-full mx-auto my-10 p-6 rounded-lg shadow-lg overflow-y-auto no-scrollbar lg:h-4/5"
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
                    <div className="flex flex-col gap-5 mx-4  w-full bg-gray-900 p-4 rounded-lg text-gray-200">
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

                        <div className="overflow-y-auto bg-gray-800 text-gray-200 p-4 rounded-lg h-44 mt-4">
                            <h2 className="text-lg font-bold mb-2 text-green-400">Data processed:</h2>
                            {csvFile !== null ? (
                                <pre className="text-sm">{JSON.stringify(csvFile, null, 2)}</pre>
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
