"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProductTypes } from "@/types/product";
import { cellTypes } from "@/types/cell";


interface CardProductProps {
  product: ProductTypes;
  cell?: cellTypes; 
  onContextMenu?: (e: React.MouseEvent, cellId: number) => void; 
  onProductSelect?: (product: ProductTypes, event: React.MouseEvent) => void; 
  onProductGridSelect?: (gridId: number, event: React.MouseEvent) => void;
  onPriceChange?: (id: string, price: number) => void; 
  handleChangeProducts?: (cellId: string) => void; 
}
export const CardProduct: React.FC<CardProductProps> = ({ product, onProductSelect }) => {
  return (
    <div 
      className="flex flex-col bg-white items-center justify-between p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer w-64 h-80" 
      onClick={(e) => onProductSelect && onProductSelect(product, e)}
    >
      <div className="text-center w-full">
        <h2 className="font-semibold text-black text-lg mb-2 truncate">{product.name}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.descriptions || "No hay descripción"}</p>
      </div>
      <div className="w-full h-40 relative">
        {product.image ? (
          <Image
            src={product.image}
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

export const CardSide: React.FC<CardProductProps> = ({ product, onPriceChange, onProductSelect }) => {
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
      onPriceChange(product.id, newPrice);
    }
  };

  const handleUpdate = (e: React.MouseEvent ) => {
    if (onProductSelect) {
      const updatedProduct = {...product, price: localPrice};
      onProductSelect(updatedProduct, e);
    }
    // Opcionalmente, puedes llamar a onPriceChange aquí también para asegurarte de que el precio se actualice en el componente padre
    if (onPriceChange) {
      onPriceChange(product.id, localPrice);
    }
  };

  return (
    <div className="border rounded-lg shadow-md pl-1 flex flex-col text-pretty">
      <p className="font-semibold text-black">{product.name}</p>
      <p className="text-gray-600">{product.descriptions}</p>
      <input
        type="number"
        value={localPrice}
        onChange={handlePriceChange}
        className="mt-2 p-1 border rounded"
        placeholder="Precio"
      />
      {showImage && product.image ? (
        <Image
          src={product.image}
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

export const CardShow = ({ product, onProductSelect }: CardProductProps) => {
return (
  <div 
  className="flex bg-white  justify-between p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer h-48 border border-gray-200  " 
  onClick={(e) => onProductSelect && onProductSelect(product, e)}
>
  <div className="flex flex-col w-full">
    <h2 className="text-center font-semibold text-black text-lg mb-2 truncate">{product.name}</h2>
    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.descriptions}</p>
    <p className="text-gray-600 text-sm mb-4">${product.price?.toFixed(2) || "0.00"}</p>
  </div>
  <div className="h-40 relative flex items-center justify-end">
    {product.image ? (
      <Image
        src={product.image}
        alt={product.name}
        width={200}
        height={200}
        className="rounded object-cover"
      />
    ) : (
      <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No hay imagen disponible</span>
      </div>
    )}
  </div>
</div>
)
}

export const GridCardProduct = ({ product, cell, onContextMenu,  onProductGridSelect, handleChangeProducts }: CardProductProps) => {
  const textShadow = {
    'textShadow': '1px 1px 0 #ffffff, -1px 1px 0 #ffffff, 1px -1px 0 #ffffff, -1px -1px 0 #ffffff'
  }
  return (
    <div
      key={cell?.id}
      className={`absolute border-2 border-black ${cell?.top} ${cell?.left} rounded cursor-pointer hover:bg-black hover:bg-opacity-20`}
      style={{width: cell?.width, height: cell?.height}}
      onClick={(e) => {
        cell && onProductGridSelect && onProductGridSelect(cell.id, e);
        cell && handleChangeProducts && handleChangeProducts(cell.id.toString());
      }
      }
      onContextMenu={(e) => cell && onContextMenu && onContextMenu(e, cell.id)}
      >
      <div className="@container h-full w-full relative grid overflow-hidden">
        {
          product?.image && ( 
            <div className="absolute @[27px]:justify-self-center @[27px]:self-end    @[77px]:justify-self-end @[77px]:self-end">
              <div className="@[27px]:w-8 @[27px]:h-8    @[47px]:w-10 @[47px]:h-10    @[77px]:w-14 @[77px]:h-14">
                <Image src={product.image} alt={product.name || ''} layout="fill" objectFit="cover" />
              </div>
            </div>
          )
        }
        <div className="absolute text-blue-950 font-bold @[27px]:text-[7px] @[27px]:inset-[1px] @[27px]:leading-[6px]    @[47px]:text-[9px] @[47px]:inset-[1px] @[47px]:leading-[8px]    @[77px]:leading-[10px] @[77px]:text-[11px] @[77px]:inset-[2px]" style={textShadow}>
            { product?.name || cell?.id.toString() }
        </div>
      </div>
    </div>
  )}
  


// export const GridCardProduct = ({ product, cell, onContextMenu,  onProductGridSelect }: CardProductProps) => {

//   const propertyPerSize: any = { 
//     '77px': {
//       image: {
//         'justify-self' : 'justify-self-end',
//         'aling-self' : 'self-center'
//       },
//       name: {
//         'text-size' : 'text-[9px]'
//       }
//     }
//   }

//   function getItemStyle(width: string, property: string, style: string) {
//     return propertyPerSize[width][property][style]
//   }

//   function getItemStyleProps(width: string, property: string) {
//     return Object.keys(propertyPerSize[width][property])
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
//             <div className={`absolute ${ cardSizes.reduce((accu, size) => accu + getItemStyleProps(size, 'image').map((prop: string) => `@[${size}]:${getItemStyle(size, 'image', prop)}`).join(' '), '') } `}>
//               <Image src={product.image} alt={product.name || ''} width={70} height={70} objectFit="cover" /> 
//             </div>
//           )
//         }
//         <div className={`absolute text-black font-bold inset-[2px] leading-[14px] ${ cardSizes.reduce((accu, size) => accu += getItemStyleProps(size, 'name').map((prop: string) => `@[${size}]:${getItemStyle(size, 'name', prop)}`).join(' '), '') }`}>
//             { product?.name || cell?.id.toString() }
//         </div>
//       </div>
//     </div>
//   )
// }
