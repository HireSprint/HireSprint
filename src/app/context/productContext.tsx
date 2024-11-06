"use client";

import React, { createContext, useContext, useState } from 'react';
import { ProductTypes } from '@/types/product';


interface ProductContextType {
    products: ProductTypes[];
    setProducts: (products: ProductTypes[]) => void;
    client: string; 
    setClient: (client: string) => void;
    selectedProduct: ProductTypes | null;
    setSelectedProduct: (product: ProductTypes | null) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [client, setClient] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductTypes | null>(null);
  const [currentPage, setCurrentPage] = useState(2); 

  return (
    <ProductContext.Provider value={{ products, setProducts, client, setClient, selectedProduct, setSelectedProduct, currentPage, setCurrentPage }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext debe ser usado dentro de un ProductProvider");
  }
  return context;
};