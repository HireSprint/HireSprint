import React, {useCallback, useEffect, useState} from 'react';
import { CardShowSide } from './card';
import { ProductTypes } from '@/types/product';
import { categoriesInterface } from '@/types/category';
import { useProductContext } from '../context/productContext';
import { Message } from "primereact/message";
import { useCategoryContext } from '../context/categoryContext';

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
    const [productsByCategory, setProductsByCategory] = useState<ProductTypes[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { getProductsByCategory, isLoadingProducts } = useCategoryContext();
    const { selectedProducts } = useProductContext();
    const [circularProducts, setCircularProducts] = useState<ProductTypes[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            if (category?.id_category) {
                try {
                    const products = await getProductsByCategory(category.id_category, currentPage);
                    setCircularProducts(selectedProducts.filter(p => p.id_category === category.id_category));
                    setProductsByCategory(prev => 
                        currentPage === 1 ? products : [...prev, ...products]
                    );
                    setHasMore(products.length > 0);
                } catch (error) {
                    console.error('Error loading products:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadProducts();
    }, [category?.id_category, currentPage, selectedProducts]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            if (!loading && hasMore) {
                setCurrentPage(prev => prev + 1);
                if (category?.id_category) {
                    getProductsByCategory(category.id_category, currentPage + 1);
                }
            }
        }
    }, [loading, hasMore, currentPage, category?.id_category, getProductsByCategory]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = productsByCategory.filter((product) => {
        const matchesSearch = product.desc?.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeTab === 'circular') {
            return matchesSearch && circularProducts.some(cp => cp.id_product === product.id_product);
        }
        return matchesSearch;
    });



    return (
        <div className="@container flex h-[74vh] w-[28vw] bg-white bg-opacity-[.96] rounded-lg shadow-md overflow-hidden">
            {/* Sección de Productos */}
            <div className="grid grid-rows-[min-content_auto] gap-3 p-3 w-full">
                
                <div className='flex flex-col w-full'>
                    <div className='flex justify-between items-center'>
                        <p className='text-gray-500 font-bold uppercase'>{category?.name_category}</p>

                        <button className='text-white font-bold bg-red-500 rounded-md p-2 mb-4' onClick={() => { setCategory(null) }}>
                            Cerrar
                        </button>
                    </div>

                    <input type="text" 
                        placeholder="Find Product"
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
                        className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        onScroll={handleScroll}
                    >
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
                                <div className="grid @[100px]:grid-cols-1 @[370px]:grid-cols-2 @[470px]:grid-cols-3 gap-2">
                                    {
                                        (loading ? Array.from({length: 9}).fill({} as ProductTypes) : filteredProducts ).map((product: any, index) => (
                                            <CardShowSide key={product.id_product || index} product={product} enableDragAndDrop={true} onDragAndDropCell={onDragAndDropCell} setShowProductCardBrand={setShowProductCardBrand} setCategory={setCategory} isLoading={loading}/>
                                        ))
                                    }
                                </div>
                            }
                            {loading && hasMore && (
                                <div className="flex justify-center p-4">
                                    <p className="text-gray-500">Loading more products...</p>
                                </div>
                            )}
                    </div>
                )}

                {/* Subcategorías */}
                {activeTab === 'circular' && (
                    <div 
                        className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        onScroll={handleScroll}
                    >
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
                            {loading && hasMore && (
                                <div className="flex justify-center p-4">
                                    <p className="text-gray-500">Cargando más productos...</p>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductContainer;