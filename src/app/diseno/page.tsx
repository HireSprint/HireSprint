"use client"
import {CardProduct} from "../components/card";
import {getProductsRF} from "../api/productos/prductosRF";
import {useEffect, useState} from "react";
import Lottie from "lottie-react";
import LoadingLottie from "../components/lottie/loading-Lottie.json";
import Sidebar from "../components/sideBar";
import {motion} from "framer-motion"; // Para animaciones
import {ImageGrid, ImageGrid2, ImageGrid3, ImageGrid4} from "../components/imageGrid";

interface Product {
    id: string;
    name: string;
    image: string;
    gridId?: number;
    descriptions: string;
}

interface Grid {
    id: number;
    product: Product | null;
}

const Diseno = () => {
    const [showProducts, setShowProducts] = useState(false);
    const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sideBarVisible, setSideBarVisible] = useState(false);
    const [grids, setGrids] = useState<Grid[]>([]);
    const [currentPage, setCurrentPage] = useState(2); 
    const [direction, setDirection] = useState(0); 
    const [moveMode, setMoveMode] = useState<{
        active: boolean;
        productId: string;
        sourceGridId: number;
    } | null>(null);

    useEffect(() => {
        if (products.length === 0) {
            const fetchProducts = async () => {
                try {
                    const productsData = await getProductsRF();
                    setProducts(productsData);
                } catch (error) {
                    console.error("Error al obtener productos:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [products.length]);

    const handleProductSelect = (product: Product) => {
        if (selectedGridId === null) return;

        const productWithGrid = {...product, gridId: selectedGridId};

        setGrids((prevGrids) =>
            prevGrids.map((grid) =>
                grid.id === selectedGridId ? {...grid, product: productWithGrid} : grid
            )
        );

        setSelectedProducts((prev) => {
            const newProducts = prev.filter((p) => p.gridId !== selectedGridId);
            return [...newProducts, productWithGrid]; // Reemplaza o añade el producto
        });
    };

    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
        );
        setGrids((prevGrids) =>
            prevGrids.map((grid) =>
                grid.product && grid.product.id === productId ? {...grid, product: null} : grid
            )
        );
    };

    const changePage = (newPage: number) => {
        setDirection(newPage > currentPage ? 1 : -1);
        setCurrentPage(newPage);
    };

    const handleEditProduct = (productId: string) => {
        // Implementa la lógica para editar el producto
        
    };

    const handleChangeProduct = (productId: string) => {
        // Encontrar el producto y su grid actual
        const productToMove = selectedProducts.find(p => p.id === productId);
        if (productToMove && productToMove.gridId) {
            setMoveMode({
                active: true,
                productId: productId,
                sourceGridId: productToMove.gridId
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
                if (product.id === moveMode.productId) {
                    // Actualizar el gridId del producto que se está moviendo
                    return { ...product, gridId: targetGridId };
                }
                if (product.gridId === targetGridId) {
                    // Si hay un producto en el grid destino, moverlo al grid origen
                    return { ...product, gridId: moveMode.sourceGridId };
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

    const handleGridSelect = (gridId: number) => {
        if (moveMode?.active) {
            // Si estamos en modo de movimiento, mover el producto al nuevo grid
            handleProductMove(gridId);
        } else {
            setSelectedGridId(gridId);
            setShowProducts(true);
        }
    };

    const commonGridProps = {
        onProductSelect: handleGridSelect,
        selectedProducts: selectedProducts,
        onRemoveProduct: handleRemoveProduct,
        onEditProduct: handleEditProduct,
        onChangeProduct: handleChangeProduct,
        isMoveModeActive: moveMode?.active || false,
    };

    return (
        <div 
            className="flex flex-col h-fit items-center" >
            <div className="grid grid-cols-2 w-full items-center justify-center py-8">
                {/* Primera columna con ImageGrid */}
                <div className="flex justify-center items-center w-full border-r-2 border-black">
                    <ImageGrid {...commonGridProps}/>
                </div>
                <div className="scroll-container flex flex-col h-fit items-center w-full">
                    {/* Contenedor de la cuadrícula centrado */}
                    <div className=" flex justify-center items-center w-full">
                        {/* Contenedor para botones y cuadrícula */}
                        <div className="flex flex-col items-center w-full relative">
                            <div className="flex space-x-2 mb-4">
                                {[2, 3, 4].map((page) => (
                                    <button
                                        key={page}
                                        className={`px-4 py-2  border-2 transition duration-300 ease-in-out ${
                                            currentPage === page
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white text-blue-500 border-blue-500'
                                        } hover:bg-blue-500 hover:text-white`}
                                        onClick={() => changePage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <motion.div
                                key={currentPage}
                                initial={{ x: direction >= 0 ? -300 : 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: direction >= 0 ? 300 : -300, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full relative"
                            >
                                {currentPage === 2 && (
                                    <div className=" flex justify-center items-center w-full border-r-2">
                                        <ImageGrid2 {...commonGridProps}/>
                                    </div>
                                )}
                                {currentPage === 3 && (
                                    <div className="flex justify-center items-center w-full border-r-2">
                                        <ImageGrid3 {...commonGridProps}/>
                                    </div>
                                )}
                                {currentPage === 4 && (
                                    <div className="flex justify-center items-center w-full border-r-2">
                                        <ImageGrid4 {...commonGridProps}/>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mostrar / Ocultar productos */}
            <div className="flex ">
                {showProducts ? (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        exit={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        className="absolute bottom-0 left-0 w-full bg-[#393939] h-[25%]"
                    >
                        <GridProduct
                            products={products}
                            loading={loading}
                            onProductSelect={handleProductSelect}
                            onHideProducts={() => setShowProducts(false)}
                        />
                    </motion.div>
                ) : null}
            </div>

            <button
                className="absolute right-0 bg-[#393939] w-12 h-20 rounded-l-full p-4 font-bold hover:w-28 transition-all duration-300 hover:bg-[#7cc304]"
                onClick={() => setSideBarVisible(true)}
                aria-label="Abrir Panel Productos"
            > Abrir Panel
            </button>
            {sideBarVisible && (
                <motion.div
                    initial={{x: 300, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: 300, opacity: 0}}
                    transition={{duration: 0.5}}
                    className="absolute right-0 bg-white w-64 h-full shadow-lg"
                >
                    <Sidebar
                        selectedProducts={selectedProducts}
                        onClose={() => setSideBarVisible(false)}
                        onRemoveProduct={handleRemoveProduct}
                    />
                </motion.div>
            )}
        </div>
    );
};

interface GridProductProps {
    products: Product[];
    loading: boolean;
    onProductSelect: (product: Product) => void;
    onHideProducts?: () => void;
}

const GridProduct: React.FC<GridProductProps> = ({
    products,
    loading,
    onProductSelect,
    onHideProducts,
}) => { 
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className=" bg-[#393939] p-4 h-fit">
            <div className="flex justify-between">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" p-2 border rounded text-black m-4 "
                />
                <button
                    onClick={onHideProducts}
                    className="bg-red-500 text-white p-2 rounded m-4"
                >
                    Ocultar Productos
                </button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center ">
                    <Lottie animationData={LoadingLottie}/>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="flex overflow-x-auto space-x-4 h-fit">
                    {filteredProducts.map((product) => (
                        <CardProduct
                            product={product}
                            key={product.id}
                            onProductSelect={onProductSelect}
                        />
                    ))}
                </div>
            ) : (
                <p>No se encontraron productos.</p>
            )}
        </div>
    );
};

export default Diseno
