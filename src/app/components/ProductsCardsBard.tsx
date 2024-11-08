import React, {useEffect, useState} from 'react';
import { CardShowSide } from './card';
import { getProductsRF } from '../api/productos/prductosRF';
import { ProductTypes } from '@/types/product';
const ProductContainer: React.FC<{ category: string, setCategory: (category: string | null) => void }> = ({ category, setCategory }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [products, setProducts] = useState<ProductTypes[]>([]); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const productsData = await getProductsRF();
            const formattedProducts: ProductTypes[] = productsData.map(product => ({
              ...product,
              descriptions: Array.isArray(product.descriptions) 
                ? product.descriptions.filter((desc): desc is string => typeof desc === 'string')
                : typeof product.descriptions === 'string' 
                  ? [product.descriptions]
                  : []
            }));
            console.log(formattedProducts);
            setProducts(formattedProducts);
            setLoading(false);
          } catch (error) {
            console.error('Error al obtener productos:', error);
            setLoading(false);
          }
        };
    
        fetchProducts(); 
      }, []);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
        
    return (
        <div className="absolute flex h-[80vh] w-96 bg-white rounded-lg shadow-md overflow-hidden z-50 left-28 top-24 ">
            {/* Sección de Productos */}
            <div className="flex-grow p-3 mt-4">
                <div className='flex justify-between items-center'>
                    <p className='text-gray-500 font-bold uppercase'>{category}</p>
                    <button className='text-white font-bold bg-red-500 rounded-md p-2 mb-4' onClick={() => {
                        setCategory(null);
                    }}>Cerrar</button>
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
                        className={`px-3 bg-transparent text-sm ${
                            activeTab === 'all' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400'
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Products
                    </button>
                    <button
                        className={`px-3 bg-transparent text-sm ${
                            activeTab === 'circular' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400'
                        }`}
                        onClick={() => setActiveTab('circular')}
                    >
                        En Circular
                    </button>
                </div>

                {/* Subcategorías */}
                {activeTab === 'all' && (
                    <div
                        className="flex-grow p-3 mt-4 overflow-y-auto h-[calc(100vh-150px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                        <div className="grid grid-cols-2 gap-3 mb-48">
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
                                    <CardShowSide key={product.id} product={product} />
                                    
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Subcategorías */}
                {activeTab === 'circular' && (
                    <div
                        className="flex-grow p-3 mt-4 overflow-y-auto h-[calc(100vh-150px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                            {/* Aquí se agregarán los productos */}
                            <button
                                className="p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 1</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 2</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 3</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 4</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 5</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 6</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 7</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 8</p>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductContainer;