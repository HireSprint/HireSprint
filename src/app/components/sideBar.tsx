'use client'
import React, {useState, useEffect, use, useCallback} from 'react';
import {useProductContext} from '../context/productContext';
import {CardSide} from './card';
import {addGoogleSheet} from '../api/productos/prductosRF';
import {addGoogleSheet2} from "../api/productos/prductosRF";

interface Product {
    id: string;
    name: string;
    image: string;
    gridId?: number;
    price?: number;
    descriptions?: string[] | undefined;
}

interface SidebarProps {
    selectedProducts: Product[];
    onClose: () => void;
    onRemoveProduct: (productId: string) => void; // Nueva prop para eliminar productos
}


const Sidebar: React.FC<SidebarProps> = ({selectedProducts, onClose, onRemoveProduct}) => {
    const [localProducts, setLocalProducts] = useState(selectedProducts);
    const {client} = useProductContext();
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Efecto para actualizar localProducts cuando selectedProducts cambia
    useEffect(() => {
        setLocalProducts(selectedProducts);
    }, [selectedProducts]);


    const handleSendToGoogleSheet = async (data: Product[]): Promise<void> => {
        setLoading(true);      
        
        addGoogleSheet2(data);
        console.log(data);    
        console.log(loading);
            

    };

    

    const handlePriceChange = (id: string, newPrice: number) => {
        setLocalProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === id ? {...product, price: newPrice} : product
            )
        );
    };

    const handleProductSelect = (updatedProduct: Product) => {
        setLocalProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };

    const handleRemoveProduct = useCallback((productId: string) => {
        onRemoveProduct(productId);
    }, [onRemoveProduct]);

    return (
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto">
            <button onClick={onClose} className="mb-4 text-red-500">Cerrar</button>
            <h2 className="text-xl font-bold text-black">Productos Seleccionados</h2>
            <p className="text-gray-700">Cliente: {client}</p>
            <ul className="mt-4 space-y-2">
                {localProducts.length > 0 ? (
                    localProducts.map((product, index) => (
                        <li key={product.id} className="text-sm text-black">
                            <span className="font-bold">{index + 1}.</span> {product.name} -
                            <span className="text-gray-500"> G.{product.gridId}</span>
                            <input
                                type="number"
                                value={product.price || ''}
                                onChange={(e) => handlePriceChange(product.id, parseFloat(e.target.value) || 0)}
                                className="ml-2 w-16 text-black border rounded"
                                step="0.01"
                            />
                            <CardSide
                                product={product as Product & { descriptions: string[] }}
                                onPriceChange={handlePriceChange}
                                onProductSelect={handleProductSelect}
                            />
                            <button
                                onClick={() => handleRemoveProduct(product.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No hay productos seleccionados.</li>
                )}
            </ul>
            <button onClick={() => handleSendToGoogleSheet(localProducts)}
                    className="mt-4 bg-amber-700 text-white p-2 rounded"
                    
            >
                Enviar
            </button>

            {message && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
                    {message}
                </div>
            )}
        </div>
    );
};

export default Sidebar;