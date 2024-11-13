"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ProductTypes } from "@/types/product";
import { cellTypes } from "@/types/cell";
import { categoriesInterface } from "@/types/category";
import { Skeleton } from 'primereact/skeleton';
import Draggable, {DraggableCore} from 'react-draggable';

interface CardProductProps {
  product: ProductTypes;
  cell?: cellTypes;
  onContextMenu?: (e: React.MouseEvent, cellId: number) => void;
  onProductSelect?: (product: ProductTypes, event: React.MouseEvent) => void;
  onProductGridSelect?: (gridId: number,categoryCard:categoriesInterface, event: React.MouseEvent) => void;
  onPriceChange?: (id: string, price: number) => void;
  handleChangeProducts?: (cellId: string) => void;
  setProductArray?: (product: ProductTypes) => void;
  isCellOccupied?: boolean;
  categoryCard?:categoriesInterface | null | undefined
  onEditProduct?: (productId: string) => void;
  isLoading?: boolean;
  onDragAndDropCell?: (gridCellToMove: any, stopDragEvent: MouseEvent) => void;
  setIsDragging?: (boolean: boolean) => void;
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
                        objectFit="cover"
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
            onPriceChange(product._id.toString(), newPrice);
        }
    };

    const handleUpdate = (e: React.MouseEvent) => {
        if (onProductSelect) {
            const updatedProduct = {...product, price: localPrice};
            onProductSelect(updatedProduct, e);
        }
        // Opcionalmente, puedes llamar a onPriceChange aquí también para asegurarte de que el precio se actualice en el componente padre
        if (onPriceChange) {
            onPriceChange(product._id.toString(), localPrice);
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
                <h2 className="text-center font-semibold text-black text-lg mb-2 truncate">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.desc}</p>
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
                        <span className="text-black">No hay imagen disponible</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export const GridCardProduct = ({ product, cell, onContextMenu,  onProductGridSelect, handleChangeProducts, setProductArray, onEditProduct, onDragAndDropCell, setIsDragging, isCellOccupied, categoryCard, isLoading}: CardProductProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const elementRef = useRef(null);

    
    const handleStart = (e: any , data: any) => {
        setPosition({ x: data.x, y: data.y })

        if (elementRef.current){
            setTimeout(() => {
                (elementRef.current as any).style.pointerEvents = 'none';
            }, 250);
        }
        setIsDragging && setIsDragging(true);
    }
    
    const handleStop = (e: any , data: any) => {
        if (elementRef.current) (elementRef.current as any).style.pointerEvents = 'auto';
        setPosition({ x: 0, y: 0 });
        onDragAndDropCell && onDragAndDropCell(data, e)
        setIsDragging && setIsDragging(false);
    }
    
    

    if ( typeof isLoading !== "boolean" ) isLoading = false;

    const textShadowWhite = {
        'textShadow': '1px 1px 0 #ffffff, -1px 1px 0 #ffffff, 1px -1px 0 #ffffff, -1px -1px 0 #ffffff'
    }

    

    return (
        <Draggable disabled={!product} onStart={handleStart} onStop={handleStop} position={position} >
            <div
                ref={elementRef}
                id={ 'grid-card-product-' + cell?.id }
                key={cell?.id}
                className={`absolute border-2 border-black ${cell?.top} ${cell?.left} rounded cursor-pointer hover:bg-black hover:bg-opacity-20`}
                style={{width: cell?.width, height: cell?.height}}
                onClick={(e) => {
                    if (isCellOccupied && product) {
                        // Si la celda está ocupada y hay un producto, mostrar el modal de edición
                        onEditProduct && onEditProduct(product.id_product.toString());
                    } else if (categoryCard) {
                        // Si no está ocupada, permitir selección normal
                        cell && onProductGridSelect && onProductGridSelect(cell.id, categoryCard, e);
                    }
                    
                    if (product && !isCellOccupied) {
                        setProductArray && setProductArray(product);
                        cell && handleChangeProducts && handleChangeProducts(cell.id.toString());
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
                                            <Image src={product.url_image} alt={product.name || ''} layout="fill" objectFit="cover" />
                                        </div>
                                    </div>
                                )
                            }

                            {
                                product ?
                                    <div className="absolute text-blue-950 rounded px-1 font-bold bottom-[0.5px] left-[1px]    @[27px]:text-[10px]    @[47px]:text-[11px]    @[77px]:text-[13px]" style={textShadowWhite}>
                                        ${product.price?.toFixed(2) || "0.00"}
                                    </div>
                                    : ''
                            }

                            <div className="absolute text-blue-950 font-bold @[27px]:text-[7px] @[27px]:inset-[1px] @[27px]:leading-[6px]    @[47px]:text-[9px] @[47px]:inset-[1px] @[47px]:leading-[8px]    @[77px]:leading-[10px] @[77px]:text-[11px] @[77px]:inset-[2px]" style={textShadowWhite}>
                                { product?.name?.toString().substring(0, 20) }
                            </div>
                            <div className="absolute text-blue-950 rounded font-bold -bottom-[2px] right-[1px]    @[27px]:text-[7px]    @[47px]:text-[9px]    @[77px]:text-[11px]" style={textShadowWhite}>
                                { cell?.id }
                            </div>
                        </div>
                    }
            </div>
        </Draggable>
    )
}



// export const GridCardProduct = ({ product, cell, onContextMenu,  onProductGridSelect }: CardProductProps) => {
//   const textShadowWhite = {
//     'textShadow': '1px 1px 0 #ffffff, -1px 1px 0 #ffffff, 1px -1px 0 #ffffff, -1px -1px 0 #ffffff'
//   }

//   const propertyPerSize: any = {
//     '77px': {
//       imageContainer: ['justify-self-end', 'self-end'],
//       image: ['w-14', 'h-14'],
//       name: ['leading-[10px]', 'text-[11px]', 'inset-[2px]'],
//       price: ['text-[13px]']
//     },
//     '47px': {
//       imageContainer: [],
//       image: ['w-10', 'h-10'],
//       name: ['text-[9px]','inset-[1px]', 'leading-[8px]'],
//       price: ['text-[11px]']
//     },
//     '27px': {
//       imageContainer: ['justify-self-center', 'self-end'],
//       image: ['w8', 'h-8'],
//       name: ['text-[7px]', 'inset-[1px]', 'leading-[6px]'],
//       price: ['text-[10px]']
//     }
//   }

//   function getItemStyle(width: string, property: string) {
//     return propertyPerSize[width][property]
//   }

//   const cardSizes =  Object.keys(propertyPerSize)

//   return (
//     <div
//       key={cell?.id}
//       className={`absolute border-2 border-black ${cell?.top} ${cell?.left} rounded cursor-pointer hover:bg-red-300`}
//       style={{width: cell?.width, height: cell?.height}}
//       onClick={(e) => cell && onProductGridSelect && onProductGridSelect(cell.id, e)}
//       onContextMenu={(e) => cell && onContextMenu && onContextMenu(e, cell.id)}
//       >
//       <div className="@container h-full w-full relative grid">
//         {
//           product?.image && (
//             <div className={`absolute ${ cardSizes.reduce((accu, size) => accu + getItemStyle(size, 'imageContainer').map((style: string) => `@[${size}]:${style}`).join(' '), '') }`}>
//               <div className={`${ cardSizes.reduce((accu, size) => accu + getItemStyle(size, 'image').map((style: string) => `@[${size}]:${style}`).join(' '), '') }`}>
//                 <Image src={product.image} alt={product.name || ''} layout="fill" objectFit="cover" />
//               </div>
//             </div>
//           )
//         }

//         {
//           product ?
//           <div className={`absolute text-blue-950 rounded px-1 font-bold bottom-[0.5px] left-[1px] ${ cardSizes.reduce((accu, size) => accu + getItemStyle(size, 'price').map((style: string) => `@[${size}]:${style}`).join(' '), '') } `} style={textShadowWhite}>
//             { product?.price || '' }
//           </div>
//           : ''
//         }

//         <div className={`absolute text-blue-950 font-bold ${ cardSizes.reduce((accu, size) => accu + getItemStyle(size, 'name').map((style: string) => `@[${size}]:${style}`).join(' '), '') }`} style={textShadowWhite}>
//           { product?.name || cell?.id.toString() }
//         </div>
//       </div>
//     </div>
//   )
// }

export const CardShowSide = ({product, onProductSelect}: CardProductProps) => {
    return (
        <div className="flex flex-col items-center rounded-lg p-2 cursor-pointer hover:bg-gray-200 "
             onClick={(e) => onProductSelect && onProductSelect(product, e)}
        >
            <div className="w-28 h-28 flex items-center justify-center">
                {product.url_image ? (
                    <Image
                        src={product.url_image}
                        alt={product.name}
                        width={100}  // Ajusta el tamaño según sea necesario
                        height={100} // Ajusta el tamaño según sea necesario
                        className="w-[80%] h-[80%] object-center object-cover"
                    />
                ) : (
                    <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">No hay imagen disponible</span>
                    </div>
                )}
            </div>
            <p className="mt-2 text-center text-gray-950 font-medium">{product.name?.toString().substring(0, 20)}</p>
            <p className="text-gray-600 text-sm mb-4">${product.price?.toFixed(2) || "0.00"}</p>
        </div>
    )
}
