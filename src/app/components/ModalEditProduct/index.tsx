import React, {useEffect, useState} from "react";
import {ProductTypes} from "@/types/product";
import {categoriesInterface} from "@/types/category";
import Image from "next/image";
import {useProductContext} from "@/app/context/productContext";

interface ModalEditProductInterface {

    product: ProductTypes;
    GridID?: number
    ChangeFC: (idGrid: number | undefined) => void,
    DeleteFC: (idGrid: number | undefined) => void,
    SaveFC?: (idGrid: number | undefined, priceValue: number, noteUser: string, brust: string) => void,
    setIsOpen: (isOpen: boolean) => void
}

const ModalEditProduct = ({product, GridID, ChangeFC, DeleteFC, SaveFC, setIsOpen}: ModalEditProductInterface) => {

    const [categories, setCategories] = useState<[]>()
    const [categoria, setCategoria] = useState<categoriesInterface>()
    const SELECT_OPTIONS = ["kg", "mL", "L"]
    const [price, setPrice] = useState(product?.price || 0);
    const [notes, setNote] = useState(product?.notes || "");
    const [brust, setBrust] = useState(product?.burst || "")

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


    return (
        <React.Fragment>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50  ">
                {/* Contenido del Modal */}
                <div className={"w-2/3 p-2 relative xl:w-1/2"}>
                    <div className=" bg-white p-12 m-4 rounded-lg shadow-lg  ">
                        <div className="flex w-full">
                            <button onClick={() => setIsOpen(false)}
                                    className=" bg-gray-500 p-4 rounded-full border-2 absolute top-2 right-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28"
                                     viewBox="0 0 384 512">
                                    <path fill="#ffffff"
                                          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                                </svg>
                            </button>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-black text-center">Edit Product</h2>

                        <div
                            className="bg-gray-300 p-8 my-6 rounded-lg shadow-lg w-full flex flex-col md:flex-row gap-4  ">
                            {/* Imagen del producto */}
                            <div
                                className=" w-1/3 py-1 px-1 flex items-center justify-center p-4 bg-white   rounded">
                                {product?.url_image ? (
                                    <Image
                                        src={product?.url_image}
                                        className="object-contain"
                                        alt={product?.name}
                                        layout="responsive"
                                        width={150}
                                        height={150}
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                        <h1 className="text-gray-500">No image available</h1>
                                    </div>
                                )}
                            </div>

                            {/* Información del producto */}
                            <div className=" w-full md:w-2/3 rounded-lg  ">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2  items-start ">
                                    <div className="flex flex-wrap items-start">
                                        <h1 className="text-black font-bold text-xs sm:text-lg mr-0.5 whitespace-nowrap">Master
                                            Brand:</h1>
                                        <h1 className="text-black text-xs sm:text-lg  break-words">{product?.desc ? product.desc : product?.name}</h1>
                                    </div>
                                    {/* Columna derecha: UPC */}
                                    <div className="flex flex-wrap items-start">
                                        <h1 className="text-black font-bold text-xs sm:text-lg mr-0.5 whitespace-nowrap">UPC:</h1>
                                        <h1 className="text-black text-xs break-words sm:text-lg  ">{product?.upc}</h1>

                                    </div>
                                    <div className="flex flex-row  items-start">
                                        <h1 className="text-black font-bold text-xs sm:text-lg mr-0.5 whitespace-nowrap">Brand:</h1>
                                        <h1 className={"text-black  break-words  text-xs sm:text-lg"}>{product?.brand}</h1>
                                    </div>
                                    <div className={"flex flex-row  items-start"}>
                                        <h1 className="text-black font-bold text-xs sm:text-lg mr-0.5 whitespace-nowrap">Cat:</h1>
                                        <h1 className={"text-black  self-center text-xs sm:text-lg"}>{categoria?.name_category}</h1>
                                    </div>
                                    <div className="flex flex-row  items-start">
                                        <h1 className="text-black font-bold text-xs sm:text-lg mr-0.5 whitespace-nowrap">Description:</h1>
                                        <h1 className={"text-black text-xs sm:text-lg"}>{product.desc}</h1>
                                    </div>
                                    <div className={"flex flex-row  items-start"}>
                                        <h1 className="text-black font-bold text-xs sm:text-lg mr-0.5 whitespace-nowrap">GridId:</h1>
                                        <h1 className={"text-black text-xs sm:text-lg self-center"}>{GridID}</h1>
                                    </div>


                                    <div className="flex flex-row  items-start">
                                        <h1 className="text-black font-bold text-xs sm:text-lg mr-0.5 whitespace-nowrap">variety:</h1>
                                        <h1 className={"text-black  text-xs sm:text-lg"}>{product?.variety}</h1>
                                    </div>
                                    <div className={"flex flex-row   items-start"}>
                                        <button onClick={() => console.log('add Variety')}
                                                className=" text-green-500 text-xs sm:text-lg font-bold">
                                            + ADD VARIETY
                                        </button>
                                    </div>

                                    <div className="flex flex-row  items-start">
                                        <h1 className="text-black font-bold text-xs sm:text-lg mr-0.5 whitespace-nowrap">Size: </h1>
                                        <h1 className={"text-black text-xs sm:text-lg"}>{product?.size}</h1>
                                    </div>

                                    <div className="flex flex-row">
                                        <h1 className="text-black font-bold text-xs sm:text-lg mr-0.5 whitespace-nowrap">Conditions:</h1>
                                        <h1 className={"text-black  text-xs sm:text-lg"}>{product?.conditions !== undefined ? product.conditions : ''}</h1>
                                    </div>


                                    {/* Price and Unit Selector */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-56 gap-y-2">
                                        {/* Price */}
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-xs sm:text-lg font-bold text-black">Price:</h1>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(event) => {
                                                    const newValue = parseFloat(event.target.value) || 0;
                                                    setPrice(newValue);
                                                }}
                                                className="w-20 p-1 border border-gray-950 rounded font-bold text-black"
                                            />
                                        </div>

                                        {/* Size Selector */}
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-xs sm:text-lg font-bold text-black">Size:</h1>
                                            <select
                                                className="w-20 p-1 border border-gray-950 rounded font-bold text-black">
                                                {SELECT_OPTIONS.map((item, index) => (
                                                    <option key={index}>{item}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Contenedor del campo Notes */}
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-xs sm:text-lg font-bold text-black">Notes:</h1>
                                            <input
                                                type="text "
                                                value={notes}
                                                onFocus={(e) => e.target.style.width = "300px"}
                                                onBlur={(e) => e.target.style.width = "150px"}
                                                style={{width: "150px", transition: "width 0.3s ease-in-out"}}
                                                onChange={(event) => {
                                                    const noteData = event.target.value || "";
                                                    setNote(noteData);
                                                }}
                                                className="w-20 p-1 border border-gray-950 rounded font-bold text-xs sm:text-lg text-black"
                                            />
                                        </div>

                                        {/* Contenedor del campo Brust */}
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-lg font-boldtext-xs sm:text-lg text-black">Brust:</h1>
                                            <input
                                                type="text"
                                                value={brust}
                                                onFocus={(e) => e.target.style.width = "300px"}
                                                onBlur={(e) => e.target.style.width = "150px"}
                                                style={{width: "150px", transition: "width 0.3s ease-in-out"}}
                                                onChange={(event) => {
                                                    const dataBrust = event.target.value || "";
                                                    setBrust(dataBrust);
                                                }}
                                                className="w-20 p-1 border border-gray-950 rounded font-bold text-xs sm:text-lg text-black"
                                            />
                                        </div>

                                    </div>


                                </div>
                            </div>
                        </div>
                        <div
                            className=" -mt-10  flex  flex-wrap  flex-row  justify-between items-start gap-4 xs:flex-nowrap">
                            {/* Botón "Change Products" */}
                            <button
                                className="top flex items-center justify-center px-4 py-2 w-auto text-black font-bold bg-[#7ACC41] hover:bg-[#6BB83A] rounded-md drop-shadow-lg"
                                onClick={() => ChangeFC(GridID)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20"
                                    width="20"
                                    viewBox="0 0 512 512"
                                    className="mr-2"
                                >
                                    <path
                                        fill="#000000"
                                        d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96l160 0 0 32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32l0 32L160 64C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96l-160 0 0-32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2-9.2 22.9-11.9 34.9-6.9s19.8-16.6 19.8-29.6l0-32 160 0c88.4 0 160-71.6 160-160z"
                                    />
                                </svg>
                                <span className="hidden sm:inline">Change Products</span>
                            </button>

                            {/* Botón "Delete" */}
                            <button
                                className="flex items-center justify-center px-4 py-2 w-auto text-black font-bold bg-[#7ACC41] hover:bg-[#6BB83A] rounded-md drop-shadow-lg mx-2"
                                onClick={() => DeleteFC(GridID)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20"
                                    width="20"
                                    viewBox="0 0 448 512"
                                    className="mr-2"
                                >
                                    <path
                                        fill="#000000"
                                        d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"
                                    />
                                </svg>
                                <span className="hidden sm:inline"> Delete </span>
                            </button>

                            {/* Botón "Save" */}
                            <button
                                className="flex items-center justify-center px-4 py-2 w-auto text-black font-bold bg-[#7ACC41] hover:bg-[#6BB83A] rounded-md drop-shadow-lg"
                                onClick={() => SaveFC?.(GridID, price, notes, brust)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20"
                                    width="20"
                                    viewBox="0 0 448 512"
                                    className="mr-2"
                                >
                                    <path
                                        fill="#000000"
                                        d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
                                    />
                                </svg>
                                <span className="hidden sm:inline"> Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}
export default ModalEditProduct;


