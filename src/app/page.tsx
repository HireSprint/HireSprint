"use client";
import { CardShowSide } from "./components/card";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomBar from "./components/bottomBar";
import { AnimatePresence, motion } from "framer-motion";
import { ImageGrid, ImageGrid2, ImageGrid3, ImageGrid4 } from "./components/imageGrid";
import { useProductContext } from "./context/productContext";
import ProductContainer from "./components/ProductsCardsBard";
import ModalEditProduct from "@/app/components/ModalEditProduct";
import { Cursor3, FocusIn, GrapIconOpen, ResetPageZoom, ZoomInIcon, ZoomOutIcon } from "@/app/components/icons";
import { ReactZoomPanPinchContentRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import { useAuth } from "./components/provider/authprovider";
import { Message } from "primereact/message";
import { categoriesInterface } from "@/types/category";
import { useCategoryContext } from "./context/categoryContext";
import { ProductTypes } from "@/types/product";

export default function HomePage() {
    const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
    const {
        selectedProducts,
        setSelectedProducts,
        productsData,
        currentPage,
        productDragging,
        productReadyDrag,
        setGroupedProducts,
        setProductsData,
        zoomScalePage1,
        setZoomScalePage1,
        zoomScaleSubPagines,
        setZoomScaleSubPagines,
        panningOnPage1,
        setPanningOnPage1,
        panningOnSubPage,
        setPanningOnSubPage,
        panelShowCategoriesOpen,
        groupedProducts
    } = useProductContext();
    const [direction, setDirection] = useState(0);
    const [category, setCategory] = useState<categoriesInterface | null>(null);
    const [showProductCardBrand, setShowProductCardBrand] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productSelected, setProductSelected] = useState<ProductTypes | undefined>(undefined)
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [gridCategory, setGridCategory] = useState<categoriesInterface | null>(null);
    const [updateCircular, setUpdateCircular] = useState();
    const { idCircular } = useAuth();
    const { categoriesData, selectedProductCategory } = useCategoryContext();

    //
    const [showProducts, setShowProducts] = useState(false);
    //var zoom

    const [resetScale, setResetScale] = useState(false);
    const [maxScale, setMaxScale] = useState(3);
    const [minScale, setMinScale] = useState(0.75);
    const [firsTimeOpen, setFistTimeOpen] = useState(true);
    const divRef = useRef<HTMLDivElement | null>(null);
    const [initialX, setInitialX] = useState(0);
    const containerRefPage1 = useRef<ReactZoomPanPinchContentRef>(null);
    const containerRefPage2 = useRef<ReactZoomPanPinchContentRef>(null);
    const [firstDrag, setFirstDrag] = useState(false);
    const [useZoomPage1, setUseZoomPage1] = useState(false);
    const [useZoomSubPages, setUseZoomSubPages] = useState(false);
    const [dynamicHeightpage1, setDynamicHeightpage1] = useState("47%");
    const [dynamicHeightSubpages, setDynamicHeightSubpages] = useState("47%");
    const [dynamicFullSize, setDynamicFullSize] = useState(0.5);
    const productSelectionRef = useRef<HTMLDivElement | null>(null);
    const [gridProductDimensions, setGridProductDimensions] = useState({ width: 0, height: 0 });
    const [productSelectionPosition, setProductSelectionPosition] = useState<{ top: number; left: number; }>({
        top: 0,
        left: 0
    });
    const [fullPage1, setFullPage1] = useState<boolean>(false);
    const [fullPage2, setFullPage2] = useState<boolean>(false);
    const divRef1 = useRef<HTMLDivElement | null>(null);
    const divRef2 = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Inicializar la posición
        const gridProductWidth = gridProductDimensions.width ?? 0
        const gridProductHeight = gridProductDimensions.height ?? 0

        setProductSelectionPosition({
            top: gridProductHeight + (mousePosition.y + 25) > window.innerHeight ? ((window.innerHeight - gridProductHeight) - 15) : mousePosition.y + 25,
            left: gridProductWidth + (mousePosition.x + 25) > window.innerWidth ? ((window.innerWidth - gridProductWidth) - 15) : (mousePosition.x + 25),
        });

        const handleResize = () => {
            if (window.innerWidth < 800) {
                setProductSelectionPosition((prev) => ({
                    ...prev,
                    left: (window.innerWidth / 2) - (gridProductWidth / 2),
                }));
            } else {
                setProductSelectionPosition((prev) => ({
                    ...prev,
                    left: gridProductWidth + ((mousePosition.x + 25) - 2) > window.innerWidth ? ((window.innerWidth - gridProductWidth) - 15) : ((mousePosition.x + 25) - 2),
                }));
            }
        };

        handleResize()

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [mousePosition, gridProductDimensions]);


    const updateGrideProductDimensions = () => {
        if (productSelectionRef.current) {
            setGridProductDimensions({
                width: productSelectionRef.current.clientWidth,
                height: productSelectionRef.current.clientHeight,
            });
        }
    };

    useEffect(() => {
        if (showProducts && productSelectionRef.current) {
            const resizeObserver = new ResizeObserver(updateGrideProductDimensions);
            if (productSelectionRef.current) resizeObserver.observe(productSelectionRef.current);

            // Llamar a la función para establecer las dimensiones iniciales
            updateGrideProductDimensions();

            return () => {
                if (productSelectionRef.current) {
                    resizeObserver.unobserve(productSelectionRef.current);
                }
            };
        }
    }, [showProducts])

    // Función para actualizar el servidor
    const updateCircularInServer = async (products: ProductTypes[]) => {
        if (!idCircular || !products) {
            return;
        }

        try {
            console.log('Enviando productos al servidor:', products);

            const requestBody = {
                id_circular: idCircular,
                circular_products_upc: products.map(product => ({
                    grid_id: product.id_grid,
                    upc: product.upc,
                    price: product.price || "0",
                    notes: product.notes || "",
                    burst: product.burst || 0,
                    addl: product.addl || "",
                    limit: product.limit || "",
                    must_buy: product.must_buy || "",
                    with_card: product.with_card || false,
                    limit_type: product.limit_type || "",
                    per: product.per || "",
                    variety_set: product.variety || [],
                    size: product.size || ""
                }))
            };
    
            console.log('Request body:', requestBody);

            const response = await fetch("https://hiresprintcanvas.dreamhosters.com/updateCircular", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            console.log(response.status, "response")
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            console.log(data.result, "data")
            if (data.success) {

                const updatedProducts = data.result.circular_products_upc.map((serverProduct: any) => ({
                    ...serverProduct,
                    id_grid: serverProduct.grid_id,
                    variety: serverProduct.variety_set || []
                }));

                setUpdateCircular(updatedProducts);
                setSelectedProducts(updatedProducts)
                setProductsData(updatedProducts)
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
        //@ts-ignore
        setProductsData((prev) => {
            const newProducts = prev.filter((p: ProductTypes) => p.id_grid !== selectedGridId);
            const updatedProducts = [...newProducts, productWithGrid];
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

        const getCellId = (htmlElement: HTMLElement) => {
            const htmlElementId = htmlElement && htmlElement.id
            const cellId = htmlElementId && Number(htmlElementId.replace('grid-card-product-', ''))
            return cellId
        }

        const findGridCellTarget = (parentElement: any, count = 0) => {
            if (!parentElement) return;
            if (parentElement.id && parentElement.id.includes('grid-card-product-')) return parentElement

            if (count <= 7) return findGridCellTarget(parentElement.parentNode, count += 1)
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
        const getCellId = (htmlElement: HTMLElement, prefix = 'grid-card-product-') => {
            const htmlElementId = htmlElement && htmlElement.id
            const cellId = htmlElementId && Number(htmlElementId.replace(prefix, ''))
            return cellId

        }

        const findGridCellTarget = (parentElement: any, count = 0) => {
            if (!parentElement) return;
            if (parentElement.id && parentElement.id.includes('grid-card-product-')) return parentElement

            if (count <= 7) return findGridCellTarget(parentElement.parentNode, count += 1)
            else return
        }

        const productIdToSelect = getCellId(gridCellToMove.node, 'sidebar-card-product-')


        if (productIdToSelect) {
            const productSelected = selectedProductCategory?.find((prod: ProductTypes) => {
                return prod.id_product === productIdToSelect ||
                    prod.id_grid === productIdToSelect ||
                    prod.upc === String(productIdToSelect)
            });


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
                    //@ts-ignore
                    setProductsData((prev) => {
                        const newProducts = prev.filter((p: ProductTypes) => p.id_grid !== cellIdTarget);
                        const updatedProducts = [...newProducts, productWithGrid];
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
            //@ts-ignore
            setGroupedProducts(prevGrouped => {
                const newGrouped = { ...prevGrouped };

                const newSourceProducts = updatedProducts.filter(p => p.id_grid === sourceGridId);
                const newTargetProducts = updatedProducts.filter(p => p.id_grid === targetGridId);

                if (newSourceProducts.length > 1) {
                    newGrouped[sourceGridId.toString()] = newSourceProducts;
                } else {
                    delete newGrouped[sourceGridId.toString()];
                }

                if (newTargetProducts.length > 1) {
                    newGrouped[targetGridId.toString()] = newTargetProducts;
                } else {
                    delete newGrouped[targetGridId.toString()];
                }

                return newGrouped;
            });

            updateCircularInServer(updatedProducts);
            return updatedProducts;
        });
    };

    const handleGridClick = (gridId: number, idCategory: number | undefined, event: React.MouseEvent) => {
        if (!event) {
            console.error("El evento de ratón no se pasó correctamente.");
            return;
        }

        setMousePosition({ x: event.clientX, y: event.clientY });
        const gridHasProduct = selectedProducts.some(product => product.id_grid === gridId);

        if (category) {
            setCategory(null);
        }

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

    const handleSaveChangeProduct = (
        idGrid: number | undefined,

        priceValue: string,

        noteUser: string,
        burst: number,
        addl: string,
        limit: string,
        mustBuy: string,
        withCard: boolean,
        limit_type: string,
        per: string,
        variety: string[],
        size: string[]
    ) => {
        if (idGrid === undefined) return;

    
        setSelectedProducts((prevProducts: ProductTypes[]) => {
            console.log(prevProducts, "prevProducts")
            const updatedProducts = prevProducts.map(product => {
                if (product.id_grid === idGrid) {
                    const updatedProducts = {
                        ...product,
                        price: priceValue,
                        notes: noteUser,
                        burst: burst,
                        addl: addl,
                        limit: limit,
                        must_buy: mustBuy,
                        with_card: withCard,
                        limit_type: limit_type,
                        per: per,
                        variety_set: variety,
                        size: size
                    };
                    if (groupedProducts[idGrid] && product === groupedProducts[idGrid][0]) {
                        return {
                            ...updatedProducts,

                            variety: variety,
                            size: size
                        }
                    }

                    //@ts-ignore
                    setProductsData(prevData => 
                        prevData.map((p: ProductTypes) => 
                            p.id_grid === idGrid ? updatedProducts : p
                        )
                    );
    
                    return updatedProducts;
                }
                return product;
            });
    

            updateCircularInServer(updatedProducts);
            return updatedProducts;
        });
    
        ClosetPanels();
    };

    const handleCategorySelect = (category: categoriesInterface) => {
        if (isModalOpen || showProducts) {
            setShowProducts(false);
            setIsModalOpen(false);
        }
        setCategory(category);
    };

    const ClosetPanels = () => {
        setShowProducts(false)
        setIsModalOpen(false)
    }


    const handleButtonClickPage1 = () => {
        if (containerRefPage1 && containerRefPage1.current && panningOnPage1) {
            const wrapperElement = containerRefPage1.current.instance.wrapperComponent;
            if (wrapperElement && wrapperElement.scrollTop) {
                wrapperElement.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        }
        setPanningOnPage1(!panningOnPage1);
        setFistTimeOpen(false)
    }
    const handleButtonClickPage2 = () => {
        setPanningOnSubPage(!panningOnSubPage);
        setFistTimeOpen(false)
    }

    const handleResetPage1 = () => {
        if (containerRefPage1 && containerRefPage1.current) {
            containerRefPage1.current.resetTransform()
            setPanningOnPage1(true);
            setZoomScalePage1(1);
            setFullPage1(false);
        }

    }
    const handleZoomInPage1 = () => {
        if (containerRefPage1 && containerRefPage1.current) {
            if (zoomScalePage1 < maxScale) {
                setFistTimeOpen(false);
                const newScale = zoomScalePage1 + 0.25;
                setZoomScalePage1(newScale);
                containerRefPage1.current.setTransform(0, 0, newScale);

                setFullPage1(false);

            }
            if (zoomScalePage1 <= minScale) {
                containerRefPage1.current.resetTransform();
                setZoomScalePage1(1);
                setFullPage1(false);

            }
        }
    };
    const handleZoomOutPage1 = () => {
        if (containerRefPage1 && containerRefPage1.current) {
            if (zoomScalePage1 > minScale) {
                const newScale = zoomScalePage1 - 0.25;
                setZoomScalePage1(newScale);
                setFistTimeOpen(false)
                containerRefPage1.current.zoomOut(0.25);
                setFullPage1(false);
            }

        }
    }
    const handleFullPage1 = () => {
        if (containerRefPage1 && containerRefPage1.current) {
            if (zoomScalePage1 > minScale) {
                setFullPage1(true);
                setZoomScalePage1(minScale)
                setFistTimeOpen(false)

                const wrapperElement = containerRefPage1.current.instance.wrapperComponent;
                if (wrapperElement) {
                    wrapperElement.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                    });
                }
                containerRefPage1.current.centerView(dynamicFullSize, 2, "easeOut");
            } else if (zoomScalePage1 <= minScale) {
                setZoomScalePage1(1)
                setFullPage1(false);
                containerRefPage1.current.resetTransform();
            }
        }
    }
    const handleResetSubPage = () => {
        if (containerRefPage2 && containerRefPage2.current) {
            containerRefPage2.current.resetTransform()
            setPanningOnSubPage(true);
            setZoomScaleSubPagines(1);
            setFullPage2(false);
        }

    }

    const handleZoomInSubPages = () => {
        if (containerRefPage2 && containerRefPage2.current) {
            setFullPage2(false);
            if (zoomScaleSubPagines < maxScale) {
                const newScale = zoomScaleSubPagines + 0.25;
                setZoomScaleSubPagines(newScale);
                setFistTimeOpen(false)
                containerRefPage2.current.setTransform(0, 0, newScale);
            }
            if (zoomScaleSubPagines <= minScale) {
                containerRefPage2.current.resetTransform();
                setZoomScaleSubPagines(1);
            }
        }
    }
    const handleZoomOutSubPages = () => {
        if (containerRefPage2 && containerRefPage2.current) {
            setFullPage2(false);
            if (zoomScaleSubPagines > minScale) {
                const newScale = zoomScaleSubPagines - 0.25;
                setZoomScaleSubPagines(newScale);
                setFistTimeOpen(false)
                containerRefPage2.current.zoomOut(0.25);
            }
        }
    }
    const handleFullPage2 = () => {
        if (containerRefPage2 && containerRefPage2.current) {
            if (zoomScaleSubPagines > minScale) {
                setFullPage2(true);
                setZoomScaleSubPagines(minScale)
                setFistTimeOpen(false)
                const wrapperElement = containerRefPage2.current.instance.wrapperComponent;
                if (wrapperElement) {
                    wrapperElement.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",

                    });
                }
                containerRefPage2.current.centerView(dynamicFullSize, 2, "easeOut");
            } else if (zoomScaleSubPagines <= minScale) {
                setFullPage2(false);
                setZoomScaleSubPagines(1)
                containerRefPage2.current.resetTransform();
            }
        }
    }
    useEffect(() => {
        if (divRef.current) {
            const width2 = divRef.current.offsetWidth;
            const width = window.innerWidth;
            const height = window.innerHeight;
            setInitialX(width2 / 2);
            if (height <= 720) {
                setDynamicFullSize(0.27); // Valor específico para menor que hd
            }
            else if (height <= 900 && height > 720) {
                setDynamicFullSize(0.35); // Valor específico para HD
            } else if (height > 900) {
                setDynamicFullSize(0.45); // Valor específico para Full HD
            }
            setMinScale(dynamicFullSize);
        }

    }, [zoomScaleSubPagines, productsData]);

    useEffect(() => {
        // reposicionamiento de las paginas 
        if (productReadyDrag === null && firstDrag) {
            if (containerRefPage2 && containerRefPage2.current && useZoomPage1) {
                containerRefPage2.current.resetTransform(zoomScaleSubPagines)
                setUseZoomPage1(false);
                setUseZoomSubPages(false);
            }
            if (containerRefPage1 && containerRefPage1.current && useZoomSubPages) {
                containerRefPage1.current.resetTransform(zoomScalePage1)
                setUseZoomPage1(false);
                setUseZoomSubPages(false);
            }
            setDynamicHeightpage1("85vh")
            setDynamicHeightSubpages("85vh")
        }
        // reducion de la pagina 2
        if (productReadyDrag?.page === 1) {

            if (containerRefPage2 && containerRefPage2.current && productDragging) {
                containerRefPage2.current.setTransform(initialX / 1.5, 0, dynamicFullSize)
                setFirstDrag(true)
                setFistTimeOpen(false)
                setUseZoomPage1(true);
                setUseZoomSubPages(false);
                setDynamicHeightSubpages("100%")
            }
        }
        // reducion de la pagina  1,
        if ((productReadyDrag?.page === 2 || productReadyDrag?.page === 3 || productReadyDrag?.page === 4) && productDragging) {

            if (containerRefPage1 && containerRefPage1.current) {
                containerRefPage1.current.setTransform(initialX / 1.5, 0, dynamicFullSize)
                setFirstDrag(true)
                setFistTimeOpen(false)
                setUseZoomPage1(false);
                setUseZoomSubPages(true);
                setDynamicHeightpage1("100%")
            }
        }

        if (!panelShowCategoriesOpen && productReadyDrag?.page === undefined && productReadyDrag !== null) {
            if (containerRefPage2 && containerRefPage2.current) {
                containerRefPage2.current.setTransform(initialX / 1.5, 0, dynamicFullSize)
            }
            if (containerRefPage1 && containerRefPage1.current) {
                containerRefPage1.current.setTransform(initialX / 1.5, 0, dynamicFullSize)
            }
            setFirstDrag(true)
            setFistTimeOpen(false)
            setUseZoomPage1(true);
            setUseZoomSubPages(true);
            setDynamicHeightSubpages("100%")
        }

    }
        , [productReadyDrag, productDragging, panelShowCategoriesOpen]);

    useEffect(() => { // Cuando currentPage cambie, reiniciamos los valores
        setDynamicHeightpage1("85dvh")
        setDynamicHeightSubpages("85dvh")
        setZoomScaleSubPagines(1);
        setResetScale(true);
        setShowProducts(false);
        setIsModalOpen(false);
    }, [currentPage]);


    const [isClearAllPopupOpen, setIsClearAllPopupOpen] = useState(false);
    const [gridIdToClear, setGridIdToClear] = useState<number | null>(null);
    const handleClearAllConfirmation = (gridId: number | null) => {

        setGridIdToClear(gridId);
        setIsClearAllPopupOpen(true);
    };

    const confirmClearAll = () => {
        if (gridIdToClear) {
            setSelectedProducts((prevProducts) => {
                const updatedProducts = prevProducts.filter((product) => {
                    const gridId = Number(product.id_grid);
                    if (gridIdToClear === 1) {
                        return gridId < 1001 || gridId > 1999;
                    } else if (gridIdToClear === 2) {
                        return gridId < 2001 || gridId > 2999;
                    } else if (gridIdToClear === 3) {
                        return gridId < 3001 || gridId > 3999;
                    } else if (gridIdToClear === 4) {
                        return gridId < 4001 || gridId > 4999;
                    }
                    return true;
                });
                updateCircularInServer(updatedProducts);
                return updatedProducts;
            });
            toast.success("Products cleared successfully");
        } else {
            toast.error("Didn't select a number");
        }
        setIsClearAllPopupOpen(false);
        setGridIdToClear(null);
    };
    const cancelClearAll = () => {

        setIsClearAllPopupOpen(false);
    };



    return (

        <div
            className={`grid bg-gray-100 grid-rows-[1fr_min-content] max-h-screen overflow-hidden `}>
            <div
                className={`relative grid grid-cols-2 items-center  ${productDragging ? 'overflow-x-visible' : ''} `}>
                <AnimatePresence>
                    {category && (
                        <motion.div
                            initial={{ y: 1000 }}
                            animate={{ y: showProductCardBrand ? 0 : 1000, zIndex: 51 }}
                            exit={{ y: 1000 }}
                            transition={{ duration: 0.5 }}
                            className="fixed left-[35.5%] top-[155px]"
                        >
                            <ProductContainer category={category} setCategory={setCategory}
                                onProductSelect={handleProductSelect}
                                onDragAndDropCell={handleDragAndDropSidebar}
                                setShowProductCardBrand={setShowProductCardBrand} />
                        </motion.div>
                    )}
                </AnimatePresence>


                <div
                    className={`flex flex-col   w-full h-full border-r-2 border-black  transform ${panningOnPage1 ? 'cursor-default' : 'cursor-grabbing'} ${productDragging && productDragging.page && productDragging.page > 1
                        ? "z-0"
                        : "z-50"
                        }`}
                    style={{ overflow: "visible" }}
                >
                    <TransformWrapper
                        ref={containerRefPage1}
                        initialScale={1}
                        minScale={minScale}
                        maxScale={maxScale}
                        centerOnInit={true}
                        doubleClick={{ disabled: true }}
                        wheel={{ disabled: true }}
                        panning={{ disabled: panningOnPage1, velocityDisabled: true }}
                    >
                        {({ zoomIn, zoomOut, setTransform, resetTransform }) => (
                            <>

                                {firsTimeOpen && (() => {
                                    resetTransform();
                                })()}

                                <div
                                    className=" sticky top-4 justify-between items-center space-x-2 p-2 z-50"
                                >


                                    <button
                                        onClick={() => {
                                            handleZoomInPage1();
                                        }}
                                        className="  justify-center items-center"
                                    >
                                        <ZoomInIcon />
                                    </button>


                                    <button
                                        onClick={() => {
                                            handleZoomOutPage1();
                                        }}
                                    >
                                        <ZoomOutIcon />
                                    </button>


                                    <button
                                        onClick={() => {
                                            handleFullPage1();
                                        }}
                                        className=" justify-center items-center"
                                    >
                                        <FocusIn />
                                    </button>
                                    <button
                                        onClick={handleButtonClickPage1}
                                        className=" justify-center items-center"
                                    >
                                        {/* Renderiza el icono según el estado de panningOnPage1 */}
                                        {panningOnPage1 ? <GrapIconOpen /> : <Cursor3 />}
                                    </button>
                                    <button
                                        onClick={handleResetPage1}
                                        className=" justify-center items-center"
                                    >
                                        <ResetPageZoom />
                                    </button>

                                </div>
                                <motion.div
                                    initial={{ x: direction >= 0 ? -300 : 300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: direction >= 0 ? 300 : -300, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                //   className={`w-full relative ${productDragging ? '!z-0' : 'z-10'}`}
                                >
                                    <TransformComponent
                                        wrapperStyle={{
                                            width: "100%",
                                            height: dynamicHeightpage1,
                                            overflow: productDragging ? 'visible' : "auto",
                                            overflowY: !panningOnPage1 || fullPage1 ? 'hidden' : "scroll",

                                        }}
                                    >
                                        <div
                                            ref={divRef1}
                                        >
                                            {/* @ts-ignore */}

                                            <ImageGrid {...commonGridProps} />
                                        </div>
                                    </TransformComponent>
                                </motion.div>
                            </>
                        )}
                    </TransformWrapper>
                </div>

                <div
                    ref={divRef}
                    className={`flex flex-col h-full w-full p-align-center`}>
                    <TransformWrapper
                        ref={containerRefPage2}
                        initialScale={1}
                        minScale={minScale}
                        maxScale={maxScale}
                        centerOnInit={true}
                        doubleClick={{ disabled: true }}
                        wheel={{ disabled: true }}
                        panning={{ disabled: panningOnSubPage, velocityDisabled: true }}
                    >
                        {({ zoomIn, zoomOut, setTransform, resetTransform }) => (
                            <>
                                {resetScale && (() => {
                                    if (productDragging === null) {
                                        resetTransform();
                                        setPanningOnSubPage(true);
                                        setResetScale(false);
                                    }

                                })()}
                                <div
                                    className=" sticky top-4 justify-between items-center space-x-2 p-2 z-50"
                                >
                                    <button
                                        onClick={() => {
                                            handleZoomInSubPages();
                                        }}
                                        className="  justify-center items-center">
                                        <ZoomInIcon />
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleZoomOutSubPages();
                                        }}
                                    >
                                        <ZoomOutIcon />
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleFullPage2();
                                        }}
                                        className=" justify-center items-center"
                                    >
                                        <FocusIn />
                                    </button>
                                    <button
                                        onClick={handleButtonClickPage2}
                                        className=" justify-center items-center"
                                    >
                                        {/* Renderiza el icono según el estado de panningOnPage1 */}
                                        {panningOnSubPage ? <GrapIconOpen /> : <Cursor3 />}
                                    </button>
                                    <button
                                        onClick={handleResetSubPage}
                                        className={`  justify-center items-center`}
                                    >
                                        <ResetPageZoom />
                                    </button>

                                </div>
                                <motion.div
                                    key={currentPage}
                                    initial={{ x: direction >= 0 ? -300 : 300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: direction >= 0 ? 300 : -300, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className={`w-full relative ${productDragging ? '!z-0' : 'z-10'}`}
                                >
                                    <TransformComponent
                                        wrapperStyle={{
                                            // overflow: scaleSubPagines > 0.9 ? "auto" : "visible",
                                            overflow: productDragging ? 'visible' : "auto",
                                            width: "100%",
                                            height: dynamicHeightSubpages,
                                            overflowY: !panningOnSubPage || fullPage2 ? "hidden" : "scroll",
                                        }}
                                    >
                                        <div className={`flex flex-col  w-full  item-center`}>
                                            <div
                                                className={`h-full  w-full `}>
                                                {currentPage === 2 && <ImageGrid2 {...commonGridProps} />}
                                                {currentPage === 3 && <ImageGrid3 {...commonGridProps} />}
                                                {currentPage === 4 && <ImageGrid4 {...commonGridProps} />}
                                            </div>
                                            <p className="justify-center text-black text-md mt-4">Page {currentPage}</p>
                                        </div>
                                    </TransformComponent>
                                </motion.div>
                            </>
                        )}
                    </TransformWrapper>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    theme="light"
                />
            </div>


            {/*//fin*/}
            <section className="z-[52]">
                {/* @ts-ignore */}
                <BottomBar onCategorySelect={handleCategorySelect} categorySelected={category} onClick={handleCategorySelect} />
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
                            ref={productSelectionRef}
                            initial={{ opacity: 0, y: 20 }}
                            exit={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute z-[100]"
                            style={{ top: productSelectionPosition.top, left: productSelectionPosition.left, }}
                        >
                            <GridProduct onProductSelect={handleProductSelect} onHideProducts={ClosetPanels}
                                initialCategory={gridCategory} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <button
                onClick={() => handleClearAllConfirmation(gridIdToClear ?? null)}
                className="bg-red-500 text-white p-2 rounded-md mb-4 w-fit z-50 ml-4 absolute bottom-0"
            >
                Clear
            </button>

            {/* Pop-up de confirmación */}
            {isClearAllPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center space-y-2">
                        <h2 className="text-lg font-bold text-black">Confirm Clear All</h2>
                        <p className="text-black">¿Are you sure you want to clear all products?</p>
                        <p className="text-black">¿Which Page do you want to clear?</p>
                        <button className="bg-gray-400 w-8 h-8 rounded-md mr-2 text-white focus:bg-gray-600"
                            onClick={() => handleClearAllConfirmation(1)}> 1
                        </button>
                        <button className="bg-gray-400 w-8 h-8 rounded-md mr-2 text-white focus:bg-gray-600"
                            onClick={() => handleClearAllConfirmation(2)}> 2
                        </button>
                        <button className="bg-gray-400 w-8 h-8 rounded-md mr-2 text-white focus:bg-gray-600"
                            onClick={() => handleClearAllConfirmation(3)}> 3
                        </button>
                        <button className="bg-gray-400 w-8 h-8 rounded-md mr-2 text-white focus:bg-gray-600"
                            onClick={() => handleClearAllConfirmation(4)}> 4
                        </button>
                        <div className="flex justify-end mt-4">
                            <button onClick={cancelClearAll}
                                className="bg-gray-400 p-2 rounded-md mr-2 text-white">Cancel
                            </button>
                            <button onClick={confirmClearAll}
                                className="bg-green-500 text-white p-2 rounded-md">Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface GridProductProps {
    onProductSelect: (product: ProductTypes) => void;
    onHideProducts?: () => void;
    initialCategory: categoriesInterface | null;
}

const GridProduct: React.FC<GridProductProps> = ({ onProductSelect, onHideProducts, initialCategory }) => {
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

                    <input
                        type="text"
                        placeholder="Search Products"
                        value={searchTerm}
                        onChange={(e) => {
                            console.log('Nuevo valor del input:', e.target.value);
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
                                    displayedProducts.map((product: any, index) => (
                                            <CardShowSide
                                                product={product}
                                                onProductSelect={onProductSelect}
                                                isLoading={false}
                                            />                                      
                                    ))
                                )}

                                {activeTab === 'circular' && (
                                    displayedProducts.map((product: any, index) => (
                                        <div key={product?.id_product || index} className="relative">
                                            <div className="left-0 text-sm text-black">
                                                {"Page-" + product?.id_grid?.toString().charAt(0) || 'N/A'}
                                            </div>
                                            <CardShowSide
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
        </div>
    );
}

