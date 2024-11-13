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
import { getCategory } from "./api/category/categories";
import ModalEditProduct from "@/app/components/ModalEditProduct";
import { ProductTypes } from "@/types/product";
import { categoriesInterface } from "@/types/category";
import { CategoryProvider } from "./context/categoryContext";


export default function HomePage() {
    const [showProducts, setShowProducts] = useState(false);
    const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
    const {selectedProducts, setSelectedProducts } = useProductContext();
    const [productsData, setProductsData] = useState<ProductTypes[]>([]);
    const [loading, setLoading] = useState(true);
    const [grids, setGrids] = useState<{id:number, product: ProductTypes | null}[]>([]);
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
    const [productSelected, setProductSelected] = useState<ProductTypes |undefined >( undefined)
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [categoriesList, setCategories] = useState<categoriesInterface[]>([]);



    
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

    const handleDragAndDropGridCell = (gridCellToMove: any, stopDragEvent: MouseEvent) => {
        const getCellId = (htmlElement:HTMLElement) => {
            const htmlElementId = htmlElement && htmlElement.id
            const cellId = htmlElementId && Number(htmlElementId.replace('grid-card-product-',''))
            return cellId
        }
        
        const findGridCellTarget = ( parentElement: any, count= 0 ) => {
            if ( !parentElement ) return;
            if ( parentElement.id && parentElement.id.includes('grid-card-product-') ) return parentElement
            
            if ( count <= 7 ) return findGridCellTarget( parentElement.parentNode, count += 1 )
                else return 
            
        }
        // id del grid que se quiere mover su contenido
        const cellIdToMove = getCellId(gridCellToMove.node)
        if (gridCellToMove.node) (gridCellToMove.node as any).style.pointerEvents = 'auto';
        
        // id del grid que al que se quiere mover el producto
        const gridCellTarget = findGridCellTarget(stopDragEvent.target)
        if (gridCellTarget) (gridCellTarget as any).style.pointerEvents = 'auto';
        const cellIdTarget = getCellId(gridCellTarget)
        
        if (cellIdTarget && cellIdToMove) {
            moveProduct(cellIdToMove, cellIdTarget)
            setShowProducts(false); // Ocultar el panel de productos si está visible
        }

    };


    const handleProductMove = (targetGridId: number) => {
        if (!moveMode) return;

        moveProduct(moveMode.sourceGridId, targetGridId)

        // Resetear el modo de movimiento
        setMoveMode(null);

        console.log({
            title: "Producto movido",
            description: "El producto ha sido movido exitosamente",
            status: "success",
            duration: 2000,
        });
    };

    const moveProduct = (sourceGridId: number, targetGridId: number) => {
        
        
        setSelectedProducts(prevProducts => {
            return prevProducts.map(product => {
                if (product.id_product === sourceGridId) {
                    // Actualizar el gridId del producto que se está moviendo
                    return { ...product, id_product: targetGridId };
                }
                
                if ( product.id_product === targetGridId) {
                    // Si hay un producto en el grid destino, moverlo al grid origen
                    return { ...product, id_product: sourceGridId };
                }
                return product;
            });
        });
    }

    const handleGridSelect = (gridId: number, categoryGridSelected:categoriesInterface, event: React.MouseEvent) => {
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
        categoriesList: categoriesList,
        products: productsData,
        isCellOccupied: selectedProducts.some(product => product.id_product === selectedGridId),
        onCopyProduct: handleCopyProduct,
        copiedProduct: copiedProduct,
        onPasteProduct: handlePasteProduct,
        onDragAndDropCell: handleDragAndDropGridCell

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
        {showProducts && mousePosition && (
            selectedProducts.some(product => product.id_product === selectedGridId) ? (
                <ModalEditProduct 
                    isOpen={isModalOpen} 
                    setIsOpen={setIsModalOpen} 
                    product={productSelected as ProductTypes} 
                    GridID={selectedGridId || 0} 
                    SaveFC={()=>(console.log("save"))} 
                    ChangeFC={()=>(console.log("change"))} 
                    DeleteFC={()=>(console.log("Delete"))}
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
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = productsData?.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
        
    );

    return (
        <div className=" bg-[#f5f5f5] p-4 h-[45vh] w-[30vw] absolute top-0 left-0 rounded-lg shadow-lg hover:shadow-xl overflow-y-auto no-scrollbar">
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
                            product={product}
                            key={product.id_product}
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
