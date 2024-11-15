import React, { useEffect, useState } from "react";
import { ProductTypes } from "@/types/product";
import { categoriesInterface } from "@/types/category";
import Image from "next/image";
import {useProductContext} from "@/app/context/productContext";

interface ModalEditProductInterface {

    product: ProductTypes;
    GridID?: number
    ChangeFC?: (idGrid : number | undefined) => void,
    DeleteFC?: (idGrid: number | undefined) => void,
    SaveFC?: () => void,
    isOpen?: boolean
    setIsOpen: (isOpen: boolean) => void
}

const ModalEditProduct = ({ product, GridID, ChangeFC, DeleteFC, SaveFC, isOpen, setIsOpen }: ModalEditProductInterface) => {

    const [categories, setCategories] = useState<[]>()
    const [categoria, setCategoria] = useState<categoriesInterface>()
  
    const SELECT_OPTIONS = ["kg", "mL", "L"]


    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getCategories");
                const data = await resp.json();
                if(resp.status === 200){
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
                {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50  ">
                    {/* Contenido del Modal */}
                    <div className={"w-2/3 p-2 relative xl:w-1/2"}>
                        <div className="bg-white p-12 m-4 rounded-lg shadow-lg ">
                            <div className="flex w-full">
                                <button onClick={() => setIsOpen(false)}
                                    className=" bg-gray-500 p-4 rounded-full border-2 absolute top-2 right-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28"
                                        viewBox="0 0 384 512">
                                        <path fill="#ffffff"
                                            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                    </svg>
                                </button>
                            </div>
                            <h2 className="text-2xl font-extrabold mb-4 text-black text-center">Edit Product</h2>

                            <div className="bg-gray-300 p-8 my-6 rounded-lg shadow-lg w-full gap-5 flex justify-between">
                                <div className="w-1/3 p-4 border-2 border-gray-950 bg-white">
                                    {product?.url_image ? (
                                        <Image src={product?.url_image}
                                            className={" h-full object-cover self-center justify-self-center"} alt={product?.name} width={100} height={100}/>
                                    ) : (
                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                            <h1 className="text-gray-500">No image available</h1>
                                        </div>
                                    )}
                                </div>
                                <div className=" w-2/3 rounded-lg ">
                                    <div className="grid p-4 grid-cols-1 md:grid-cols-2h-72 ">
                                        <div>
                                            <div className={"flex w-full flex-col  justify-between xl:flex-row"}>
                                                <h1 className={"text-black font-bold text-xl"}>{product?.name}</h1>
                                                <div className={"flex flex-row "}>
                                                    <h1 className={"text-black font-bold text-lg self-center mr-0.5"}>UPC: </h1>
                                                    <h1 className={"text-black text-md self-center"}>{product?.upc}</h1>
                                                </div>
                                            </div>
                                            <div className={"flex w-full flex-col  justify-between xl:flex-row"}>
                                                <h1 className={"text-black font-bold  text-lg"}>{product?.brand}</h1>
                                                <div className={"flex flex-row "}>
                                                    <h1 className={"text-black font-bold text-lg self-center mr-0.5"}>Cat:</h1>
                                                    <h1 className={"text-black text-md self-center"}>{categoria?.name_category}</h1>
                                                </div>
                                            </div>
                                            <div className={"flex w-full flex-col  justify-between xl:flex-row"}>
                                                <h1 className={"text-black font-bold text-lg"}>{product?.size}</h1>
                                                <div className={"flex flex-row "}>
                                                    <h1 className={"text-black font-bold text-lg self-center mr-0.5"}>GridId:</h1>
                                                    <h1 className={"text-black text-md self-center"}>{GridID}</h1>
                                                </div>
                                            </div>
                                            <div className={"flex w-full flex-row  justify-between"}>
                                                <h1 className={"text-black font-bold text-lg"}>{product?.variety}</h1>
                                            </div>
                                            <div className={"flex w-full flex-row  justify-between"}>
                                                <h1 className={"text-black font-bold text-lg"}>{product?.conditions}</h1>
                                            </div>
                                        </div>

                                        <div className={"flex w-full flex-row  justify-start gap-5"}>
                                            <input type={"number"} defaultValue={product?.price}
                                                className="w-2/12 p-1 border border-gray-950 rounded font-bold text-black mt-8 " />
                                            <select
                                                className="w-2/12 p-1 border border-gray-950 rounded font-bold text-black mt-8 ">
                                                {
                                                    SELECT_OPTIONS.map((item: string, index: number) => (
                                                        <option key={index}>{item}</option>))
                                                }
                                            </select>
                                        </div>


                                    </div>
                                </div>
                            </div>
                            <div className={"flex w-full h-full flex-row"}>
                                <button
                                    className="px-4 py-2 mt-4 w-2/6 text-black font-bold bg-lime-500 rounded-md drop-shadow-lg absolute top-3/4 left-10 xl:left-32"
                                    onClick={() => product.id_product}
                                >
                                    <div className="flex items-center justify-around">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32"
                                            viewBox="0 0 512 512">
                                            <path fill="#000000"
                                                d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96l160 0 0 32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32l0 32L160 64C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96l-160 0 0-32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-32 160 0c88.4 0 160-71.6 160-160z" />
                                        </svg>
                                        Change Products
                                    </div>
                                </button>
                                <button
                                    className="px-4 py-2 mt-4 w-1/6 text-black font-bold bg-lime-500 rounded-md drop-shadow-lg absolute top-3/4 right-40 xl:right-80"
                                    onClick={() => product.id_product}
                                >
                                    <div className="flex items-center justify-around">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="30" width="26"
                                            viewBox="0 0 448 512">
                                            <path fill="#000000"
                                                d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                                        </svg>
                                        Delete
                                    </div>
                                </button>
                                <button
                                    className="px-4 py-2 mt-4 w-1/6 text-black font-bold bg-lime-500 rounded-md drop-shadow-lg absolute top-3/4 right-10 xl:right-28"
                                    onClick={() => SaveFC && SaveFC()}
                                >
                                    <div className="flex items-center justify-around">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="32" width="28"
                                            viewBox="0 0 448 512">
                                            <path fill="#000000"
                                                d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" />
                                        </svg>
                                        Save
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}
export default ModalEditProduct;


