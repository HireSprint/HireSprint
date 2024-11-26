import React, {useEffect, useState} from 'react';
import { CardShowSide } from './card';
import { ProductTypes } from '@/types/product';
import { categoriesInterface } from '@/types/category';
import { useProductContext } from '../context/productContext';


const ProductContainer: React.FC<{ category: categoriesInterface | null, setCategory: (category: categoriesInterface | null) => void, onProductSelect: (product: ProductTypes) => void }> = ({ category, setCategory, onProductSelect }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true); 
    const { productsData } = useProductContext();
    
    useEffect(() => {
        if (productsData.length) setLoading(false);
    }, [productsData]);
    
    useEffect(() => {
        if (productsData.length) {
            setLoading(true);
            setTimeout(() => setLoading(false) , 250);
        }
    }, [category]);
        

    const productsSameCategory = productsData.filter(product => product.id_category === category?.id_category);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = productsData.filter((product) =>
        productsSameCategory.includes(product) &&
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="absolute flex h-[80vh] w-96 bg-white bg-opacity-[.96] rounded-lg shadow-md overflow-hidden left-[10px] top-5 z-1">
            {/* Sección de Productos */}
            <div className="grid grid-rows-[min-content_auto] p-3">
                
                <div className='flex flex-col w-full'>
                    <div className='flex justify-between items-center'>
                        <p className='text-gray-500 font-bold uppercase'>{category?.name_category}</p>

                        <button className='text-white font-bold bg-red-500 rounded-md p-2 mb-4' onClick={() => { setCategory(null) }}>
                            Cerrar
                        </button>
                    </div>

                    <input type="text" 
                        placeholder="Buscar Producto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-black w-full p-2 mb-3 border border-gray-300 rounded"
                    />

                    {/* Pestañas Superiores */}
                    <div className="flex gap-2 mb-1">
                        <button
                            className={`px-3 bg-transparent text-sm ${ activeTab === 'all' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400' }`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Products
                        </button>

                        <button
                            className={`px-3 bg-transparent text-sm ${ activeTab === 'circular' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400' }`}
                            onClick={() => setActiveTab('circular')}
                        >
                            En Circular
                        </button>
                    </div>
                </div>

                {/* Subcategorías */}
                {activeTab === 'all' && (
                    <div
                        className="flex-grow p-3 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="flex justify-center items-center flex-wrap gap-2 mb-3">
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 1
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 2
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 3
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 4
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {loading ? (
                                Array.from({length: 8}).map((_, index) => (
                                    <div key={index} className=" bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col items-center justify-center overflow-y-auto space-y-2 ">
                                        <div className="w-28 h-28  flex items-center justify-center "></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                ))
                            ) : (
                                filteredProducts.map((product) => (
                                    <CardShowSide key={product.id_product} product={product}  enableDragAndDrop={false} />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Subcategorías */}
                {activeTab === 'circular' && (
                    <div
                        className="flex-grow p-3 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="flex justify-center items-center flex-wrap gap-2 mb-3">
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">
                                    Sub
                                Categoría 1
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">
                                    Sub
                                Categoría 2
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">
                                    Sub
                                Categoría 3
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">
                                    Sub
                                Categoría 4
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {loading ? (
                                Array.from({length: 8}).map((_, index) => (
                                    <div key={index} className=" bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col items-center justify-center overflow-y-auto space-y-2 ">
                                        <div className="w-28 h-28  flex items-center justify-center "></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                ))
                            ) : (
                                filteredProducts.map((product) => (
                                    <CardShowSide key={product.id_product} product={product}  enableDragAndDrop={false} />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductContainer;