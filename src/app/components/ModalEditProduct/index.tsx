import React, { useEffect, useState } from "react";
import { ProductTypes } from "@/types/product";
import { categoriesInterface } from "@/types/category";
import Image from "next/image";
import {ChangeIcon, DeleteIcon, ProfileIcon, SaveIcon} from "../icons";

interface ModalEditProductInterface {

    product: ProductTypes;
    GridID?: number
    ChangeFC: (idGrid: number | undefined) => void,
    DeleteFC: (idGrid: number | undefined) => void,
    SaveFC?: (idGrid: number | undefined, priceValue: number, noteUser: string, brust: string) => void,
    setIsOpen: (isOpen: boolean) => void
}

import mima from "../../../../public/Burst Mix & Match.svg";
import half from "../../../../public/Burst 1 - 2.svg";
import choice from "../../../../public/Burst your choice.svg";

interface burstInterface{
    value:number;
    image:any;
}

const ModalEditProduct = ({ product, GridID, ChangeFC, DeleteFC, SaveFC, setIsOpen }: ModalEditProductInterface) => {

    const [categories, setCategories] = useState<[]>()
    const [categoria, setCategoria] = useState<categoriesInterface>()
    const SELECT_OPTIONS = ["Each", "Lb"]
    const [price, setPrice] = useState(product?.price || 0);
    const [notes, setNote] = useState(product?.notes || "");
    const [brust, setBrust] = useState(product?.burst || "")
    const [burstOption, setBurstOption] = useState<burstInterface[]|[]>([])
    const [selectedBurst, setSelectedBurst] = useState<burstInterface|null>(null)
    const [openDropdown, setOpenDropdown] = useState(false)

    useEffect(() => {
        setBurstOption([{value:1,image:mima},{value:2,image:half},{value:3,image:choice}])
    }, []);

    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getCategories");
                const data = await resp.json();
                if (resp.status === 200) {
                    setCategories(data.result);
                }
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        getProductView();
    }, []);

    useEffect(() => {
        if (Array.isArray(categories) && categories.length > 0 && product?.id_category) {
            const categoryMatch = categories.find((item: categoriesInterface) => item.id_category === product.id_category);

            if (categoryMatch) {
                setCategoria(categoryMatch);


            }
        }


    }, [categories, product]);

    const handledSelectedBurst = (item:burstInterface) => {
       setSelectedBurst(item);
       setOpenDropdown(false)
    }

    return (
        <React.Fragment>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100  ">
                {/* Contenido del Modal */}
                <div className="w-2/3 p-2 relative xl:w-1/2">
                    <div className="bg-white p-4 rounded-lg shadow-lg m-2">
                        <div className="flex w-full">
                            <button onClick={() => setIsOpen(false)}
                                className=" bg-gray-500 p-4 rounded-full border-2 absolute top-0 right-0">
                                <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28"
                                    viewBox="0 0 384 512">
                                    <path fill="#ffffff"
                                        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                </svg>
                            </button>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-black text-center">Edit Product</h2>

                        <div className="bg-gray-300 p-8 my-6 rounded-lg shadow-lg w-full gap-5 flex justify-between">
                            <div className="w-1/3 py-1 px-1 bg-white rounded-lg">
                                {product?.url_image ? (
                                    <Image
                                        src={product?.url_image}
                                        className="h-full w-full object-contain self-center justify-self-center"
                                        alt={product?.name}
                                        width={150}
                                        height={150}
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                        <h1 className="text-gray-500">No image available</h1>
                                    </div>
                                )}
                            </div>
                            <div className=" w-2/3 rounded-lg ">
                                <div className="grid p-4 grid-cols-1 md:grid-cols-2h-72 ">
                                    <div>
                                        <div className="flex w-full justify-between">
                                            {/* Columna izquierda: Información principal del producto */}

                                            <div className="flex flex-row">
                                                <h1 className={"text-black font-bold self-center mr-0.5"}>Master Brand:</h1>
                                                <h1 className={"text-black self-center uppercase"}>{product?.master_brand || 'No master brand'}</h1>
                                            </div>

                                            {/* Columna derecha: UPC */}
                                            <div className="flex items-start ml-4">
                                                <div className="flex items-center align-middle">
                                                    <h1 className="text-black font-bold ">UPC:</h1>
                                                    <h1 className="text-black ">{product?.upc}</h1>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full justify-between">
                                            <div className="flex flex-row">
                                                <h1 className="text-black font-bold ">Brand : </h1>
                                                <h1 className={"text-black   uppercase"}>{product?.brand}</h1>
                                            </div>
                                            <div className={"flex flex-row "}>
                                                <h1 className={"text-black font-bold self-center mr-0.5"}>Cat:</h1>
                                                <h1 className={"text-black self-center uppercase"}>{categoria?.name_category}</h1>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex flex-row">
                                                <h1 className="text-black font-bold  ">Description: </h1>
                                                <h1 className="text-black uppercase">
                                                    {product?.desc ? product.desc : product?.name}
                                                </h1>
                                            </div>
                                            <div className={"flex flex-row "}>
                                                <h1 className={"text-black font-bold self-center mr-0.5"}>Gridid:</h1>
                                                <h1 className={"text-black self-center uppercase"}>{GridID}</h1>
                                            </div>
                                        </div>
                                        {
                                            product.id_category === 5 && (
                                                <>
                                                    <div className={"flex flex-row "}>
                                                <h1 className={"text-black font-bold self-center mr-0.5"}>Type of Cut:</h1>
                                                <h1 className={"text-black self-center uppercase"}>{product?.type_of_cut}</h1>
                                            </div>
                                            <div className={"flex flex-row "}>
                                                <h1 className={"text-black font-bold self-center mr-0.5"}>Type of Meat:</h1>
                                                <h1 className={"text-black self-center uppercase"}>{product?.type_of_meat}</h1>
                                            </div>
                                            <div className={"flex flex-row "}>
                                                <h1 className={"text-black font-bold self-center mr-0.5"}>Quality CF:</h1>
                                                        <h1 className={"text-black self-center uppercase"}>{product?.quality_cf}</h1>
                                                    </div>
                                                </>
                                            )
                                        }


                                        <div className={"flex w-full flex-row  justify-between"}>
                                                <div className="flex flex-row">
                                                <h1 className={"text-black font-bold self-center mr-1"}>Variety:</h1>
                                                <h1 className={"text-black  uppercase"}>{product?.variety}</h1>
                                            </div>
                                            <div className={"flex flex-row "}>
                                                <button onClick={() => console.log('add Variety')}
                                                    className="ml-4 text-green-500 font-bold">
                                                    + ADD VARIETY
                                                </button>
                                            </div>
                                        </div>
                                        <div className={"flex w-full   justify-between "}>
                                            <div className="flex flex-row">
                                                <h1 className="text-black font-bold ">Size : </h1>
                                                <h1 className={"text-black uppercase"}>{product?.size || 'No size'}</h1>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex flex-row items-center gap-5">
                                            {/* Título y Campo de Precio */}
                                            <div className="flex items-center gap-1">
                                                <h3 className="font-bold text-black">Price:</h3>
                                                <input
                                                    type="number"
                                                    value={price} // El valor está controlado por el estado
                                                    onChange={(event) => {
                                                        const newValue = parseFloat(event.target.value) || 0; // Convertir a número
                                                        setPrice(newValue); // Actualiza el valor del estado
                                                    }}
                                                    className="w-20 p-1 border border-gray-950 rounded font-bold text-black"
                                                />
                                            </div>

                                            {/* Título y Select de Unidades */}
                                            <div className="flex items-center gap-1">
                                                <h3 className="font-bold text-black">Per:</h3>
                                                <select
                                                    className="w-20 p-1 border border-gray-950 rounded font-bold text-black"
                                                >
                                                    {SELECT_OPTIONS.map((item: string, index: number) => (
                                                        <option key={index}>{item}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full flex-row justify-start gap-5">
                                        {/* Contenedor del campo Notes */}
                                        <div className="flex items-center gap-1">
                                            <h3 className="font-bold text-black">Notes:</h3>
                                            <input
                                                type="text"
                                                value={notes}
                                                onChange={(event) => {
                                                    const noteData = event.target.value || "";
                                                    setNote(noteData);
                                                }}
                                                className="p-1 border border-gray-950 rounded font-bold text-black w-32"
                                            />
                                        </div>

                                        {/* Contenedor del campo Brust */}
                                        <div className="flex items-center gap-1">
                                            <h3 className="font-bold text-black">Burst:</h3>
                                            <div className="flex flex-col items-center gap-1">
                                                <button onClick={() => setOpenDropdown(!openDropdown)}  className="p-1 border border-gray-950 rounded font-bold text-black w-36 bg-white">
                                                    Select Burst
                                                </button>
                                                {openDropdown && (
                                                    <div className="flex absolute bottom-32 right-38 bg-white rounded-md shadow-lg z-50">
                                                        {burstOption.map((item,index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handledSelectedBurst(item)}
                                                                className="text-left py-1 shadow hover:bg-gray-100"
                                                            >
                                                                <Image
                                                                    src={item.image}
                                                                    alt={`Burst option`}
                                                                    width={80}
                                                                    height={80}
                                                                    className="object-contain"
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {
                                                selectedBurst !== null && (
                                                <Image
                                                    src={selectedBurst.image}
                                                    alt={`Burst option ${selectedBurst.value}`}
                                                    width={80}
                                                    height={80}
                                                    className="object-contain"
                                                />)
                                            }
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center justify-center relative bottom-12">
                            <button
                                className="bg-lime-500 p-2 text-black rounded-md "
                                onClick={() => ChangeFC(GridID)}>
                                <div className="flex gap-2">
                                    <ChangeIcon/>
                                    Change Products
                                </div>
                            </button>
                            <button
                                className="bg-lime-500 p-2 text-black rounded-md "
                                onClick={() => DeleteFC(GridID)}>
                                <div className="flex gap-2">
                                    <DeleteIcon />
                                    Delete
                                </div>
                            </button>
                            <button
                                className="p-2 text-black  bg-lime-500 rounded-md "
                                onClick={() => SaveFC?.(GridID, price, notes, String(selectedBurst?.value))}>
                                <div className="flex gap-2">
                                    <SaveIcon />
                                    Save
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default ModalEditProduct;


