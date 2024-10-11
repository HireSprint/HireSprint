"use client";

import React, { createContext, useContext, useState } from 'react';

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ProductContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  client: string; 
  setClient: (client: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [client, setClient] = useState<string>(''); // Iniciar como string vacío

  return (
    <ProductContext.Provider value={{ products, setProducts, client, setClient }}>
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