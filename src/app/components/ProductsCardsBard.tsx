import React, {useEffect, useState} from 'react';
import { CardShowSide } from './card';
import { ProductTypes } from '@/types/product';
import { categoriesInterface } from '@/types/category';
import { useProductContext } from '../context/productContext';
import { Message } from "primereact/message";

interface ProductContainerProps { 
    category: categoriesInterface | null, 
    setCategory: (category: categoriesInterface | null) => void,
    onProductSelect: (product: ProductTypes) => void 
    onDragAndDropCell?: (gridCellToMove: any, stopDragEvent: MouseEvent) => void;
    setShowProductCardBrand?:(arg:boolean) => void;
}

const ProductContainer: React.FC<ProductContainerProps> = ({ category, setCategory, onProductSelect, onDragAndDropCell, setShowProductCardBrand }) => {
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
        <div className="flex h-[80vh] w-96 bg-white bg-opacity-[.96] rounded-lg shadow-md overflow-hidden">
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
                        
                            {
                                filteredProducts.length === 0 ? 
                                (
                                    <div className='py-4'>
                                        <Message
                                            style={{ borderLeft: "6px solid #b91c1c", color: "#b91c1c" }}
                                            className="w-full"
                                            severity="error"
                                            text={searchTerm ? "Products not found" : "There are no products of this category"}
                                        />
                                    </div>
                                ) 
                                : 
                                <div className="grid grid-cols-2 gap-3">
                                    {
                                        (loading ? Array.from({length: 8}).fill({} as ProductTypes) : filteredProducts ).map((product: any, index) => (
                                            <CardShowSide key={product.id_product || index} product={product} enableDragAndDrop={true} onDragAndDropCell={onDragAndDropCell} setShowProductCardBrand={setShowProductCardBrand} setCategory={setCategory} isLoading={loading}/>
                                        ))
                                    }
                                </div>
                            }
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

                        
                            {
                                filteredProducts.length === 0 ? 
                                (
                                    <div className='py-4'>
                                        <Message
                                            style={{ borderLeft: "6px solid #b91c1c", color: "#b91c1c" }}
                                            className="w-full"
                                            severity="error"
                                            text={searchTerm ? "Products not found" : "There are no products of this category"}
                                        />
                                    </div>
                                ) 
                                : 
                                <div className="grid grid-cols-2 gap-3">
                                    {
                                        (loading ? Array.from({length: 8}).fill({} as ProductTypes) : filteredProducts ).map((product: any, index) => (
                                            <CardShowSide key={product.id_product || index} product={product} enableDragAndDrop={true} onDragAndDropCell={onDragAndDropCell} setShowProductCardBrand={setShowProductCardBrand} setCategory={setCategory} isLoading={loading}/>
                                        ))
                                    }
                                </div>
                            }
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductContainer;