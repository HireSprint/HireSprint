"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { addGoogleSheet3 } from "../api/productos/prductosRF";
import { useCategoryContext } from "../context/categoryContext";
import { useAuth } from "./provider/authprovider";
import { useProductContext } from "../context/productContext";

const SendModal = () => {
    const {user} = useAuth()
    const {categoriesData} = useCategoryContext()
    const {selectedProducts, isSendModalOpen, setIsSendModalOpen} = useProductContext()
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleSendGoogle = async () => {
        setIsLoading(true);
        try {
            await addGoogleSheet3(user?.userData.name, categoriesData, selectedProducts);
            setIsLoading(false);
            setIsSendModalOpen(false);
            setShowSuccessModal(true);
        } catch (error) {
            setIsLoading(false);
            setShowErrorModal(true);
            console.error('Error:', error);
        }
    }

    return (
        <React.Fragment>
            {/* Modal principal */}
            {isSendModalOpen && (
                <motion.div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-[100]">
                    <div className="w-96 bg-white p-2 relative rounded-lg flex flex-col items-center justify-center">
                        <h1 className="text-black text-2xl font-bold">¿Are you sure?</h1>
                        <p className="text-black text-md">¿Do you want to send this information?</p>
                        <div className="flex gap-2 mt-4">
                            <button 
                                onClick={()=>setIsSendModalOpen(false)} 
                                className="bg-gray-500 text-white p-2 rounded-md w-24"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSendGoogle} 
                                className="bg-blue-500 text-white p-2 rounded-md w-24 flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    'Confirm'
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Modal de éxito */}
            {showSuccessModal && (
                <motion.div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-[100]">
                    <div className="w-96 bg-white p-4 rounded-lg flex flex-col items-center justify-center">
                        <h2 className="text-green-500 text-xl font-bold mb-2">¡Success!</h2>
                        <p className="text-black mb-4">The information was sent correctly</p>
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            Accept
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Modal de error */}
            {showErrorModal && (
                <motion.div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-[100]">
                    <div className="w-96 bg-white p-4 rounded-lg flex flex-col items-center justify-center">
                        <h2 className="text-red-500 text-xl font-bold mb-2">Error</h2>
                        <p className="text-black mb-4">There was an error sending the information</p>
                        <button 
                            onClick={() => setShowErrorModal(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            )}
        </React.Fragment>
    )
}

export default SendModal