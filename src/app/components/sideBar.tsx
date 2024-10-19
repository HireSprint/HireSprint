
import React from 'react';
import { useProductContext } from '../context/productContext';
import { CardSide } from './card';

interface Product {
  id: string;
  name: string;
  image: string;
  gridId?: number;
}
interface SidebarProps {
  selectedProducts: Product[];
  onClose: () => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ selectedProducts, onClose }) => {
    const { client } = useProductContext()
  return (
    <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto">
    <button onClick={onClose} className="mb-4 text-red-500">Close</button>
    <h2 className="text-xl font-bold text-black">Selected Products</h2>
    <p className="text-gray-700">Customer: {client}</p>
    <ul className="mt-4 space-y-2 ">
      {selectedProducts.length > 0 ? (
        selectedProducts.map((product, index) => (
          <li key={product.id} className="text-sm text-black">
            <span className="font-bold">{index + 1}.</span> {product.name} - 
            <span className="text-gray-500"> G.{product.gridId}</span>
            <CardSide product={product} />
          </li>
        ))
      ) : (
        <li>No products selected.</li>
      )}
    </ul>
  </div>
);
};

export default Sidebar;
