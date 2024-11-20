"use client"
import { CardShow, CardShowSide } from "./components/card";
import { useEffect, useState } from "react";
import Sidebar from "./components/sideBar";
import { motion } from "framer-motion"; // Para animaciones
import { ImageGrid, ImageGrid2, ImageGrid3, ImageGrid4 } from "./components/imageGrid";
import { useProductContext } from "./context/productContext";
import ProductContainer from "./components/ProductsCardsBard";
import ModalEditProduct from "@/app/components/ModalEditProduct";
import { ProductTypes } from "@/types/product";
import { CategoryProvider, useCategoryContext } from "./context/categoryContext";
import { categoriesInterface } from "@/types/category";
import { useAuth } from "./components/provider/authprovider";

export default function HomePage() {
    const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
    const { selectedProducts, setSelectedProducts, productsData, setProductsData } = useProductContext();
    const [loading, setLoading] = useState(true);
    const { currentPage } = useProductContext();
    const [direction, setDirection] = useState(0);
    const [category, setCategory] = useState<categoriesInterface | null>(null);
    const [copiedProduct, setCopiedProduct] = useState<ProductTypes | null>(null);
    const [moveMode, setMoveMode] = useState<{ active: boolean; sourceCellId: number; } | null>(null);

    //states modal for grids with products selected AlexSM
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productByApi, setProductByApi] = useState<[] | null>([])
    const [productSelected, setProductSelected] = useState<ProductTypes | undefined>(undefined)
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    //
    const [showProducts, setShowProducts] = useState(false);
    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getProduct");
                const data = await resp.json();
                setProductsData(data.result);
                setLoading(false);
                if (resp.status === 200) {
                    setProductByApi(data.result);
                    setProductSelected(data.result[1]);
                }
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        getProductView();
    }, []);


    const handleProductSelect = (product: ProductTypes) => {
        if (selectedGridId === null) return;

        const productWithGrid = { ...product, id_grid: selectedGridId };

        setSelectedProducts((prev) => {
            const newProducts = prev.filter((p) => p.id_grid !== selectedGridId);
            const updatedProducts = [...newProducts, productWithGrid];
            return updatedProducts;
        });

        setIsModalOpen(false)
        setShowProducts(false);
    };


    const handleRemoveProduct = (idGrid: number) => {
        setSelectedProducts((prevProducts) => {
            const updatedProducts = prevProducts.filter((product) => product.id_grid !== idGrid);
            return updatedProducts;
        });

        setIsModalOpen(false);
        setShowProducts(false);
    };

    const handleCopyProduct = (product: ProductTypes) => {
        setCopiedProduct(product);
    };

    const handlePasteProduct = () => {
        setCopiedProduct(null); // Limpiar el producto copiado después de pegar
    };

    const handleChangeProduct = (idGrid: number) => {
        // Encontrar el producto y su grid actual
        const productToMove = selectedProducts.find(p => p.id_grid === idGrid);
        if (productToMove && productToMove.id_grid) {
            setMoveMode({
                active: true,
                sourceCellId: productToMove.id_grid
            });
            // Mostrar mensaje al usuario
            console.log({
                title: "Modo de movimiento activado",
                description: "Selecciona el grid destino para mover el producto",
                status: "info",
                duration: 3000,
            });
            setIsModalOpen(false); // Ocultar el panel de productos si está visible
            setShowProducts(false);
        }
    };


    const handleProductMove = (targetCellId: number) => {
        if (!moveMode) return;

        setSelectedProducts(prevProducts => {
            return prevProducts.map(product => {
                if (product.id_grid === moveMode.sourceCellId) {
                    // Actualizar el gridId del producto que se está moviendo
                    return { ...product, id_grid: targetCellId };
                }
                if (product.id_grid === targetCellId) {
                    // Si hay un producto en el grid destino, moverlo al grid origen
                    return { ...product, id: moveMode.sourceCellId };
                }
                return product;
            });
        });

        // Resetear el modo de movimiento
        setMoveMode(null);


        console.log({
            title: "Producto movido",
            description: "El producto ha sido movido exitosamente",
            status: "success",
            duration: 2000,
        });
    };

    const handleGridClick = (gridId: number, idCategory: number | undefined, event: React.MouseEvent) => {

        if (!event) {
            console.error("El evento de ratón no se pasó correctamente.");
            return;
        }

        setMousePosition({ x: event.clientX, y: event.clientY });

        // Verificar si el grid ya tiene un producto
        const gridHasProduct = selectedProducts.some(product => product.id_grid === gridId);

        if (copiedProduct && !selectedProducts.some(product => product.id_grid === gridId)) {
            const productWithNewGrid = { ...copiedProduct, id_grid: gridId };

            setSelectedProducts(prev => [...prev, productWithNewGrid]);
            handlePasteProduct()
            return;
        }

        if (moveMode?.active) {
            handleProductMove(gridId);
        } else if (gridHasProduct && productoShowForce) {
            // Si el grid tiene un producto, mostrar el modal de edición
            const selectedProduct = selectedProducts.find(product => product.id_grid === gridId);
            setProductSelected(selectedProduct);
            setSelectedGridId(gridId);
            setIsModalOpen(true)
        } else {
            // Si el grid está vacío, mostrar el selector de productos
            setSelectedGridId(gridId);
            setIsModalOpen(true);
            setShowProducts(true);
        }
    };


    const commonGridProps = {
        onGridCellClick: handleGridClick,
        onRemoveProduct: handleRemoveProduct,
        onChangeProduct: handleChangeProduct,
        isMoveModeActive: moveMode?.active || false,
        products: productsData,
        onCopyProduct: handleCopyProduct,
        copiedProduct: copiedProduct,
        onPasteProduct: handlePasteProduct

    };


    let productoShowForce: boolean = true;

    const handleChangeProductForOther = (gridId: number | undefined) => {
        if (gridId === undefined)
            return;
        productoShowForce = false;
        console.log(productoShowForce, 'valor del bool', showProducts, gridId)
        setIsModalOpen(false);
        setSelectedGridId(gridId);
        setShowProducts(true);

    }

    const handleSaveChangeProduct = (gridID: number | undefined, price: number, note : string, brust : string) => {
        if (gridID === undefined) {
            return;
        }        
        // Encuentra el índice del producto que deseas actualizar
        const productIndex = selectedProducts.findIndex((product) => product.id_grid === gridID);
        if (productIndex === -1) {
         
            return;
        }

        // Actualiza directamente el producto
        selectedProducts[productIndex].price = price;
        selectedProducts[productIndex].notes = note;     
        selectedProducts[productIndex].burst = brust;

        // Llama a setProductsData para que React reconozca el cambio
        setProductsData([...selectedProducts]);  // El operador de propagación crea una nueva referencia para que React detecte cambios

        console.log(selectedProducts);
        ClosetPanels();
    };
    const handleCategorySelect = (category: categoriesInterface) => {
        setCategory(category);
    };

    const ClosetPanels = () => {
        setShowProducts(false)
        setIsModalOpen(false)
    }


    return (
        <CategoryProvider>
            <div className="flex flex-col">
                <div>
                    <Sidebar onCategorySelect={handleCategorySelect} categorySelected={category} />
                    {category && <ProductContainer category={category} setCategory={setCategory} onProductSelect={handleProductSelect} />}
                </div>
                <div className="grid grid-cols-2 items-center justify-center h-[80vh] ">
                    <div
                        className="flex flex-col justify-center w-full border-r-2 border-black items-center transform scale-90">
                        {/* @ts-ignore */}

                        <ImageGrid {...commonGridProps} />
                        <p className="text-black text-md">Pagina 1</p>
                    </div>
                    <div className="scroll-container flex flex-col h-fit items-center w-full">
                        {/* Contenedor de la cuadrícula centrado */}
                        <div className=" flex justify-center items-center w-full">
                            {/* Contenedor para botones y cuadrícula */}
                            <div className="flex flex-col items-center w-full relative">
                                <motion.div
                                    key={currentPage}
                                    initial={{ x: direction >= 0 ? -300 : 300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: direction >= 0 ? 300 : -300, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full relative"
                                >
                                    {currentPage === 2 && (
                                        <div className=" flex flex-col justify-center items-center w-full border-r-2">
                                            {/* @ts-ignore */}

                                            <ImageGrid2 {...commonGridProps} />

                                            <p className="text-black text-md">Pagina {currentPage} </p>
                                        </div>
                                    )}
                                    {currentPage === 3 && (
                                        <div className="flex flex-col justify-center items-center w-full border-r-2">
                                            {/* @ts-ignore */}

                                            <ImageGrid3 {...commonGridProps} />

                                            <p className="text-black text-md">Pagina {currentPage} </p>
                                        </div>
                                    )}
                                    {currentPage === 4 && (
                                        <div className="flex flex-col justify-center items-center w-full border-r-2">
                                            {/* @ts-ignore */}

                                            <ImageGrid4 {...commonGridProps} />

                                            <p className="text-black text-md">Pagina {currentPage} </p>
                                        </div>
                                    )}

                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mostrar / Ocultar productos */}
                <div className="flex ">
                    {isModalOpen && productSelected && !showProducts && (
                        <ModalEditProduct
                            setIsOpen={setIsModalOpen}
                            product={productSelected as ProductTypes}
                            GridID={selectedGridId || 0}
                            SaveFC={handleSaveChangeProduct}
                            ChangeFC={() => {
                                handleChangeProductForOther(selectedGridId || 0);
                            }}
                            DeleteFC={() => handleRemoveProduct(selectedGridId || 0)}
                        />
                    )}

                    {/* Mostrar el panel de selección de productos (GridProduct) */}
                    {showProducts && mousePosition && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            exit={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute"
                            style={{
                                top: Math.min(mousePosition.y + 80, window.innerHeight - 400),
                                left: Math.min(mousePosition.x + 40, window.innerWidth - 600),
                            }}
                        >
                            <GridProduct
                                productsData={productsData}
                                loading={loading}
                                onProductSelect={handleProductSelect}
                                onHideProducts={ClosetPanels}
                            />
                        </motion.div>
                    )}
                </div>

            </div>
        </CategoryProvider>
    );
};

interface GridProductProps {
    productsData: ProductTypes[];
    loading: boolean;
    onProductSelect: (product: ProductTypes) => void;
    onHideProducts?: () => void;
}

const GridProduct: React.FC<GridProductProps> = ({
    loading,
    onProductSelect,
    onHideProducts,
    productsData
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const {categoriesData} = useCategoryContext();
    const [category, setCategory] = useState<categoriesInterface>(categoriesData[0]);
    const [activeTab, setActiveTab] = useState('all');

    const filteredProducts = productsData?.filter((product) => {
        // Si hay un término de búsqueda, buscar en todos los productos sin importar la categoría
        if (searchTerm) {
            return (
                product.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.master_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.upc?.toString().includes(searchTerm) ||
                product.variety?.includes(searchTerm)
            );
        }
        // Si no hay término de búsqueda, filtrar solo por categoría
        return product.id_category === category?.id_category;
    });

    useEffect(() => {
        if (categoriesData.length > 0 && !category) {
            setCategory(categoriesData[0]);
        }
    }, [categoriesData]);

    return (
        <div className="bg-[#f5f5f5] p-4 h-[45vh] w-[40vw] absolute top-0 left-0 rounded-lg shadow-lg hover:shadow-xl overflow-y-auto no-scrollbar">

            <div className="flex bg-white sticky top-0 z-10 items-center justify-between">
                <div>
                    <select
                        className="text-black w-36 font-bold"
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
                <input
                    type="text"
                    placeholder="Search Products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" p-2 border rounded text-black m-4 sm:text-sm"
                />
                <div className="flex gap-2 mb-1">
                    <button
                        className={`px-3 bg-transparent text-sm ${activeTab === 'all' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400'
                            }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Products
                    </button>
                    <button
                        className={`px-3 bg-transparent text-sm ${activeTab === 'circular' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400'
                            }`}
                        onClick={() => setActiveTab('circular')}
                    >
                        In Circular
                    </button>
                </div>

            </div>
            <div className="flex flex-wrap gap-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className=" bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col items-center justify-center overflow-y-auto space-y-2 ">
                            <div className="w-28 h-28  flex items-center justify-center "></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    ))
                ) : (
                    filteredProducts.map((product) => (
                        <CardShowSide key={product.id_product} product={product} onProductSelect={onProductSelect} />

                    ))
                )}
            </div>
            <button className="fixed -top-3 left-[39vw] bg-black rounded-full w-8 h-8 text-white hover:bg-gray-800 z-50" onClick={onHideProducts}>
                X
            </button>
        </div>
    );
}
