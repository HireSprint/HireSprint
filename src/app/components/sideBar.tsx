
import React from 'react';
import { useProductContext } from '../context/productContext';

interface Product {
  id: string;
  name: string;
}

interface SidebarProps {
  selectedProducts: Product[];
  onClose: () => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ selectedProducts, onClose }) => {
    const { client } = useProductContext()
  return (
    <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 z-50">
      <button onClick={onClose} className="mb-4 text-red-500">Close</button>
      <h2 className="text-xl font-bold">Selected Products</h2>
      <p className="text-gray-700">Customer: {client}</p>
      <ul className="mt-4">
        {selectedProducts.length > 0 ? (
          selectedProducts.map(product => (
            <li key={product.id} className="p-2 border-b">
              {product.name}
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
