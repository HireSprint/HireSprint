import { useProductContext } from "../context/productContext";
import { useCategoryContext } from "../context/categoryContext";
import { useAuth } from "./provider/authprovider";
import { useEffect, useMemo, useState, useRef } from "react";
import { categoriesInterface } from "@/types/category";
import { ProductTypes } from "@/types/product";
import { CardShowSide } from "./card";
import { Message } from "primereact/message";
import { SendProductSuggestDiscord } from "@/pages/api/apiMongo/discord";
import { toast, ToastContainer } from "react-toastify";

interface GridProductProps {
    onProductSelect: (product: ProductTypes) => void;
    onHideProducts?: () => void;
    initialCategory: categoriesInterface | null;
}

const GridProduct: React.FC<GridProductProps> = ({ onProductSelect, onHideProducts, initialCategory }) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const { selectedProducts, setSelectedProducts } = useProductContext();
    const { getProductsByCategory, categoriesData } = useCategoryContext();
    const [category, setCategory] = useState<categoriesInterface>(initialCategory || categoriesData[0]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [productsByCategory, setProductsByCategory] = useState<ProductTypes[]>([]);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [productsAllData, setProductsAllData] = useState<ProductTypes[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const observerTarget = useRef(null);
    const [searchResults, setSearchResults] = useState<ProductTypes[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [isSelectingImage, setIsSelectingImage] = useState(false);
    const [newProductForm, setNewProductForm] = useState({
        url_image: '',
        brand: '',
        master_brand: '',
        desc: '',
        variety: '',
        size: ''
    });


    useEffect(() => {
        setLoading(true)
        setTimeout(() => setLoading(false), 500);
        if (initialCategory) setCategory(initialCategory);
    }, [initialCategory]);

    const fetchProductsByCategory = async (pageNum: number, isNewCategory: boolean = false) => {
        if (!debouncedSearchTerm && activeTab === 'all') {
            setLoadingMore(true);
        }

        try {
            const data = await getProductsByCategory(category.id_category, pageNum);

            if (!data || data.length === 0) {
                setHasMore(false);
                return;
            }

            setProductsByCategory(prev => {
                const newProducts = isNewCategory ? data : [...prev, ...data];
                return newProducts;
            });

            setSelectedProducts(prevData => {
                const updatedData = [...prevData] as ProductTypes[];
                data.forEach(newProduct => {
                    const index = updatedData.findIndex(p => p.id_product === newProduct.id_product);
                    if (index !== -1) {
                        updatedData[index] = { ...updatedData[index], ...newProduct } as ProductTypes;
                    }
                });
                return updatedData;
            });

        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            if (activeTab === 'all') {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    };

    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getProduct");
                const data = await resp.json();
                const activeProducts = data.result.filter((product: ProductTypes) => product.status_active);
                setProductsAllData(activeProducts);
            } catch (error) {
                console.error("Error in get products", error);
            }
        };
        getProductView();
    }, []);


    const searchInProducts = (searchTerm: string) => {
        setLoading(true);
        const searchLower = searchTerm.toLowerCase();

        const results = productsAllData.filter((product) => {
            return (
                (product.desc?.toLowerCase().includes(searchLower)) ||
                (product.master_brand?.toLowerCase().includes(searchLower)) ||
                (product.brand?.toLowerCase().includes(searchLower)) ||
                (product.upc?.toString().includes(searchTerm)) ||
                (product.variety?.some(v => v.toLowerCase().includes(searchLower)))
            );
        }).slice(0, 100);

        setSearchResults(results);
        setLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length >= 3) {
                setIsSearching(true);
                searchInProducts(searchTerm);
                setHasMore(false);
            } else {
                setIsSearching(false);
                setSearchResults([]);
                setHasMore(true);
                if (searchTerm.length === 0) {
                    fetchProductsByCategory(1, true);
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && activeTab === 'all') {
                    setCurrentPage(prev => prev + 1);
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, activeTab]);

    useEffect(() => {
        if (category?.id_category) {
            setLoading(true);
            setProductsByCategory([]);
            setCurrentPage(1);
            setHasMore(true);
            setIsSearching(false);

            setTimeout(() => {
                if (activeTab === 'all') {
                    fetchProductsByCategory(1, true);
                } else {
                    setLoading(false);
                }
            }, 300);
        }
    }, [category?.id_category, activeTab]);

    useEffect(() => {
        if (currentPage > 1) {
            fetchProductsByCategory(currentPage);
        }
    }, [currentPage]);

    useEffect(() => {
        setDebouncedSearchTerm(searchTerm);
    }, [searchTerm]);


    const displayedProducts = useMemo(() => {
        if (isSearching) {
            return searchResults;
        }
        if (activeTab === 'circular') {
            const seenGrids = new Set();
            const productsInCircular = selectedProducts
                .filter(product => product.id_category === category.id_category)
                .filter(product => {
                    if (seenGrids.has(product.id_grid)) {
                        return false;
                    }
                    seenGrids.add(product.id_grid);
                    return true;
                });

            return productsInCircular;
        }

        return productsByCategory;
    }, [isSearching, searchResults, productsByCategory, activeTab, category, selectedProducts]);

    const handleGoogleImageSearch = () => {
        const searchQuery = encodeURIComponent(`${category.name_category} product `);
        const googleUrl = `https://www.google.com/search?q=${searchQuery}&tbm=isch`;

        // Primero mostrar el modal
        setShowImageModal(true);
        setIsSelectingImage(true);

        // Luego abrir la ventana de Google Images
        const googleWindow = window.open(googleUrl, 'googleImages', 'width=800,height=600');
    };

    return (
        <div
            className="@container relative bg-[#f5f5f5] p-4 h-[40vh] w-[800px] max-w-[95vw] rounded-lg shadow-xl overflow-visible">
            <button
                className="absolute -top-2 -right-2 bg-black rounded-full w-8 h-8 text-white hover:bg-gray-800 z-50"
                onClick={onHideProducts}>
                X
            </button>
            <div className="grid grid-rows-[min-content_1fr] h-full">
                <div className="flex flex-wrap bg-white items-center justify-between relative rounded-md p-2 gap-3">
                    <div>
                        <select
                            className="text-black w-36 font-bold p-2"
                            value={category?.name_category || ''}
                            onChange={(e) => {
                                const selectedCategory = categoriesData.find(
                                    cat => cat.name_category === e.target.value
                                );
                                if (selectedCategory) {
                                    setCategory(selectedCategory);
                                }
                            }}
                        >
                            {categoriesData.map((cat) => (
                                <option key={cat.id_category} value={cat.name_category}>
                                    {cat.name_category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            className="px-2 py-2 rounded-md text-black underline hover:text-blue-500"
                            onClick={handleGoogleImageSearch}
                        >
                            Add Products
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Search Products"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                        className="p-2 border rounded text-black sm:text-sm"
                    />

                    <div className="flex flex-wrap gap-2 mb-1">
                        <button className={`px-3 bg-transparent text-sm ${activeTab === 'all' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400'}`} onClick={() => setActiveTab('all')} >
                            All Products
                        </button>
                        <button className={`px-3 bg-transparent text-sm ${activeTab === 'circular' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400'}`} onClick={() => setActiveTab('circular')} >
                            In Circular
                        </button>
                    </div>

                </div>
                <div className="overflow-y-auto no-scrollbar h-full">
                    {loading ? (
                        <div className="grid @[100px]:grid-cols-1 @[370px]:grid-cols-2 @[470px]:grid-cols-4 pt-2 gap-2">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="bg-gray-200 animate-pulse rounded-lg p-4 h-[150px]">
                                    <div className="h-20 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        <div className='py-3'>
                            <Message
                                style={{ borderLeft: "6px solid #b91c1c", color: "#b91c1c" }}
                                className="w-full"
                                severity="error"
                                text={searchTerm ? "Products not found" : "There are no products of this category"}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="grid @[100px]:grid-cols-1 @[370px]:grid-cols-2 @[470px]:grid-cols-4 pt-2 gap-2">
                                {activeTab === 'all' && (
                                    displayedProducts.map((product: any) => (
                                        <CardShowSide
                                            key={product.id_product || `temp-${Date.now()}`}
                                            product={product}
                                            onProductSelect={onProductSelect}
                                            isLoading={false}
                                        />
                                    ))
                                )}

                                {activeTab === 'circular' && (
                                    displayedProducts.map((product: any) => (
                                        <div key={product?.id_product || `temp-${Date.now()}`} className="relative">
                                            <div className="left-0 text-sm text-black">
                                                {"Page-" + product?.id_grid?.toString().charAt(0) || 'N/A'}
                                            </div>
                                            <CardShowSide
                                                key={`card-${product?.id_product || Date.now()}`}
                                                product={product}
                                                onProductSelect={onProductSelect}
                                                isLoading={false}
                                            />
                                        </div>
                                    ))
                                )}


                            </div>

                            {!isSearching && activeTab === 'all' && (
                                <div
                                    ref={observerTarget}
                                    className="h-20 flex items-center justify-center mt-4"
                                    style={{ visibility: loadingMore ? 'visible' : 'hidden' }}
                                >
                                    {loadingMore && hasMore && (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                    )}
                                    {!hasMore && (
                                        <p className="text-gray-500 text-sm">No hay más productos para mostrar</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4 text-black">Add new product</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL Image*
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded text-black"
                                    value={newProductForm.url_image}
                                    onChange={(e) => setNewProductForm(prev => ({
                                        ...prev,
                                        url_image: e.target.value
                                    }))}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Master Brand
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded text-black"
                                    value={newProductForm.master_brand}
                                    onChange={(e) => setNewProductForm(prev => ({
                                        ...prev,
                                        master_brand: e.target.value
                                    }))}
                                    placeholder="Master Brand"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand*
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded text-black"
                                    value={newProductForm.brand}
                                    onChange={(e) => setNewProductForm(prev => ({
                                        ...prev,
                                        brand: e.target.value
                                    }))}
                                    placeholder="Brand"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description*
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded text-black"
                                    value={newProductForm.desc}
                                    onChange={(e) => setNewProductForm(prev => ({
                                        ...prev,
                                        desc: e.target.value
                                    }))}
                                    placeholder="Description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Variety*
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded text-black"
                                    value={newProductForm.variety}
                                    onChange={(e) => setNewProductForm(prev => ({
                                        ...prev,
                                        variety: e.target.value
                                    }))}
                                    placeholder="Variety"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Size*
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded text-black"
                                    value={newProductForm.size}
                                    onChange={(e) => setNewProductForm(prev => ({
                                        ...prev,
                                        size: e.target.value
                                    }))}
                                    placeholder="Ej: 12 oz"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                                onClick={() => {
                                    setShowImageModal(false);
                                    setNewProductForm({
                                        url_image: '',
                                        brand: '',
                                        master_brand: '',
                                        desc: '',
                                        variety: '',
                                        size: ''
                                    });
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={async () => {
                                    if (!newProductForm.url_image || !newProductForm.brand || !newProductForm.desc || !newProductForm.size) {
                                        toast.error('Por favor complete los campos obligatorios');
                                        return;
                                    }

                                    try {
                                        await SendProductSuggestDiscord(newProductForm.url_image, category, newProductForm, user);

                                        const productSuggest: Partial<ProductTypes> = {
                                            url_image: newProductForm.url_image,
                                            brand: newProductForm.brand,
                                            master_brand: newProductForm.master_brand,
                                            desc: newProductForm.desc,
                                            variety: [newProductForm.variety],
                                            size: [newProductForm.size],
                                            id_category: category.id_category,
                                        };

                                        onProductSelect(productSuggest as ProductTypes);
                                        setShowImageModal(false);
                                        setNewProductForm({
                                            url_image: '',
                                            brand: '',
                                            master_brand: '',
                                            desc: '',
                                            variety: '',
                                            size: ''
                                        });
                                        toast.success('Producto sugerido añadido correctamente');
                                    } catch (error) {
                                        console.error('Error:', error);
                                        toast.error('Error al procesar el producto');
                                    }
                                }}
                            >
                                Guardar producto
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default GridProduct;