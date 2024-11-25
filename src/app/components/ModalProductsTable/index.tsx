import React from "react";
import ProductsTable from "@/app/components/ProductsTable";

interface ModalProductsTableInterface {
    setProductTableOpen:(open: boolean) => void;
    id_circular:number | null;
}

const ModalProductTable = ({id_circular,setProductTableOpen}: ModalProductsTableInterface) => {



    return (
        <React.Fragment>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-9999 ">
                {/* Contenido del Modal */}
                <div className={"w-4/5 p-2 relative xl:w-4/5"}>
                    <div className={"bg-white p-12 m-4 rounded-lg shadow-lg"}>
                        <div className="flex w-full">
                            <button onClick={() => setProductTableOpen(false)}
                                    className=" bg-gray-500 p-4 rounded-full border-2 absolute top-2 right-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28"
                                     viewBox="0 0 384 512">
                                    <path fill="#ffffff"
                                          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                                </svg>
                            </button>
                        </div>

                        <ProductsTable id_circular={id_circular || 0}/>
                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}
export default ModalProductTable;


