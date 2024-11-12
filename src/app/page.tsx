"use client"
import { CardShow, CardShowSide } from "./components/card";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import LoadingLottie from "./components/lottie/loading-Lottie.json";
import Sidebar from "./components/sideBar";
import { motion } from "framer-motion"; // Para animaciones
import { ImageGrid, ImageGrid2, ImageGrid3, ImageGrid4 } from "./components/imageGrid";
import { useProductContext } from "./context/productContext";
import ProductContainer from "./components/ProductsCardsBard";
import ModalEditProduct from "@/app/components/ModalEditProduct";
import { ProductTypes } from "@/types/product";
import { categoriesInterface } from "@/types/category";
import SendModal from "./components/sendModal";


export default function HomePage() {
    const [showProducts, setShowProducts] = useState(false);
    const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
    const { selectedProducts, setSelectedProducts, isSendModalOpen } = useProductContext();
    const [productsData, setProductsData] = useState<ProductTypes[]>([]);
    const [loading, setLoading] = useState(true);
    const [grids, setGrids] = useState<{ id: number, product: ProductTypes | null }[]>([]);
    const { currentPage } = useProductContext();
    const [direction, setDirection] = useState(0);
    const [category, setCategory] = useState<string | null>(null);
    const [copiedProduct, setCopiedProduct] = useState<ProductTypes | null>(null);
    const [moveMode, setMoveMode] = useState<{
        active: boolean;
        productId: number;
        sourceGridId: number;
    } | null>(null);

    //states modal for grids with products selected AlexSM
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productByApi, setProductByApi] = useState<[] | null>([])
    const [productSelected, setProductSelected] = useState<ProductTypes | undefined>(undefined)
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });



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

    console.log(productsData, "productsData")


    const handleProductSelect = (product: ProductTypes) => {
        if (selectedGridId === null) return;

        const productWithGrid = { ...product, id_product: selectedGridId };
        setGrids((prevGrids) => {
            const updatedGrids = prevGrids.map((grid) =>
                grid.id === selectedGridId ? { ...grid, product: productWithGrid } : grid
            );
            return updatedGrids;
        });

        setSelectedProducts((prev) => {
            const newProducts = prev.filter((p) => p.id_product !== selectedGridId);
            const updatedProducts = [...newProducts, productWithGrid];
            return updatedProducts;
        });
    };
    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts((prevProducts) => {
            const updatedProducts = prevProducts.filter((product) => product.id_product !== productId);
            return updatedProducts;
        });
        setGrids((prevGrids) => {
            const updatedGrids = prevGrids.map((grid) =>
                grid.product && grid.product.id_product === productId ? { ...grid, product: null } : grid
            );
            return updatedGrids;
        });
        setShowProducts(false);
    };

    const handleCopyProduct = (product: ProductTypes) => {
        setCopiedProduct(product);
    };

    const handlePasteProduct = () => {
        setCopiedProduct(null); // Limpiar el producto copiado después de pegar
    };

    const handleChangeProduct = (productId: number) => {
        // Encontrar el producto y su grid actual
        const productToMove = selectedProducts.find(p => p.id_product === productId);
        if (productToMove && productToMove.id_product) {
            setMoveMode({
                active: true,
                productId: productId,
                sourceGridId: productToMove.id_product
            });
            // Mostrar mensaje al usuario
            console.log({
                title: "Modo de movimiento activado",
                description: "Selecciona el grid destino para mover el producto",
                status: "info",
                duration: 3000,
            });
            setShowProducts(false); // Ocultar el panel de productos si está visible
        }
    };


    const handleProductMove = (targetGridId: number) => {
        if (!moveMode) return;

        setSelectedProducts(prevProducts => {
            return prevProducts.map(product => {
                if (product.id_product === moveMode.productId) {
                    // Actualizar el gridId del producto que se está moviendo
                    return { ...product, id_product: targetGridId };
                }
                if (product.id_product === targetGridId) {
                    // Si hay un producto en el grid destino, moverlo al grid origen
                    return { ...product, id: moveMode.sourceGridId };
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

    const handleGridSelect = (gridId: number, categoryGridSelected: categoriesInterface, event: React.MouseEvent) => {
        if (!event) {
            console.error("El evento de ratón no se pasó correctamente.");
            return;
        }

        // Verificar si el grid ya tiene un producto
        setMousePosition({ x: event.clientX, y: event.clientY });

        const gridHasProduct = selectedProducts.some(product => product.id_product === gridId);

        if (copiedProduct && !selectedProducts.some(product => product.id_product === gridId)) {
            const productWithNewGrid = { ...copiedProduct, id_product: gridId };
            setSelectedProducts(prev => [...prev, productWithNewGrid]);
            setGrids(prevGrids => {
                return prevGrids.map(grid =>
                    grid.id === gridId ? { ...grid, product: productWithNewGrid } : grid
                );
            });
            return;
        }

        if (moveMode?.active) {
            handleProductMove(gridId);
        } else if (gridHasProduct) {
            // Si el grid tiene un producto, mostrar el modal de edición
            const selectedProduct = selectedProducts.find(product => product.id_product === gridId);
            setProductSelected(selectedProduct);
            setSelectedGridId(gridId);
            setIsModalOpen(true)
        } else {
            // Si el grid está vacío, mostrar el selector de productos
            setSelectedGridId(gridId);
            setShowProducts(true);
        }
    };



    const commonGridProps = {
        onProductSelect: handleGridSelect,
        selectedProducts: selectedProducts,
        onRemoveProduct: handleRemoveProduct,
        onChangeProduct: handleChangeProduct,
        isMoveModeActive: moveMode?.active || false,
        products: productsData,
        isCellOccupied: selectedProducts.some(product => product.id_product === selectedGridId),
        onCopyProduct: handleCopyProduct,
        copiedProduct: copiedProduct,
        onPasteProduct: handlePasteProduct

    };

    const handleCategorySelect = (category: string) => {
        setCategory(category);
    };

    return (
        <div className="flex flex-col" >
            <div>
                <Sidebar onCategorySelect={handleCategorySelect} categorySelected={category} />
                {category && <ProductContainer category={category} setCategory={setCategory} />}
            </div>
            <div className="grid grid-cols-2 items-center justify-center h-[80vh] ">
                <div className="flex flex-col justify-center w-full border-r-2 border-black items-center transform scale-90">
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
                            {isSendModalOpen && <SendModal />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mostrar / Ocultar productos */}
            <div className="flex ">
                {showProducts && mousePosition && (
                    selectedProducts.some(product => product.id_product === selectedGridId) ? (
                        <ModalEditProduct
                            isOpen={isModalOpen}
                            setIsOpen={setIsModalOpen}
                            product={productSelected as ProductTypes}
                            GridID={selectedGridId || 0}
                            SaveFC={() => (console.log("save"))}
                            ChangeFC={() => (console.log("change"))}
                            DeleteFC={() => (console.log("Delete"))}
                        />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            exit={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute"
                            style={{
                                top: Math.min(mousePosition.y + 80, window.innerHeight - 400),
                                left: Math.min(mousePosition.x + 40, window.innerWidth - 600)
                            }}
                        >
                            <GridProduct
                                productsData={productsData}
                                loading={loading}
                                onProductSelect={handleProductSelect}
                                onHideProducts={() => setShowProducts(false)}
                                category={category}
                            />
                        </motion.div>
                    )
                )}
            </div>

        </div>
    );
};

interface GridProductProps {
    productsData: ProductTypes[];
    loading: boolean;
    onProductSelect: (product: ProductTypes) => void;
    onHideProducts?: () => void;
    category: string | null;
}

const GridProduct: React.FC<GridProductProps> = ({
    loading,
    onProductSelect,
    category,
    productsData,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [, setCategory] = useState(category || "");
    const [activeTab, setActiveTab] = useState('all');

    
    const filteredProducts = productsData?.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())

    );

    return (
        <div className=" bg-[#f5f5f5] p-4 h-[45vh] w-[40vw] absolute top-0 left-0 rounded-lg shadow-lg hover:shadow-xl overflow-y-auto no-scrollbar">
            <div className="flex  bg-white sticky top-0 z-10 items-center justify-between">
                <div>
                    <select
                        className=" text-black w-fit font-bold"
                        onChange={(e) => setCategory(e.target.value)} >
                        <option value="specials">Specials</option>
                        <option value="bakery">Bakery </option>
                        <option value="deli">Deli</option>
                        <option value="dairy">Dairy</option>
                        <option value="frozen">Frozen </option>
                        <option value="grocery">Grocery</option>
                        <option value="meat">Meat</option>
                    </select>
                </div>
                <input
                    type="text"
                    placeholder="Buscar productos..."
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
                        En Circular
                    </button>
                </div>


            </div>
            <div className="flex flex-wrap gap-4">
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
                                    <CardShowSide key={product.id_product} product={product} />
                                    
                                ))
                            )}
                        </div>
        </div>
    );
};
