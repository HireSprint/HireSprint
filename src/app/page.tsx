"use client"
import {CardShow} from "./components/card";
import {getProductsRF} from "./api/productos/prductosRF";
import {useEffect, useState} from "react";
import Lottie from "lottie-react";
import LoadingLottie from "./components/lottie/loading-Lottie.json";
import Sidebar from "./components/sideBar";
import {motion} from "framer-motion"; // Para animaciones
import { ImageGrid, ImageGrid2, ImageGrid3, ImageGrid4 } from "./components/imageGrid";
import { ProductTypes } from "@/types/product";
import { useProductContext } from "./context/productContext";
import Image from "next/image";
import ProductContainer from "./components/ProductsCardsBard";


interface Grid {
    id: number;
    product: ProductTypes | null;
}

export default function HomePage() {
    const [showProducts, setShowProducts] = useState(false);
    const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<ProductTypes[]>([]);
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [loading, setLoading] = useState(true);
    const [grids, setGrids] = useState<Grid[]>([]);
    const { currentPage, setProductArray, productArray } = useProductContext();
    const [direction, setDirection] = useState(0); 
    const [category, setCategory] = useState<string | null>(null);
    const [moveMode, setMoveMode] = useState<{
        active: boolean;
        productId: string;
        sourceGridId: number;
    } | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        if (products.length === 0) {
            const fetchProducts = async () => {
                try {
                    const productsData = await getProductsRF();
                    setProducts(productsData.map(product => ({
                        ...product,
                        descriptions: product.descriptions || []
                    })));
                } catch (error) {
                    console.error("Error al obtener productos:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [products.length]);

    const handleProductSelect = (product: ProductTypes) => {
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



    const handleEditProduct = (productId: string) => {
        // Implementa la lógica para editar el producto
        
    };

    const handleChangeProduct = (productId: string) => {
        // Encontrar el producto y su grid actual
        const productToMove = selectedProducts.find(p => p.id === productId);
        if (productToMove && productToMove.gridId) {
            setProductArray(productToMove);
            console.log(productArray, "productArray");
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

    const handleGridSelect = (gridId: number, event: React.MouseEvent) => {
        if (!event) {
            console.error("El evento de ratón no se pasó correctamente.");
            return;
        }
        setMousePosition({ x: event.clientX, y: event.clientY });
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

    const handleCategorySelect = (category: string) => {
        setCategory(category);
    };

    return (
        <div className="flex flex-col" >
            <div>
                 <Sidebar onCategorySelect={handleCategorySelect} />
                 {category && <ProductContainer category={category} setCategory={setCategory} />}
            </div>
            <div className="grid grid-cols-2 items-center justify-center h-[80vh] ">
                <div className="flex flex-col justify-center w-full border-r-2 border-black items-center transform scale-90">
                    {/* @ts-ignore */}

                     <ImageGrid {...commonGridProps}/>

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

                                        <ImageGrid2 {...commonGridProps}/>


                                        <p className="text-black text-md">Pagina {currentPage} </p>
                                    </div>
                                )}
                                {currentPage === 3 && (
                                    <div className="flex flex-col justify-center items-center w-full border-r-2">
                                        {/* @ts-ignore */}

                                        <ImageGrid3 {...commonGridProps}/>

                                        <p className="text-black text-md">Pagina {currentPage} </p>
                                    </div>
                                )}
                                {currentPage === 4 && (
                                    <div className="flex flex-col justify-center items-center w-full border-r-2">
                                        {/* @ts-ignore */}

                                        <ImageGrid4 {...commonGridProps}/>

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
                {showProducts && mousePosition ? (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        exit={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        className="absolute"
                        style={{ top: mousePosition.y, left: mousePosition.x + 20 }}
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
        </div>
    );
};

interface GridProductProps {
    products: ProductTypes[];
    loading: boolean;
    onProductSelect: (product: ProductTypes) => void;
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
        <div className=" bg-[#f5f5f5] p-4 h-[45vh] w-[40vw] absolute top-0 left-0 rounded-lg shadow-lg hover:shadow-xl overflow-y-auto no-scrollbar">
            <div className="flex justify-between bg-white sticky top-0 z-10 ">
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
                <div className="flex flex-col h-fit overflow-y-auto space-y-4">
                    {filteredProducts.map((product) => (
                        <CardShow
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
