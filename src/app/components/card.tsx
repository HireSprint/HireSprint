"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Tag } from "lucide-react";


interface Product {
  id: string;
  name: string;
  descriptions: string;
  image: string;
  price?: number;
  condition?: string;
}

interface CardProductProps {
  product: Product;
  onProductSelect?: (product: Product) => void; 
  onPriceChange?: (id: string, price: number) => void; 
}

export const CardProduct: React.FC<CardProductProps> = ({ product, onProductSelect }) => {
  return (
    <div 
      className=" shrink-0 flex bg-white p-2 grid grid-cols-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer w-48 h-36" 
      onClick={() => onProductSelect && onProductSelect(product)}
    >
      <div className="z-10 w-36">
        <p className="font-semibold text-black text-lg mb-2 ">{product.name}</p>
          <p className="text-gray-600 text-sm mb-4">{product.descriptions || "No description"}</p>
      </div>
      <div className=" flex items-center ">
        {product.image ? (
          <Image
          src={product.image}
          alt={product.name}
          width={100}
          height={100}
          
          />
        ) : (
          <div className=" bg-gray-200 rounded-lg flex items-center justify-center">
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
    <div className="border rounded-lg shadow-md pl-1 flex flex-col text-pretty ">
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

export function ProductCard({ product, onProductSelect }: CardProductProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image container with responsive behavior */}
        <div className="md:w-1/2 min-h-[200px] md:min-h-[300px] relative">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content container */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-2">{product.name}</h2>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>

            <p className="text-gray-600 line-clamp-3 md:line-clamp-4">{product.descriptions}</p>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-600">
                  ${product.price?.toFixed(2)}
                </span>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

