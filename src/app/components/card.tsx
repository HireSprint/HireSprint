"use client";
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
  onPriceChange?: (id: string, price: number) => void;
  isLoading?: boolean;
  enableDragAndDrop?: boolean;
  page?: number;
  onDragAndDropCell?: (gridCellToMove: any, stopDragEvent: MouseEvent) => void;
}

export const CardProduct: React.FC<CardProductProps> = ({product, onProductSelect}) => {
    return (
        <div
            className="flex flex-col bg-white items-center justify-between p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer w-64 h-80"
            onClick={(e) => onProductSelect && onProductSelect(product, e)}
        >
            <div className="text-center w-full">
                <h2 className="font-semibold text-black text-lg mb-2 truncate">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.desc || "No hay descripción"}</p>
            </div>
            <div className="w-full h-40 relative">
                {product.url_image ? (
                    <Image
                        src={product.url_image}
                        alt={product.name}
                        layout="fill"
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
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

export const CardSide: React.FC<CardProductProps> = ({product, onPriceChange, onProductSelect}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showImage, setShowImage] = useState(false);
    const [localPrice, setLocalPrice] = useState(product.price || 0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImage(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleImageLoad = () => setIsLoading(false);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = parseFloat(e.target.value);
        setLocalPrice(newPrice);
        if (onPriceChange) {
            onPriceChange(String(product.id_product), newPrice);
        }
    };

    const handleUpdate = (e: React.MouseEvent) => {
        if (onProductSelect) {
            const updatedProduct = {...product, price: localPrice};
            onProductSelect(updatedProduct, e);
        }
        // Opcionalmente, puedes llamar a onPriceChange aquí también para asegurarte de que el precio se actualice en el componente padre
        if (onPriceChange) {
            onPriceChange(String(product.id_product), localPrice);
        }
    };

    return (
        <div className="border rounded-lg shadow-md pl-1 flex flex-col text-pretty">
            <p className="font-semibold text-black">{product.name}</p>
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
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded object-cover mt-2"
                    onLoadingComplete={handleImageLoad}
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
            <p className="text-gray-600 mt-2">Precio: ${localPrice.toFixed(2)}</p>
            <button
                onClick={handleUpdate}
                className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
            >
                Actualizar
            </button>
        </div>
    );
};

export const CardShow = ({product, onProductSelect}: CardProductProps) => {
    return (
        <div
            className="flex bg-white  justify-between p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer h-48 border border-gray-200  "
            onClick={(e) => onProductSelect && onProductSelect(product, e)}
        >
            <div className="flex flex-col w-full">
                <h2 className="text-center font-semibold text-black text-lg mb-2 truncate">{product?.desc ? product?.desc : product?.name}</h2>
                <p className="text-gray-600 text-sm mb-4">${product.price?.toFixed(2) || "0.00"}</p>
            </div>
            <div className="relative flex items-center justify-end">
                {product.url_image ? (
                    <Image
                        src={product.url_image}
                        alt={product.name || ""}
                        width={150}
                        height={150}
                        className="rounded object-cover"
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

export const GridCardProduct = ({ product, cell, onContextMenu,  onGridCellClick,  onDragAndDropCell, isLoading, page}: CardProductProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [readyToDrag, setReadyToDrag] = useState(false);
    const elementRef = useRef(null);
    const timeoutRef = useRef<any>(null);
    const { productDragging, setProductDragging } = useProductContext();

    
    const startDragging = (e: any , data: any) => {
        setProductDragging && setProductDragging({ from: 'grid', id_product: product?.id_product, id_grid: cell && cell.id, page: page });
        
        if (elementRef.current){
            setTimeout(() => {
                (elementRef.current as any).style.pointerEvents = 'none' ;
            }, 250);
        }
    }
    
    const stopDragging = (e: any , data: any) => {
        setPosition({ x: 0, y: 0 });
        
        if (elementRef.current){
            setTimeout(() => {
                (elementRef.current as any).style.pointerEvents = 'auto';
            }, 250);
        }
        
        onDragAndDropCell && onDragAndDropCell(data, e)
        setProductDragging && setProductDragging(null);
        setTimeout(() => (setReadyToDrag(false)), 250);
    }
    
    const handleMouseDown = (e:any) => {
        if (e.button == 0) {
            timeoutRef.current = setTimeout(() => {
                setReadyToDrag(readyToDrag ? false : product != undefined && product != null);
            }, 1000);
        }
    };
    
    const handleMouseUp = (e:any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    if ( typeof isLoading !== "boolean" ) isLoading = false;

    const textShadowWhite = {
        'textShadow': '1px 1px 0 #ffffff, -1px 1px 0 #ffffff, 1px -1px 0 #ffffff, -1px -1px 0 #ffffff'
    }
    
    return (
        <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} >
            <Tooltip target={ '#grid-card-product-' + cell?.id } content={`To activate Drag and Drop,\n press the box for 1 second`} position="top"  disabled={!product} showDelay={1000}/>
            <Draggable disabled={!readyToDrag} onStart={startDragging} onStop={stopDragging} position={position}>
                <div
                    ref={elementRef}
                    id={ 'grid-card-product-' + cell?.id }
                    key={cell?.id}
                    className={`absolute border-2 border-black ${cell?.top} ${cell?.left} rounded cursor-pointer  hover:bg-black hover:bg-opacity-20 ${readyToDrag && !productDragging ? 'shake' : ''} `}
                    style={{width: cell?.width, height: cell?.height}}
                    onClick={(e) => {
                        if (!readyToDrag && (!productDragging || (productDragging && productDragging.id_grid == cell?.id))) {
                            cell && onGridCellClick && onGridCellClick(cell.id, cell.idCategory, e);
                        }
                    }}
                    onContextMenu={(e) => cell && onContextMenu && onContextMenu(e, cell.id)}
                    >
                        { isLoading ?
                            <Skeleton width="100%" height="100%" borderRadius="0"> </Skeleton>
                        :
                            <div className="@container h-full w-full relative grid overflow-hidden">
                                {
                                    product?.url_image && (
                                        <div className="absolute @[27px]:justify-self-center @[27px]:self-end    @[77px]:justify-self-end @[77px]:self-end">
                                            <div className="@[27px]:w-8 @[27px]:h-8    @[47px]:w-10 @[47px]:h-10    @[77px]:w-14 @[77px]:h-14">
                                                <Image src={product.url_image} alt={product.name || ''} width={100} height={100} />
                                            </div>
                                        </div>
                                    )
                                }
        
                                {
                                    product && (
                                        <div className="absolute text-blue-950 rounded px-1 font-bold bottom-[0.5px] left-[1px]    @[27px]:text-[10px]    @[47px]:text-[11px]    @[77px]:text-[13px]" style={textShadowWhite}>
                                            ${product.price?.toFixed(2) || "0.00"}
                                        </div>
                                    )
                                }
        
                                <div className="absolute text-blue-950 font-bold @[27px]:text-[7px] @[27px]:inset-[1px] @[27px]:leading-[6px]    @[47px]:text-[9px] @[47px]:inset-[1px] @[47px]:leading-[8px]    @[77px]:leading-[10px] @[77px]:text-[11px] @[77px]:inset-[2px]" style={textShadowWhite}>
                                    { product?.desc ? product?.desc?.toString().substring(0, 20) : product?.name?.toString().substring(0, 20) }
                                    {/* { readyToDrag ? 'true':'false' } */}
                                </div>

                                <div className="flex items-end justify-end text-blue-950 font-bold @[27px]:text-[7px] @[27px]:inset-[1px] @[27px]:leading-[6px]    @[47px]:text-[9px] @[47px]:inset-[1px] @[47px]:leading-[8px]    @[77px]:leading-[10px] @[77px]:text-[11px] @[77px]:inset-[2px]" style={textShadowWhite}>
                                    { cell?.id }
                                </div>
                            </div>
                        }
                </div>
            </Draggable>
        </div>
    )
}

export const CardShowSide = ({product, onProductSelect, enableDragAndDrop}: CardProductProps) => {
    const [imageError, setImageError] = useState(false);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [readyToDrag, setReadyToDrag] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<any>(null);
    const { productDragging, setProductDragging } = useProductContext();

    if ( typeof enableDragAndDrop !== "boolean" ) enableDragAndDrop = false;

    const startDragging = (e: any , data: any) => {
        // console.log("moviendo");
        setProductDragging && setProductDragging({ from: 'sidebar', id_product: product.id_product });
        const rect = elementRef.current?.getBoundingClientRect();
        // console.log("rect ", rect);

        setTimeout(() => {
            if (elementRef.current) elementRef.current.style.pointerEvents = 'none' ;
        }, 250);
    }
    
    const stopDragging = (e: any , data: any) => {
        // console.log("paro");
        setPosition({ x: 0, y: 0 });
        

        setTimeout(() => {
            if (elementRef.current) elementRef.current.style.pointerEvents = 'auto';
        }, 250);
        
        // onDragAndDropCell && onDragAndDropCell(data, e)
        setProductDragging && setProductDragging(null);
        setTimeout(() => (setReadyToDrag(false)), 250);
    }

    const handleMouseDown = (e:any ) => {
        if (enableDragAndDrop && e.button == 0) {
            timeoutRef.current = setTimeout(() => {
                setReadyToDrag(true);
            }, 1000);
        }
        
    };
    
    
    const handleMouseUp = (e:any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
    };

    useEffect(() => {
        console.log("readyToDrag ", readyToDrag);
    },[readyToDrag])

    const productDraggindClass= 'border-dashed border-2 border-[#dddddd] bg-gray-100'

    return (
        
        <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} > 
            <Tooltip target={ '#sidebar-card-product-' + product?.id_product } content={`To activate Drag and Drop,\n press the box for 1 second`} position="top" disabled={!enableDragAndDrop} showDelay={1000}/>
            <Draggable disabled={!enableDragAndDrop && !readyToDrag} defaultPosition={{ x: 0, y: 0 }} onStart={startDragging} onStop={stopDragging} position={position} >
                <div ref={elementRef} id={ 'sidebar-card-product-' + product?.id_product } className={`flex flex-col items-center rounded-lg p-2 cursor-pointer hover:bg-gray-200 min-w-[154px] ${readyToDrag && !productDragging ? `shake ` : ''} ${productDragging && productDragging.id_product == product.id_product ? `fixed ${productDraggindClass}` : ''}`} 
                    onClick={(e) => {
                        console.log("ANDO AQUIII");
                        
                        console.log("productDragging ", productDragging);
                        if (!enableDragAndDrop || !productDragging || (productDragging && productDragging.id_product != product.id_product)) {
                            // onProductSelect && onProductSelect(product, e)
                        }
                    }} 
                >
                    <div className=" flex w-28 h-28 items-center justify-center">
                        {
                            product.url_image && !imageError ? (
                                <Image
                                    src={product.url_image}
                                    alt={product.name}
                                    width={100}
                                    height={100}
                                    draggable="false"
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
                                <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )
                        }
                    </div>
                    
                    { enableDragAndDrop && <p className="text-center text-gray-950 font-medium ">{readyToDrag? 'listo':' espera'}</p>}
                    <p className="text-center text-gray-950 font-medium ">{product.master_brand}</p>
                    <p className="text-center text-gray-950 font-medium">{product.brand}</p>
                    <p className="text-center text-gray-950 font-medium">{product.desc}</p>
                    <p className="text-center text-gray-950 font-medium">{product.variety?.[0]}</p>
                </div>
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
                            />
                        </div>
                    )}

                    {/* Detalles del producto */}
                    <div className="space-y-2">
                        <p className="text-sm">
                            <span className="font-semibold text-gray-800">Categoría: </span>
                            <span className="text-gray-600">{categoryName}</span>
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
                                        <span className="text-gray-600"> {value.toString()}</span>
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
  