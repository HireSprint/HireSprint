"use client";
import { CardShowSide } from "./components/card";
import React, { useEffect, useMemo, useState } from "react";
import BottomBar from "./components/bottomBar";
import { AnimatePresence, motion } from "framer-motion"; // Para animaciones
import { ImageGrid, ImageGrid2, ImageGrid3, ImageGrid4 } from "./components/imageGrid";
import { useProductContext } from "./context/productContext";
import ProductContainer from "./components/ProductsCardsBard";
import ModalEditProduct from "@/app/components/ModalEditProduct";
import { ProductTypes } from "@/types/product";
import { useCategoryContext } from "./context/categoryContext";
import { categoriesInterface } from "@/types/category";
import { Message } from "primereact/message";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import { useAuth } from "./components/provider/authprovider";


export default function HomePage() {
    const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
    const { selectedProducts, setSelectedProducts, productsData, setProductsData, currentPage, productDragging, setIsLoadingProducts, isLoadingProducts } = useProductContext();
    const [direction, setDirection] = useState(0);
    const [category, setCategory] = useState<categoriesInterface | null>(null);
    const [showProductCardBrand, setShowProductCardBrand] = useState<boolean>(true);


    //states modal for grids with [id_circular] selected AlexSM
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productByApi, setProductByApi] = useState<[] | null>([])
    const [productSelected, setProductSelected] = useState<ProductTypes | undefined>(undefined)
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [gridCategory, setGridCategory] = useState<categoriesInterface | null>(null);
    const [updateCircular, setUpdateCircular] = useState();
    const { idCircular, user } = useAuth();
    const { categoriesData } = useCategoryContext();
    //
    const [showProducts, setShowProducts] = useState(false);
    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getProduct");
                const data = await resp.json();
                setProductsData(data.result);
                setIsLoadingProducts(false);
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

    useEffect(() => {
        const loadCircularProducts = async () => {
            if (!idCircular) {
                console.log("No hay circular seleccionado");
                return;
            }

            try {
                const response = await fetch(`https://hiresprintcanvas.dreamhosters.com/getCircularProducts/${idCircular}`);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log(data, "data");
                
                if (data.success) {
                    const loadedProducts = data.result.map((item: any) => ({
                        grid_id: item.grid_id,
                        upc: item.upc,
                    }));

                    setSelectedProducts(loadedProducts);
                } else {
                    throw new Error(data.message || "Error al cargar productos del circular");
                }
            } catch (error) {
                console.error("Error al cargar productos del circular:", error);
            }
        };

        loadCircularProducts();
    }, [idCircular, user]); // Se ejecuta cuando cambia el idCircular


    // Función para actualizar el servidor
const updateCircularInServer = async (products: ProductTypes[]) => {
    if (!idCircular || !products) {
        console.log("No hay circular o productos seleccionados");
        return;
    }

    try {
        const response = await fetch("https://hiresprintcanvas.dreamhosters.com/updateCircular", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_circular: idCircular,
                circular_products_upc: products.map(product => ({
                    grid_id: product.id_grid,
                    upc: product.upc
                }))
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            console.log("Circular actualizado en el servidor");
            // Opcional: actualizar estado local si es necesario
            setUpdateCircular(data.result);
        } else {
            throw new Error(data.message || "Error al actualizar circular");
        }
    } catch (error) {
        console.error("Error en updateCircular:", error);
    }
};



    const handleProductSelect = (product: ProductTypes) => {
        if (selectedGridId === null) return;

        const productWithGrid = { ...product, id_grid: selectedGridId };

        setSelectedProducts((prev) => {
            const newProducts = prev.filter((p) => p.id_grid !== selectedGridId);
            const updatedProducts = [...newProducts, productWithGrid];
            
            updateCircularInServer(updatedProducts);
            
            return updatedProducts;
        });

        setIsModalOpen(false)
        setShowProducts(false);
    };


    const handleRemoveProduct = (idGrid: number) => {
        setSelectedProducts((prevProducts) => {
            const updatedProducts = prevProducts.filter((product) => product.id_grid !== idGrid);
            
            updateCircularInServer(updatedProducts);
            
            return updatedProducts;
        });

        setIsModalOpen(false);
        setShowProducts(false);
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

        // id del grid que al que se quiere mover el producto
        const gridCellTarget = findGridCellTarget(stopDragEvent.target)
        const cellIdTarget = getCellId(gridCellTarget);

        if (cellIdTarget && cellIdToMove && (cellIdTarget != cellIdToMove)) {
            moveProduct(cellIdToMove, cellIdTarget);
            setShowProducts(false); // Ocultar el panel de productos si está visible
        }

    };

    const handleDragAndDropSidebar = (gridCellToMove: any, stopDragEvent: MouseEvent) => {
        const getCellId = (htmlElement:HTMLElement, prefix='grid-card-product-') => {
            const htmlElementId = htmlElement && htmlElement.id
            const cellId = htmlElementId && Number(htmlElementId.replace(prefix,''))
            return cellId
        }
        
        const findGridCellTarget = ( parentElement: any, count= 0 ) => {
            if ( !parentElement ) return;
            if ( parentElement.id && parentElement.id.includes('grid-card-product-') ) return parentElement
            
            if ( count <= 7 ) return findGridCellTarget( parentElement.parentNode, count += 1 )
            else return 
        }

        const productIdToSelect = getCellId(gridCellToMove.node, 'sidebar-card-product-')

        if (productIdToSelect) {
            const productSelected = productsData.find((prod) => prod.id_product === productIdToSelect)
            
            if (productSelected) {
                const gridCellTarget = findGridCellTarget(stopDragEvent.target);
                const cellIdTarget = getCellId(gridCellTarget);

                const productWithGrid = { ...productSelected, id_grid: cellIdTarget } as ProductTypes;

                if (cellIdTarget) {
                    setSelectedProducts((prev) => {
                        const newProducts = prev.filter((p) => p.id_grid !== cellIdTarget);
                        const updatedProducts = [...newProducts, productWithGrid];
                        
                        updateCircularInServer(updatedProducts);
                        
                        return updatedProducts;
                    });
                }
            }
        }
    };

    const moveProduct = (sourceGridId: number, targetGridId: number) => {
        setSelectedProducts((prev) => {
            const updatedProducts = prev.map(product => {
                if (product.id_grid === sourceGridId) {
                    return { ...product, id_grid: targetGridId };
                }
                if (product.id_grid === targetGridId) {
                    return { ...product, id_grid: sourceGridId };
                }
                return product;
            });

            updateCircularInServer(updatedProducts);

            return updatedProducts;
        });
    };

    const handleGridClick = (gridId: number, idCategory: number | undefined,  event: React.MouseEvent) => {
        if (!event) {
            console.error("El evento de ratón no se pasó correctamente.");
            return;
        }

        setMousePosition({ x: event.clientX, y: event.clientY });
        const gridHasProduct = selectedProducts.some(product => product.id_grid === gridId);

        if (gridHasProduct && productoShowForce) {
            const selectedProduct = selectedProducts.find(product => product.id_grid === gridId);
            setProductSelected(selectedProduct);
            setSelectedGridId(gridId);
            setIsModalOpen(true);
        } else {
            setSelectedGridId(gridId);
            const selectedCategory = categoriesData.find(cat => cat.id_category === idCategory);
            setGridCategory(selectedCategory || categoriesData[0]);
            setIsModalOpen(true);
            setShowProducts(true);
        }
    };

    const commonGridProps = {
        onGridCellClick: handleGridClick,
        onDragAndDropCell: handleDragAndDropGridCell,
        setShowProductCardBrand: setShowProductCardBrand
    };


    let productoShowForce: boolean = true;

    const handleChangeProductForOther = (gridId: number | undefined) => {
        if (gridId === undefined)
            return;
        productoShowForce = false;
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
        ClosetPanels();
    };

    const handleCategorySelect = (category: categoriesInterface) => {
        setCategory(category);
    };

    const ClosetPanels = () => {
        setShowProducts(false)
        setIsModalOpen(false)
    }
    const {scale, setScale} = useProductContext();
    const [zoomScale, setZoomScale] = useState(0.9);
    const {scaleSubPagines, setScaleSubPagines} = useProductContext();
    const [zoomScaleSubPagines, setZoomScaleSubPagines] = useState(0.9);

    useEffect(() => {
        // Cuando currentPage cambie, reiniciamos los valores
        setScale(0);
        setScaleSubPagines(0);
        setZoomScaleSubPagines(0.9);
    }, [currentPage]);

    return (

    <div className="grid grid-rows-[1fr_min-content] overflow-hidden" >
        <div
            className={`relative grid grid-cols-2 items-center justify-center overflow-auto ${productDragging ? 'overflow-x-hidden' : ''} `}>
            <AnimatePresence>
                {category && (
                    <motion.div
                        initial={{y: 1000}}
                        animate={{y: showProductCardBrand ? 0 : 1000, zIndex: 51}}
                        exit={{y: 1000}}
                        transition={{duration: 0.5}}
                        className="fixed left-[35.5%] top-[155px]"
                    >
                        <ProductContainer category={category} setCategory={setCategory}
                                          onProductSelect={handleProductSelect}
                                          onDragAndDropCell={handleDragAndDropSidebar}
                                          setShowProductCardBrand={setShowProductCardBrand}/>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={`flex flex-col   w-full h-full border-r-2 border-black items-center transform ${
                    productDragging && productDragging.page && productDragging.page > 1
                        ? "z-0"
                        : "z-50"
                }`}
                style={{position: "relative", overflow: "visible"}}
            >
                <TransformWrapper
                    initialScale={0.9}
                    minScale={0.9}
                    maxScale={3}
                    centerOnInit={true} // Cambiar a false para evitar centrar en la inicialización
                    wheel={{disabled: true}}
                    panning={{disabled: true}}
                    // alignmentAnimation={{sizeX: 0, sizeY: 0}}
                >
                    {({zoomIn, zoomOut, setTransform}) => (
                        <>
                            {/* Botones para modificar el zoom */}
                            <div
                                className="flex space-x-2 justify-center items-center p-4  rounded-lg  z-50">
                                <button
                                    onClick={() => {
                                        setScale(scale + 50);
                                        const newScale = zoomScale + 0.5;
                                        setZoomScale(newScale);
                                        setTransform(0, 0, newScale);
                                    }}
                                    className="w-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                    +
                                </button>
                                <button
                                    onClick={() => {
                                        if (scale > 0) {
                                            zoomOut();
                                            setScale(scale - 50);
                                            const newScale = zoomScale - 0.5;
                                            setZoomScale(newScale);
                                        }
                                    }}
                                    className="w-10  bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                    −
                                </button>
                            </div>

                            <TransformComponent
                                wrapperStyle={{
                                    overflow: scale > 0.9 ? "auto" : "visible",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <div>
                                    {/* @ts-ignore */}
                                    <ImageGrid {...commonGridProps} />
                                </div>
                            </TransformComponent>
                            <p className=" text-black text-md">Page 1</p>
                        </>
                    )}
                </TransformWrapper>

            </div>

            <motion.div
                key={currentPage}
                initial={{x: direction >= 0 ? -300 : 300, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                exit={{x: direction >= 0 ? 300 : -300, opacity: 0}}
                transition={{duration: 0.5}}
                className={`w-full relative ${productDragging ? '!z-0' : 'z-10'}`}
            >
                {currentPage === 2 && (
                    <div className={`flex flex-col justify-center items-center w-full border-r-2`}>
                        <TransformWrapper
                            initialScale={0.9}
                            minScale={0.9}
                            maxScale={3}
                            centerOnInit={true}
                            wheel={{disabled: true}}
                            panning={{disabled: true}}
                        >
                            {({zoomIn, zoomOut, setTransform}) => (
                                <>

                                    {/* Botones para modificar el zoom */}
                                    <div
                                        className="relative -top-12 flex space-x-2 justify-center items-center rounded-lg  z-50"
                                    >
                                        <button
                                            onClick={() => {
                                                setScaleSubPagines(scaleSubPagines + 50);
                                                const newScale = zoomScaleSubPagines + 0.5;
                                                setZoomScaleSubPagines(newScale);
                                                setTransform(0, 0, newScale);
                                            }}
                                            className="w-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            +
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (scaleSubPagines > 0) {
                                                    zoomOut();
                                                    setScaleSubPagines(scaleSubPagines - 50);
                                                    const newScale = zoomScaleSubPagines - 0.5;
                                                    setZoomScaleSubPagines(newScale);
                                                }
                                            }}
                                            className="w-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            −
                                        </button>
                                    </div>

                                    {/* Componente TransformComponent que envuelve el contenido */}
                                    <TransformComponent
                                        wrapperStyle={{
                                            overflow: scaleSubPagines > 0.9 ? "auto" : "visible",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <div >
                                            {/* @ts-ignore */}
                                            <ImageGrid2 {...commonGridProps} />
                                        </div>
                                    </TransformComponent>

                                    {/* Número de página */}
                                    <p className="text-black text-md ">Page {currentPage}</p>
                                </>
                            )}
                        </TransformWrapper>
                    </div>
                )}

                {currentPage === 3 && (
                    <div className="flex flex-col justify-center items-center w-full border-r-2">
                        <TransformWrapper
                            initialScale={0.9}
                            minScale={0.9}
                            maxScale={3}
                            centerOnInit={true}
                            wheel={{disabled: true}}
                            panning={{disabled: true}}
                        >
                            {({zoomIn, zoomOut, setTransform}) => (
                                <>
                                    {/* Botones para modificar el zoom */}
                                    <div
                                        className="relative -top-12 flex space-x-2 justify-center items-center rounded-lg  z-50"
                                    >
                                        <button
                                            onClick={() => {
                                                setScaleSubPagines(scaleSubPagines + 50);
                                                const newScale = zoomScaleSubPagines + 0.5;
                                                setZoomScaleSubPagines(newScale);
                                                setTransform(0, 0, newScale);
                                            }}
                                            className="w-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            +
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (scaleSubPagines > 0) {
                                                    zoomOut();
                                                    setScaleSubPagines(scaleSubPagines - 50);
                                                    const newScale = zoomScaleSubPagines - 0.5;
                                                    setZoomScaleSubPagines(newScale);
                                                }
                                            }}
                                            className="w-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            −
                                        </button>
                                    </div>

                                    {/* Componente TransformComponent que envuelve el contenido */}
                                    <TransformComponent
                                        wrapperStyle={{
                                            overflow: scaleSubPagines > 0 ? "auto" : "visible",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <div className="w-full h-full">
                                            {/* @ts-ignore */}
                                            <ImageGrid3 {...commonGridProps} />
                                        </div>
                                    </TransformComponent>

                                    {/* Número de página */}
                                    <p className="text-black text-md mt-4">Página {currentPage}</p>
                                </>
                            )}
                        </TransformWrapper>
                    </div>
                )}

                {currentPage === 4 && (
                    <div className="flex flex-col justify-center items-center w-full border-r-2">
                        <TransformWrapper
                            initialScale={0.9}
                            minScale={0.9}
                            maxScale={3}
                            centerOnInit={true}
                            wheel={{disabled: true}}
                            panning={{disabled: true}}
                        >
                            {({zoomIn, zoomOut, setTransform}) => (
                                <>
                                    {/* Botones para modificar el zoom */}
                                    <div
                                        className="relative -top-12 flex space-x-2 justify-center items-center rounded-lg  z-50"
                                    >
                                        <button
                                            onClick={() => {
                                                setScaleSubPagines(scaleSubPagines + 50);
                                                const newScale = zoomScaleSubPagines + 0.5;
                                                setZoomScaleSubPagines(newScale);
                                                setTransform(0, 0, newScale);
                                            }}
                                            className="w-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            +
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (scaleSubPagines > 0) {
                                                    zoomOut();
                                                    setScaleSubPagines(scaleSubPagines - 50);
                                                    const newScale = zoomScaleSubPagines - 0.5;
                                                    setZoomScaleSubPagines(newScale);
                                                }
                                            }}
                                            className="w-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            −
                                        </button>
                                    </div>

                                    {/* Componente TransformComponent que envuelve el contenido */}
                                    <TransformComponent
                                        wrapperStyle={{
                                            overflow: scaleSubPagines > 0 ? "auto" : "visible",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <div className="w-full h-full">
                                            {/* @ts-ignore */}
                                            <ImageGrid4 {...commonGridProps} />
                                        </div>
                                    </TransformComponent>

                                    {/* Número de página */}
                                    <p className="text-black text-md mt-4">Página {currentPage}</p>
                                </>
                            )}
                        </TransformWrapper>
                    </div>
                )}

            </motion.div>
        </div>
        <section className="z-[52]">
            <BottomBar onCategorySelect={handleCategorySelect} categorySelected={category}/>
        </section>

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
            <AnimatePresence>
                {showProducts && mousePosition && (
                    <motion.div


                        initial={{opacity: 0, y: 20}}
                        exit={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        className="absolute z-[100] "
                        style={{
                            top: Math.min(mousePosition.y + 80, window.innerHeight - 400),
                            left: Math.min(mousePosition.x, window.innerWidth - 900),
                        }}

                    >
                        <GridProduct
                            onProductSelect={handleProductSelect}
                            onHideProducts={ClosetPanels}
                            initialCategory={gridCategory}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
    );
}

interface GridProductProps {
    onProductSelect: (product: ProductTypes) => void;
    onHideProducts?: () => void;
    initialCategory: categoriesInterface | null;
}

const GridProduct: React.FC<GridProductProps> = ({onProductSelect, onHideProducts, initialCategory}) => {
    const {productsData} = useProductContext();
    const [searchTerm, setSearchTerm] = useState("");
    const {categoriesData} = useCategoryContext();
    const [category, setCategory] = useState<categoriesInterface>(initialCategory || categoriesData[0]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");


    useEffect(() => {
        setLoading(true)
        setTimeout(() => setLoading(false), 500);
    }, [initialCategory]);

    useEffect(() => {
        if (initialCategory) setCategory(initialCategory);
    }, [initialCategory]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);


    const filteredProducts = useMemo(() => {
        return productsData?.filter((product) => {
            if (debouncedSearchTerm) {
                const searchLower = debouncedSearchTerm.toLowerCase();
                return (
                    product.desc?.toLowerCase().includes(searchLower) ||
                    product.master_brand?.toLowerCase().includes(searchLower) ||
                    product.brand?.toLowerCase().includes(searchLower) ||
                    product.name?.toLowerCase().includes(searchLower) ||
                    product.upc?.toString().includes(debouncedSearchTerm) ||
                    product.variety?.includes(debouncedSearchTerm)
                );
            }
            return product.id_category === category?.id_category;
        });
    }, [debouncedSearchTerm, productsData, category?.id_category]);

    return (
        <div className="relative bg-[#f5f5f5] p-4 h-[40vh] w-[45vw]  rounded-lg shadow-xl overflow-visible">
            <button className="absolute -top-2 -right-2 bg-black rounded-full w-8 h-8 text-white hover:bg-gray-800 z-50"
                    onClick={onHideProducts}>
            X
            </button>
            <div className="grid grid-rows-[min-content_1fr] h-full">
                <div className="flex bg-white items-center justify-between relative rounded-md px-2">
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
                <div className="overflow-y-auto no-scrollbar h-full">
                    
                        {
                            filteredProducts.length === 0 ? 
                            (
                                <div className='py-3'>
                                    <Message
                                        style={{ borderLeft: "6px solid #b91c1c", color: "#b91c1c" }}
                                        className="w-full"
                                        severity="error"
                                        text={searchTerm ? "Products not found" : "There are no products of this category"}
                                        />
                                </div>
                            ) 
                            : 
                            <div className="grid grid-cols-4 pt-2 gap-2">
                                {
                                    ( loading ? Array.from({length: 8}).fill({} as ProductTypes) : filteredProducts ).map((product: any, index) => (
                                        <CardShowSide key={product?.id_product || index} product={product} onProductSelect={onProductSelect} isLoading={loading}/>
                                    ))
                                }
                            </div>
                        }
                </div>
            </div>
        </div>
    );
}

