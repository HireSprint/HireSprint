"use client"
import Image from "next/image"

interface Product {
    name: string;
    image: string;
  }
  
  const CardProduct = ({ product }: { product: Product }) => {
    return (
      <div className="border rounded-lg shadow-md p-4 max-w-xs">
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name} 
            width={500}
            height={500}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">{product.name}</h2>
        </div>
      </div>
    );
  };
  
  
  

export default CardProduct