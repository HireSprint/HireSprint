"use client"
import {CardShow} from "./components/card";
import {useEffect, useState} from "react";
import Lottie from "lottie-react";
import LoadingLottie from "./components/lottie/loading-Lottie.json";
import Sidebar from "./components/sideBar";
import {motion} from "framer-motion"; // Para animaciones
import { ImageGrid, ImageGrid2, ImageGrid3, ImageGrid4 } from "./components/imageGrid";
import { useProductContext } from "./context/productContext";
import ProductContainer from "./components/ProductsCardsBard";
import ModalEditProduct from "@/app/components/ModalEditProduct";
import { ProductTypes } from "@/types/product";
import { CategoryProvider } from "./context/categoryContext";


export default function HomePage() {
    const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
    const {selectedProducts, setSelectedProducts, productsData, setProductsData} = useProductContext();
    const [loading, setLoading] = useState(true);
    const { currentPage } = useProductContext();
    const [direction, setDirection] = useState(0);
    const [category, setCategory] = useState<string | null>(null);
    const [copiedProduct, setCopiedProduct] = useState<ProductTypes | null>(null);
    const [moveMode, setMoveMode] = useState<{ active: boolean; sourceCellId: number; } | null>(null);

    //states modal for grids with products selected AlexSM
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productByApi, setProductByApi] = useState<[] | null>([])
    const [productSelected, setProductSelected] = useState<ProductTypes |undefined >( undefined)
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getProduct");
                const data = await resp.json();
                setProductsData(data.result);
                setLoading(false);
                if(resp.status === 200){
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
    };


    const handleRemoveProduct = (idGrid: number) => {
        setSelectedProducts((prevProducts) => {
            const updatedProducts = prevProducts.filter((product) => product.id_grid !== idGrid);
            return updatedProducts;
        });
        
        setIsModalOpen(false);
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
        }
    };


    const handleProductMove = (targetCellId: number) => {
        if (!moveMode) return;

        setSelectedProducts(prevProducts => {
            return prevProducts.map(product => {
                if (product.id_grid=== moveMode.sourceCellId) {
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
        } else if (gridHasProduct) {
            // Si el grid tiene un producto, mostrar el modal de edición
            const selectedProduct = selectedProducts.find(product => product.id_grid === gridId);
            setProductSelected(selectedProduct);
            setSelectedGridId(gridId);
            setIsModalOpen(true)
        } else {
            // Si el grid está vacío, mostrar el selector de productos
            setSelectedGridId(gridId);
            setIsModalOpen(true);
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

    const handleCategorySelect = (category: string) => {
        setCategory(category);
    };

    return (
        <CategoryProvider>
            <div className="flex flex-col" >
                <div>
                    <Sidebar onCategorySelect={handleCategorySelect} categorySelected={category} />
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
        {isModalOpen && mousePosition && (
            selectedProducts.some(product => product.id_grid === selectedGridId) ? (
                <ModalEditProduct 
                    setIsOpen={setIsModalOpen} 
                    product={productSelected as ProductTypes} 
                    GridID={selectedGridId || 0} 
                    SaveFC={()=>(console.log("save"))} 
                    ChangeFC={()=> {
                        setIsModalOpen(false);
                    }}
                    DeleteFC={()=>handleRemoveProduct(selectedGridId || 0)}
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
                        onHideProducts={() => setIsModalOpen(false)}
                    />
                </motion.div>
            )
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
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    const filteredProducts = productsData?.filter((product) =>
        product.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.master_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.upc?.toString().includes(searchTerm) || 
        product.variety?.includes(searchTerm)
    );

    return (
        <div className="bg-[#f5f5f5] p-4 h-[45vh] w-[30vw] absolute top-0 left-0 rounded-lg shadow-lg hover:shadow-xl overflow-y-auto no-scrollbar">
            <div className="flex justify-between bg-white sticky top-0 z-10 sm:grid sm:grid-cols-2">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" p-2 border rounded text-black m-4 sm:text-sm"
                />
                <button
                    onClick={onHideProducts}
                    className="bg-red-500 text-white p-2 rounded m-4 sm:text-sm"
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
                            key={product.id_product}
                            product={product}
                            onProductSelect={onProductSelect}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-black text-md">No Products Found</p>
            )}

        </div>
    );
};