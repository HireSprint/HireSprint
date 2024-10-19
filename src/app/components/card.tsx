"use client";
import Image from "next/image";
import { useEffect, useState } from "react";


interface Product {
  id: string;
  name: string;
  image: string;
}

interface CardProductProps {
  product: Product;
  onProductSelect?: (product: Product) => void; 
}

export const CardProduct: React.FC<CardProductProps> = ({ product, onProductSelect }) => {
  return (
    <div 
      className="border rounded-lg shadow-md p-4 hover:shadow-lg cursor-pointer flex-shrink-0 " 
      onClick={() => onProductSelect && onProductSelect(product)}
    >
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}
      <div className="">
        <h2 className="font-semibold text-black ">{product.name}</h2>
      </div>
    </div>
  );
};

export const CardSide: React.FC<CardProductProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState(true); 
  const [showImage, setShowImage] = useState(false); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 5000); 

    return () => clearTimeout(timer); 
  }, []);

  const handleImageLoad = () => setIsLoading(false);

  return (
    <div className="border rounded-lg shadow-md pl-1 flex flex-col text-pretty">
      
      {showImage && product.image ? (
        <div>
        <p className="font-semibold text-black">{product.name}</p>
        <Image
        src={product.image}
        alt={product.name}
        width={100}
        height={100}
        className="rounded object-cover"
        onLoadingComplete={handleImageLoad} 
        />
        </div>
      ) : (
        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
          {isLoading ? (
            <span className="text-gray-500">Cargando...</span> 
          ) : (
            <span className="text-gray-500">No Image</span> 
          )}
        </div>
      )}
    </div>
  );
};
