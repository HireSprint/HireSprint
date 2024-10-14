"use client";
import Image from "next/image";


interface Product {
  id: string;
  name: string;
  image: string;
}

interface CardProductProps {
  product: Product;
  onProductSelect: (product: Product) => void; 
}

const CardProduct: React.FC<CardProductProps> = ({ product, onProductSelect }) => {
  return (
    <div 
      className="border rounded-lg shadow-md p-4 hover:shadow-lg cursor-pointer flex-shrink-0 w-64" 
      onClick={() => onProductSelect(product)} 
    >
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
      <div className="">
        <h2 className="font-semibold text-black ">{product.name}</h2>
      </div>
    </div>
  );
};

export default CardProduct;