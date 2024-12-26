"use client.ts";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ProductTypes } from "@/types/product";
import { cellTypes } from "@/types/cell";
import { categoriesInterface } from "@/types/category";
import { Skeleton } from 'primereact/skeleton';
import Draggable from 'react-draggable';
import { Tooltip } from 'primereact/tooltip';
import { useProductContext } from "../context/productContext";


interface CardProductProps {
    product: ProductTypes;
    cell?: cellTypes;
    onContextMenu?: (e: React.MouseEvent, gridId: number) => void;
    onProductSelect?: (product: ProductTypes, event: React.MouseEvent) => void;
    onGridCellClick?: (gridId: number, idCategory: number | undefined, event: React.MouseEvent) => void;
    onPriceChange?: (id: string, price: string) => void;
    isLoading?: boolean;
    enableDragAndDrop?: boolean;
    page?: number;
    onDragAndDropCell?: (gridCellToMove: any, stopDragEvent: MouseEvent) => void;
    setCategory?: (category: categoriesInterface | null) => void;
    setShowProductCardBrand?: (arg: boolean) => void;
}

export const CardProduct: React.FC<CardProductProps> = ({ product, onProductSelect }) => {
    return (
        <div
            className="flex flex-col bg-white items-center justify-between p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer w-64 h-80"
            onClick={(e) => onProductSelect && onProductSelect(product, e)}
        >
            <div className="text-center w-full">
                <h2 className="font-semibold text-black text-lg mb-2 truncate">{product.desc || "No hay descripción"}</h2>
            </div>
            <div className="w-full h-40 relative">
                {product.url_image ? (
                    <Image
                        src={product.url_image}
                        alt={product.desc || "No hay descripción"}
                        layout="fill"
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">No hay imagen disponible</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CardSide: React.FC<CardProductProps> = ({ product, onPriceChange, onProductSelect }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showImage, setShowImage] = useState(false);
    const [localPrice, setLocalPrice] = useState(product.price)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImage(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleImageLoad = () => setIsLoading(false);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = e.target.value;
        setLocalPrice(newPrice);
        if (onPriceChange) {
            onPriceChange(String(product.id_product), String(newPrice));
        }
    };

    const handleUpdate = (e: React.MouseEvent) => {
        if (onProductSelect) {
            const updatedProduct = { ...product, price: localPrice };
            onProductSelect(updatedProduct, e);
        }
        // Opcionalmente, puedes llamar a onPriceChange aquí también para asegurarte de que el precio se actualice en el componente padre
        if (onPriceChange) {
            onPriceChange(String(product.id_product), localPrice);
        }
    };

    return (
        <div className="border rounded-lg shadow-md pl-1 flex flex-col text-pretty">
            <p className="text-gray-600">{product.desc}</p>
            <input
                type="number"
                value={localPrice}
                onChange={handlePriceChange}
                className="mt-2 p-1 border rounded"
                placeholder="Precio"
            />
            {showImage && product.url_image ? (
                <Image
                    src={product.url_image}
                    width={100}
                    height={100}
                    className="rounded object-cover mt-2"
                    onLoadingComplete={handleImageLoad}
                    draggable={false}
                    alt={product.desc || "No hay descripción"}
                />
            ) : (
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center mt-2">
                    {isLoading ? (
                        <span className="text-gray-500">Cargando...</span>
                    ) : (
                        <span className="text-gray-500">No Image</span>
                    )}
                </div>
            )}
            <p className="text-gray-600 mt-2">Precio: ${parseFloat(localPrice).toFixed(2)}</p>
            <button
                onClick={handleUpdate}
                className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
            >
                Actualizar
            </button>
        </div>
    );
};

export const CardShow = ({ product, onProductSelect }: CardProductProps) => {
    return (
        <div
            className="flex bg-white  justify-between p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer h-48 border border-gray-200  "
            onClick={(e) => onProductSelect && onProductSelect(product, e)}
        >
            <div className="flex flex-col w-full">
                <h2 className="text-center font-semibold text-black text-lg mb-2 truncate">{product?.desc ? product?.desc : product?.desc}</h2>
                <p className="text-gray-600 text-sm mb-4">${parseFloat(product.price || "0").toFixed(2)}</p>
            </div>
            <div className="relative flex items-center justify-end">
                {product.url_image ? (
                    <Image
                        src={product.url_image}
                        alt={product.desc || "No hay descripción"}
                        width={150}
                        height={150}
                        className="rounded object-cover"
                        draggable={false}
                    />
                ) : (
                    <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-black">No Image</span>
                    </div>
                )}
            </div>
        </div>
    )
}


export const GridCardProduct = ({
    product,
    cell,
    onContextMenu,
    onGridCellClick,
    onDragAndDropCell,
    isLoading,
    page,
    setShowProductCardBrand
}: CardProductProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const elementRef = useRef(null);
    const timeoutRef = useRef<any>(null);
    const { productDragging, setProductDragging, productReadyDrag, setProductReadyDrag, panningOnSubPage, panningOnPage1, zoomScalePage1, zoomScaleSubPagines } = useProductContext();
    const startDragging = (e: any, data: any) => {
        setProductDragging && setProductDragging({
            from: 'grid',
            id_product: product?.id_product,
            id_grid: cell && cell.id,
            page: page
        });

        if (elementRef.current) {
            setTimeout(() => {
                (elementRef.current as any).style.pointerEvents = 'none';
            }, 250);
        }
        setShowProductCardBrand && setShowProductCardBrand(false)
    }

    const stopDragging = (e: any, data: any) => {
        setPosition({ x: 0, y: 0 });

        if (elementRef.current) {
            setTimeout(() => {
                (elementRef.current as any).style.pointerEvents = 'auto';
            }, 250);
        }

        onDragAndDropCell && onDragAndDropCell(data, e)
        setShowProductCardBrand && setShowProductCardBrand(true)
        setTimeout(() => {
            setProductDragging && setProductDragging(null);
            setProductReadyDrag(null)
        }, 250);
    }

    const [pageValidity, setPageValidity] = useState<number>(0);
    const handleMouseDown = (e: any) => {

        const tmpVAlue =
            (!panningOnPage1 || zoomScalePage1 > 1.25) && (!panningOnSubPage || zoomScaleSubPagines > 1.25)
                ? 5
                : !panningOnPage1 || zoomScalePage1 > 1.25
                    ? 1
                    : !panningOnSubPage || zoomScaleSubPagines > 1.25
                        ? 2
                        : 0;

        setPageValidity(tmpVAlue);
        if (tmpVAlue === 5) return;

        if (e.button === 0) {
            timeoutRef.current = setTimeout(() => {
                console.log(tmpVAlue, 'paginas selecionadas y valida', page)
                if (product && (!productReadyDrag && page !== tmpVAlue)) {
                    setProductReadyDrag({
                        from: 'grid',
                        id_product: product.id_product,
                        id_grid: cell && cell.id,
                        page: page
                    });
                }
            }, 1000);
        }
    };

    const handleMouseUp = (e: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    if (typeof isLoading !== "boolean") isLoading = false;

    const textShadowWhite = {
        'textShadow': '1px 1px 0 #ffffff, -1px 1px 0 #ffffff, 1px -1px 0 #ffffff, -1px -1px 0 #ffffff'
    }


    const divRef = useRef<HTMLDivElement>(null);
    const [divDimensions, setDivDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (divRef.current) {
                const { offsetWidth, offsetHeight } = divRef.current;
                setDivDimensions({ width: offsetWidth, height: offsetHeight });
            }
        };

        updateDimensions();

        const timer = setTimeout(updateDimensions, 100);

        window.addEventListener('resize', updateDimensions);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateDimensions);
        };
    }, [product, divRef.current]);



    return (
        <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} >
            <Tooltip
                target={'#grid-card-product-' + cell?.id}
                content={
                    !product
                        ? 'Product is not available.'
                        : !panningOnSubPage || !panningOnPage1
                            ? pageValidity === page
                                ? 'Panning is not active on Page 1.'
                                : pageValidity === page
                                    ? 'Panning is not active on the Subpage.'
                                    : 'Panning is not active on the current page.'
                            : zoomScalePage1 > 1.25 || zoomScaleSubPagines >= 1.25
                                ? pageValidity === page
                                    ? 'Zoom level is too high on Page 1 to activate drag and drop.'
                                    : pageValidity === page
                                        ? 'Zoom level is too high on the Subpage to activate drag and drop.'
                                        : 'Zoom level is too high to activate drag and drop.'
                                : 'To activate Drag and Drop, press the box for 1 second'
                }
                position="top"
                disabled={!product}
                showDelay={1000}
            />
            <Draggable disabled={!productReadyDrag || (productReadyDrag && productReadyDrag.id_grid != cell?.id)} onStart={startDragging} onStop={stopDragging} position={position}>
                <div
                    ref={elementRef}
                    id={'grid-card-product-' + cell?.id}
                    key={cell?.id}
                    className={`absolute border-2 border-gray-400 ${cell?.top} ${cell?.left} rounded cursor-pointer  hover:bg-yellow-400 hover:bg-opacity-100 ${(productReadyDrag && productReadyDrag.id_grid == cell?.id) && !productDragging ? 'shake' : ''} `}
                    style={{ width: cell?.width, height: cell?.height }}
                    onClick={(e) => {
                        if (!productReadyDrag) {
                            cell && onGridCellClick && onGridCellClick(cell.id, cell.idCategory, e);
                        }
                    }}
                    onContextMenu={(e) => cell && onContextMenu && onContextMenu(e, cell.id)}
                >
                    {isLoading ?
                        <Skeleton width="100%" height="100%" borderRadius="0"> </Skeleton>
                        :
                        <div className="@container h-full w-full relative grid overflow-hidden">
                            {


                                product && (
                                    <div className="absolute justify-self-end self-center w-[70%] h-[70%] -right-[5%]">
                                        <Image
                                            src={product?.url_image ? product?.url_image : "/no-image.png"}
                                            alt={product?.desc || "No hay descripción"}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-contain"
                                            draggable={false}
                                        />
                                    </div>
                                )
                            }
                            <div
                                ref={divRef}
                                className="absolute border-2 border-blue-600 flex flex-col  justify-self-start  overflow-hidden text-blue-950 font-bold "
                                style={{
                                    ...textShadowWhite,
                                    width: '100%',
                                    height: '100%',
                                    fontSize: divDimensions.width > 0 ? `calc(1 * ${Math.min(divDimensions.width, divDimensions.height) * 0.12}px)` : '12px',
                                    lineHeight: '1.2',
                                }}
                            >
                                {product && (
                                    <>

                                        <span
                                            className="text-blue-600 uppercase truncate text-left w-full"
                                            style={{ fontSize: '1.3em' }}>
                                            {product.brand}
                                        </span>


                                        <span
                                            className="uppercase truncate text-left w-full"
                                            style={{ fontSize: '1em' }}
                                        >
                                            {product.desc}
                                        </span>


                                        <span
                                            className="text-purple-600 uppercase truncate text-left w-full"
                                            style={{ fontSize: '0.8em' }}
                                        >
                                            <span> {product?.size || ''} </span>
                                            <span> {product?.pack || ''} </span>
                                            <span> {product?.w_simbol || ''} </span>
                                            <span> {product?.count || ''} </span>
                                            <span> {product?.embase || ''} </span>
                                        </span>


                                        <span
                                            className="text-red-500 truncate text-left w-full"
                                            style={{ fontSize: '1.1em' }}
                                        >
                                            {product?.price?.replace(/"/g, '') || '0'}
                                        </span>


                                        {product?.with_card && (
                                            <span
                                                className="text-green-600 uppercase truncate text-left w-full"
                                                style={{ fontSize: '0.8em' }}
                                            >With Club Card
                                            </span>
                                        )}


                                        {product?.limit && product?.limit.length > 0 && (
                                            <span
                                                className="text-green-600 uppercase truncate text-left w-full"
                                                style={{ fontSize: '0.8em' }}
                                            >
                                                Limit {product?.limit} Offer
                                            </span>
                                        )}


                                        {product?.must_buy && product.must_buy.length > 0 && (
                                            <span
                                                className="text-green-600 uppercase truncate text-left w-full"
                                                style={{ fontSize: '0.8em' }}
                                            >
                                                Must Buy {product?.must_buy}
                                            </span>
                                        )}

                                        {product?.addl && product?.addl.length > 0 && (
                                            <span
                                                className="text-green-600 uppercase truncate text-left w-full"
                                                style={{ fontSize: '0.8em' }}
                                            >
                                                Addl's {product?.addl} 
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="absolute bottom-0 w-full flex flex-col items-end ">

                                <span
                                    className="bg-yellow-300 px-0.5 rounded-sm text-blue-950 font-bold  @[44px]:text-[10px] @[44px]:leading-[10px] @[66px]:text-[10px] @[66px]:leading-[10px] @[71px]:leading-[10px] @[125px]:text-[10px]">
                                    {cell?.id}
                                </span>
                            </div>
                        </div>
                    }
                </div>
            </Draggable>
        </div>
    )
}


export const CardShowSide = ({
    product,
    onProductSelect,
    enableDragAndDrop,
    onDragAndDropCell,
    setShowProductCardBrand,
    isLoading
}: CardProductProps) => {
    const [imageError, setImageError] = useState(false);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const elementRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<any>(null);
    const { productDragging, setProductDragging, productReadyDrag, setProductReadyDrag } = useProductContext();

    if (typeof enableDragAndDrop !== "boolean") enableDragAndDrop = false;

    const startDragging = (e: any, data: any) => {

        setPosition({ x: 0, y: 0 });

        setProductDragging && setProductDragging({ from: 'sidebar', id_product: product.id_product });

        setTimeout(() => {
            if (elementRef.current) elementRef.current.style.pointerEvents = 'none';
        }, 250);

        setShowProductCardBrand && setShowProductCardBrand(false)

    }

    const stopDragging = (e: any, data: any) => {
        setPosition({ x: 0, y: 0 });

        setTimeout(() => {
            if (elementRef.current) elementRef.current.style.pointerEvents = 'auto';
        }, 250);


        onDragAndDropCell && onDragAndDropCell(data, e)
        setShowProductCardBrand && setShowProductCardBrand(true)

        setProductDragging && setProductDragging(null);

        setTimeout(() => {
            setProductReadyDrag(null)
        }, 250);
    }

    const handleMouseDown = (e: any) => {

        if (enableDragAndDrop && e.button == 0) {
            timeoutRef.current = setTimeout(() => {

                if (!productReadyDrag) {
                    setProductReadyDrag({ from: 'sidebar', id_product: product.id_product });
                }
            }, 1000);
        }

    };


    const handleMouseUp = (e: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

    };

    const productDraggindClass = 'border-dashed border-2 border-[#dddddd] bg-gray-100'

    return (

        <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <Tooltip target={'#sidebar-card-product-' + product?.id_product}
                content={`To activate Drag and Drop,\n press the box for 1 second`} position="top"
                disabled={!enableDragAndDrop} showDelay={1000} />

            <Draggable
                disabled={!productReadyDrag || (productReadyDrag && ((productReadyDrag.id_product != product.id_product) || productReadyDrag.from != 'sidebar'))}
                defaultPosition={{ x: 0, y: 0 }} onStart={startDragging} onStop={stopDragging} position={position}>
                {isLoading ?
                    (
                        <div
                            className="bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col items-center justify-center overflow-y-auto space-y-2 ">
                            <div className="w-28 h-28 bg-gray-300 rounded flex items-center justify-center "></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    )
                    :
                    (
                        <div ref={elementRef} id={'sidebar-card-product-' + product?.id_product}
                            className={`flex flex-col h-full items-center rounded-lg p-2 cursor-pointer bg-gray-100 bg-opacity-[.68] hover:bg-gray-200 ${(productReadyDrag && productReadyDrag.id_product == product.id_product && productReadyDrag.from == 'sidebar') && !productDragging ? `shake ${productDraggindClass}` : ''} ${productDragging && productDragging.id_product == product.id_product && productDragging.from == 'sidebar' ? `absolute ${productDraggindClass} opacity-[0.7] top-[16rem] max-w-[200px] max-h-[200px]` : ''}`}
                            onClick={(e) => {
                                if (!enableDragAndDrop || !productReadyDrag) {
                                    onProductSelect && onProductSelect(product, e)
                                }
                            }}
                        >
                            <div className=" flex w-28 h-28 items-center justify-center">
                                {
                                    product.url_image && !imageError ? (
                                        <Image
                                            src={product.url_image}
                                            alt={product.desc || "No hay descripción"}
                                            width={100}
                                            height={100}
                                            draggable={false}
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-lg"
                                            onError={() => setImageError(true)}
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL={product.url_image}
                                        />
                                    )
                                        :
                                        (
                                            <div
                                                className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-500">No Image</span>
                                            </div>
                                        )
                                }
                            </div>
                            <p className="text-center text-gray-950 font-bold">{product.master_brand}</p>
                            <p className={`text-center text-gray-950 ${product.master_brand ? 'font-medium' : 'font-bold'}`}>{product.brand}</p>
                            <p className="text-center text-gray-900 font-medium leading-tight">{product.desc}</p>
                            <p className="text-center text-gray-500 text-xs">{product.variety?.[0]?.trim().replaceAll('"', '') || ''}</p>
                            <p className="text-center text-gray-500 text-xs">
                                <span> {product?.size || ''} </span>
                                <span> {product?.pack || ''} </span>
                                <span> {product?.w_simbol || ''} </span>
                                <span> {product?.count || ''} </span>
                                <span> {product?.embase || ''} </span>
                            </p>
                        </div>
                    )
                }

            </Draggable>
        </div>
    )
}

interface ProductAddedModalProps {
    product: ProductTypes;
    onClose: () => void;
    categories: categoriesInterface[];
}

export const ProductAddedModal = ({ product, onClose, categories }: ProductAddedModalProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        // Manejar diferentes casos de la imagen
        if (product.image?.[0] instanceof File) {
            // Si es un archivo, crear URL temporal
            const url = URL.createObjectURL(product.image[0]);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (product.url_image) {
            // Si ya tiene una URL de imagen
            setImageUrl(product.url_image);
        }
    }, [product.image, product.url_image]);

    // Encontrar el nombre de la categoría
    const categoryName = categories.find(cat => cat.id_category === Number(product.id_category))?.name_category || 'Categoría no encontrada';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">¡Producto Añadido!</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Imagen del producto */}
                    {imageUrl && (
                        <div className="relative h-48 w-full">
                            <Image
                                src={imageUrl}
                                alt={product.desc || 'Producto'}
                                fill
                                className="object-contain rounded-lg"
                                draggable={false}
                            />
                        </div>
                    )}

                    {/* Detalles del producto */}
                    <div className="space-y-2">
                        <p className="text-sm">
                            <span className="font-semibold text-gray-800">Category: </span>
                            <span className="text-gray-600 uppercase">{categoryName}</span>
                        </p>

                        {Object.entries(product).map(([key, value]) => {
                            if (value &&
                                key !== 'image' &&
                                key !== 'url_image' &&
                                key !== 'id_category' &&
                                typeof value !== 'object') {
                                return (
                                    <p key={key} className="text-sm">
                                        <span className="font-semibold capitalize text-gray-800">
                                            {key.replace(/_/g, ' ')}:
                                        </span>
                                        <span className="text-gray-600 uppercase"> {value.toString()}</span>
                                    </p>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
