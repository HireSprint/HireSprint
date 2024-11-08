import React, {useEffect, useState} from "react";
import {ProductItemInterface} from "@/app/interfaces/productInterface"
import {getCategories} from "@/app/api/apiMongo/getCategories";
import {getProduct} from "@/app/api/apiMongo/getProduct";
import {meta} from "eslint-plugin-react/lib/rules/jsx-props-no-spread-multi";
import category = meta.docs.category;

interface categoriesInterface {
    _id:string,
    name_category: string,
    id_category: number,
    __v: number
}
interface ModalEditProductInterface {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    Product:ProductItemInterface;
    GridID:number

}

const ModalEditProduct = ({isOpen,setIsOpen,Product,GridID}:ModalEditProductInterface) => {

    const [categories, setCategories] = useState<[]>()
    const [categoria, setCategoria] = useState<categoriesInterface>()

    useEffect(() => {
        const getCategoriesView = async () => {
            const resp = await getCategories();
            if(resp.status === 200){
                setCategories(resp.result);
            }
        }
        getCategoriesView();
    }, []);

    useEffect(() => {
        if (Array.isArray(categories) && categories.length > 0 && Product?.id_category) {
            const categoryMatch = categories.find((item: categoriesInterface) => item.id_category === Product.id_category);
            console.log("lol",categoryMatch)
            if (categoryMatch) {
                setCategoria(categoryMatch);
            }
        }
    }, [categories,Product]);


    return(
        <React.Fragment>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    {/* Contenido del Modal */}
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 ">
                        <h2 className="text-2xl font-extrabold mb-4 text-black text-center">Edit Product</h2>

                        <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full gap-5 flex justify-between">
                            <div className="w-1/3 p-4 border-2 border-gray-950 bg-white">
                                <img src={Product.url_image}
                                     className={" h-full object-cover self-center justify-self-center"}/>
                            </div>
                            <div className=" w-2/3 rounded-lg ">
                                <div className="grid p-4 grid-cols-1 md:grid-cols-2h-72 ">
                                    <div>
                                        <div className={"flex w-full flex-row  justify-between"}>
                                            <h1 className={"text-black font-bold text-xl"}>{Product.name}</h1>
                                            <div className={"flex flex-row "}>
                                                <h1 className={"text-black font-bold text-lg self-center mr-0.5"}>UPC: </h1>
                                                <h1 className={"text-black text-md self-center"}>{Product.upc}</h1>
                                            </div>
                                        </div>
                                        <div className={"flex w-full flex-row  justify-between"}>
                                            <h1 className={"text-black font-bold  text-lg"}>{Product.brand}</h1>
                                            <div className={"flex flex-row "}>
                                                <h1 className={"text-black font-bold text-lg self-center mr-0.5"}>Cat:</h1>
                                                <h1 className={"text-black text-md self-center"}>{categoria?.name_category}</h1>
                                            </div>
                                        </div>
                                        <div className={"flex w-full flex-row  justify-between"}>
                                            <h1 className={"text-black font-bold text-lg"}>{Product.size}</h1>
                                            <div className={"flex flex-row "}>
                                                <h1 className={"text-black font-bold text-lg self-center mr-0.5"}>GridId:</h1>
                                                <h1 className={"text-black text-md self-center"}>{GridID}</h1>
                                            </div>
                                        </div>
                                        <div className={"flex w-full flex-row  justify-between"}>
                                            <h1 className={"text-black font-bold text-lg"}>{Product.variety}</h1>
                                        </div>
                                        <div className={"flex w-full flex-row  justify-between"}>
                                            <h1 className={"text-black font-bold text-lg"}>{Product.conditions}</h1>
                                        </div>
                                    </div>

                                    <div className={"flex w-full flex-row  justify-start gap-5"}>
                                        <input type={"number"} defaultValue={Product.price}
                                               className="w-2/12 p-1 border border-gray-950 rounded font-bold text-black mt-8 "/>
                                        <select
                                                className="w-2/12 p-1 border border-gray-950 rounded font-bold text-black mt-8 ">
                                            <option>ml</option>
                                            <option>kg</option>
                                            <option>g</option>
                                        </select>
                                    </div>


                                </div>
                            </div>
                        </div>
                        <button
                            className="px-4 py-2 mt-4 text-white bg-red-500 rounded-md"
                            onClick={() => setIsOpen(false)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}
export default ModalEditProduct;
