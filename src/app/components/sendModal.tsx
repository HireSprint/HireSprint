import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useProductContext } from "../context/productContext";



const SendModal = () => {

    const {setIsSendModalOpen} = useProductContext()

    return (
        <React.Fragment>
            <motion.div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50  ">
                <button onClick={()=>setIsSendModalOpen(false)} className="bg-red-500 w-8 h-8 items-center justify-center flex text-white p-2 rounded-full relative left-48 top-4 z-50">X</button>
            <div className="w-96 bg-white p-2 relative rounded-lg flex flex-col items-center justify-center">
                <h1 className="text-black text-2xl font-bold">Success!</h1>
                <p className="text-black text-md">Your order has been placed successfully</p>
            </div>
            </motion.div>
        </React.Fragment>
    )
}

export default SendModal