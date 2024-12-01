'use client'
import {useEffect, useState} from "react";
import {parse} from "csv";
import {getClients} from "@/pages/api/apiMongo/getClients";
import {clientType} from "@/types/clients";
import {addCircular} from "@/pages/api/apiMongo/addCircular";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddCircular = () => {

    const [csvFile, setCsvFile] = useState<[] |object | null>(null)
    const [clientes, setClientes] = useState<clientType[] | []>([])
    const [clientSelected, setClientSelected] = useState<clientType|null>(null)
    const [inputValue, setInputValue] = useState<string>("");

    // valores
    const [circularName, setCircularName] = useState<string>("")
    const [weekCircular, setWeekCircular] = useState<string>("")
    const [dateCircular, setDateCircular] = useState<string>("")
    const [idClient, setIdClient] = useState<number|null>(null)
    const [options, setOptions] = useState<string[]>([]);

    const [isReadyToSend, setIsReadyToSend] = useState(false)


    useEffect(() => {
        const gettingClients = async () => {
            const resp = await getClients()
            if (resp.status === 200){
                setClientes(resp.result)
            }
        }
        gettingClients();
    }, []);

    useEffect(() => {
        if(circularName !== "" && weekCircular !== "" && dateCircular !== "" && idClient !== null && options.length > 0 ){
            setIsReadyToSend(true)
        }
    }, [circularName,weekCircular,dateCircular,idClient,options]);



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
                            columns: true, // Convierte cada fila en un objeto usando los encabezados como claves
                            skip_empty_lines: true,
                        },
                        (err, records: object[]) => {
                            if (err) {
                                console.error("Error al procesar el archivo CSV:", err);
                                return;
                            }
                            setCsvFile(records); // Asegúrate de que setCsvFile acepte `object[]` en su estado
                            console.log("Datos cargados:", records);
                        }
                    );
                } else {
                    console.error("Error: El contenido del archivo no es texto.");
                }
            };

            reader.onerror = () => {
                console.error("Error al leer el archivo.");
            };

            reader.readAsText(file);
        }
    };

    const handleAddOption = () => {
        if (inputValue.trim() !== "") {
            setOptions([...options, inputValue.trim()]);
            setInputValue(""); // Limpia el input después de agregar
        }
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIdClient(Number(e.target.value));
        console.log("Cliente seleccionado:", e.target.value);
    };

    const handleSend = async () => {
        if(isReadyToSend) {
            const body = {
                id_client: idClient,
                name_circular: circularName,
                week_circular: weekCircular,
                date_circular: dateCircular,
                circular_options:options,
                circular_products_upc:csvFile,
            }
            console.log("cuerpo a enviar",body);
            const resp = await addCircular(body);
            if (resp.status === 201) {
                console.log("respuesta ",resp);
                toast.success("¡Product created successfully!");
                handleCleaning();
            }else {
                console.log("respuesta ",resp);
                toast.error("something is wrong!!");
            }

        }
    }

    const handleCleaning = () => {
        setDateCircular("")
        setWeekCircular("")
        setCircularName("")
        setCsvFile(null)
        setOptions([])
        setClientSelected(null)
        setIdClient(null)
    }

    return (
        <div className="flex bg-[#121212]  overflow-y-auto no-scrollbar lg:h-screen">
            <div
                className="flex flex-col border-2 border-gray-600 bg-gray-800 w-2/3 h-full mx-auto my-10 p-6 rounded-lg shadow-lg overflow-y-auto  no-scrollbar lg:h-4/5">
                <div className="flex flex-row items-center justify-between ">
                    <h2 className="text-2xl font-bold text-white mb-4 ">Upload Products</h2>
                    <button onClick={()=>handleSend()} disabled={!isReadyToSend} className={"m-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none"}>
                        Send
                    </button>
                </div>

                <div className="flex flex-col bg-gray-900 h-full w-full rounded-lg p-4">
                    <div className="flex flex-col mb-6 gap-5 md:flex-row md:justify-start px-4">
                        {/* Circular Name */}
                        <div className="flex flex-col w-full md:w-2/3">
                            <label htmlFor="circularName"
                                   className="text-lg font-semibold text-gray-300 mb-2 text-center md:text-left">
                                Circular's name
                            </label>
                            <input
                                id="circularName"
                                type="text"
                                onChange={(e) => setCircularName(e.target.value)}
                                className="border-2 border-[#7cc304] bg-gray-700 text-gray-200 rounded-lg w-full h-12 p-2 focus:outline-none focus:ring-2 focus:ring-[#7cc304]"
                            />
                        </div>

                        {/* Client */}
                        <div className="flex flex-col w-full md:w-1/3">
                            <label htmlFor="clientSelect"
                                   className="text-lg font-semibold text-gray-300 mb-2 text-center md:text-left">
                                customer
                            </label>
                            <select
                                id="clientSelect"
                                className="border-2 border-green-400 bg-gray-700 text-gray-200 rounded-lg w-full h-12 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                onChange={handleClientChange}
                            >
                                <option value="" disabled selected>
                                    Select a customer
                                </option>
                                {clientes.map((client: clientType) => (
                                    <option key={client.id_cliente} value={client.id_cliente}>
                                        {client.client_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 px-6 lg:flex-row lg:items-start">
                        {/* Week Circular */}
                        <div className="flex flex-col w-full lg:w-1/3">
                            <label htmlFor="csvInput"
                                   className="text-lg font-semibold text-gray-300 mb-2 text-center md:text-left">
                                circular's week
                            </label>
                            <input
                                type="text"
                                className="border-2 border-green-400 bg-gray-700 text-gray-200 rounded-lg w-full h-12 mb-4 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                onChange={event => setWeekCircular(event.target.value)}
                            />
                        </div>

                        {/* Fecha Circular */}
                        <div className="flex flex-col w-full lg:w-1/3">
                            <label htmlFor="dateInput"
                                   className="text-lg font-semibold text-gray-300 mb-2 text-center md:text-left">
                                Date Circular
                            </label>
                            <input
                                id="dateInput"
                                type="date"
                                className="border-2 border-green-400 bg-gray-700 text-gray-200 rounded-lg w-full h-12 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                onChange={(e) => setDateCircular(e.target.value)}
                            />
                        </div>

                        {/* Agregar Opciones */}
                        <div className="flex flex-col w-full lg:w-1/3">
                            <label htmlFor="addOptions"
                                   className="text-lg font-semibold text-gray-300 mb-2 text-center md:text-left">
                                Add Options
                            </label>
                            <div className="flex w-full flex-wrap">
                                <input
                                    type="text"
                                    id="addOptions"
                                    placeholder="Escribe una opción"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex-grow border-2 border-green-400 bg-gray-700 text-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                <button
                                    onClick={handleAddOption}
                                    className="ml-2 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-5 mx-4  w-full bg-gray-900 p-4 rounded-lg text-gray-200">
                        {options.length > 0 ? (
                            options.map((option, index) => (
                                <span
                                    key={index}
                                    className="flex w-auto p-4 border rounded-lg border-green-500 py-2 text-center"
                                >
                                            {option}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">There are no added options.</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-5 mx-4  w-full bg-gray-900 p-4 rounded-lg text-gray-200">
                        <label htmlFor="csvInput" className="text-lg font-semibold text-gray-300 mb-2 text-start">
                            Select a CSV file
                        </label>

                        <input
                            id="csvInput"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="border-2 border-green-400 bg-gray-700 text-gray-200 rounded-lg w-2/3 h-12  mb-4 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
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
    )
}

export default AddCircular;
