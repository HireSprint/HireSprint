"use client";
import Image from "next/image";
import { useEffect, useState } from "react";


interface Product {
  id: string;
  name: string;
  descriptions: string;
  image: string;
  price?: number;
}

interface CardProductProps {
  product: Product;
  onProductSelect?: (product: Product) => void; 
  onPriceChange?: (id: string, price: number) => void; 
}
export const CardProduct: React.FC<CardProductProps> = ({ product, onProductSelect }) => {
  return (
    <div 
      className="flex flex-col bg-white items-center justify-between p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer w-64 h-80" 
      onClick={() => onProductSelect && onProductSelect(product)}
    >
      <div className="text-center w-full">
        <h2 className="font-semibold text-black text-lg mb-2 truncate">{product.name}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.descriptions}</p>
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

  const handleUpdate = () => {
    if (onProductSelect) {
      const updatedProduct = {...product, price: localPrice};
      onProductSelect(updatedProduct);
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
  onClick={() => onProductSelect && onProductSelect(product)}
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
