"use client";

import React, { createContext, useContext, useState } from 'react';
import { ProductTypes } from '@/types/product';


interface ProductContextType {
  productsData: ProductTypes[];
  setProductsData: (products: ProductTypes[]) => void;
  selectedProducts: ProductTypes[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductTypes[]>>;
  productArray: ProductTypes[];
  setProductArray: (product: ProductTypes[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isSendModalOpen: boolean;
  setIsSendModalOpen: (isOpen: boolean) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productsData, setProductsData] = useState<ProductTypes[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductTypes[]>([]);
  const [productArray, setProductArray] = useState<ProductTypes[]>([]);
  const [currentPage, setCurrentPage] = useState(2); 
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  return (
        <ProductContext.Provider value={{ productsData, setProductsData, selectedProducts, setSelectedProducts, currentPage, setCurrentPage, productArray, setProductArray, isSendModalOpen, setIsSendModalOpen }}>
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