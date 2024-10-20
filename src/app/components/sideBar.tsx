import React, { useState } from 'react';
import { useProductContext } from '../context/productContext';
import { CardSide } from './card';
import { saveAs } from 'file-saver';

interface Product {
  id: string;
  name: string;
  image: string;
  gridId?: number;
  price?: number; 
}
interface SidebarProps {
  selectedProducts: Product[];
  onClose: () => void; 
}


const Sidebar: React.FC<SidebarProps> = ({ selectedProducts, onClose }) => {
    const [localProducts, setLocalProducts] = useState(selectedProducts);
    const { client } = useProductContext();
    
    const calculateTotal = () => {
      return localProducts.reduce((total, product) => total + (product.price || 0), 0);
    };

    const generateXML = () => {
      let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xmlContent += '<productos>\n';
      
      localProducts.forEach((product) => {
        xmlContent += '  <producto>\n';
        xmlContent += `    <id>${product.id}</id>\n`;
        xmlContent += `    <nombre>${product.name}</nombre>\n`;
        xmlContent += `    <imagen>${product.image}</imagen>\n`;
        xmlContent += `    <precio>${product.price?.toFixed(2) || 'N/A'}</precio>\n`;
        xmlContent += '  </producto>\n';
      });
      
      xmlContent += '</productos>';
      
      return xmlContent;
    };

    const downloadXML = () => {
      const xmlContent = generateXML();
      const blob = new Blob([xmlContent], { type: 'text/xml;charset=utf-8' });
      saveAs(blob, 'productos_seleccionados.xml');
    };

    const handlePriceChange = (id: string, newPrice: number) => {
      setLocalProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? {...product, price: newPrice} : product
        )
      );
    };

    const handleProductSelect = (updatedProduct: Product) => {
      setLocalProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
    };

    return (
      <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto">
        <button onClick={onClose} className="mb-4 text-red-500">Cerrar</button>
        <h2 className="text-xl font-bold text-black">Productos Seleccionados</h2>
        <p className="text-gray-700">Cliente: {client}</p>
        <ul className="mt-4 space-y-2">
          {localProducts.length > 0 ? (
            localProducts.map((product, index) => (
              <li key={product.id} className="text-sm text-black">
                <span className="font-bold">{index + 1}.</span> {product.name} - 
                <span className="text-gray-500"> G.{product.gridId}</span>
                {product.price !== undefined && (
                  <span className="text-green-600"> ${product.price.toFixed(2)}</span>
                )}
                <CardSide 
                  product={product}
                  onPriceChange={handlePriceChange}
                  onProductSelect={handleProductSelect}
                />
              </li>
            ))
          ) : (
            <li>No hay productos seleccionados.</li>
          )}
        </ul>
        <button onClick={downloadXML} className="mt-4 bg-green-500 text-white p-2 rounded">
          Descargar XML
        </button>
      </div>
    );
};

export default Sidebar;
