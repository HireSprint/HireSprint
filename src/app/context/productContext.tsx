"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProductTypes } from '@/types/product';
import { getCategories } from '../api/apiMongo/getCategories';


interface ProductContextType {
  productsData: ProductTypes[];
  setProductsData: (products: ProductTypes[]) => void;
  client: string; 
  setClient: (client: string) => void;
  selectedProducts: ProductTypes[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductTypes[]>>;
  productArray: ProductTypes[];
  setProductArray: (product: ProductTypes[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productsData, setProductsData] = useState<ProductTypes[]>([]);
  const [client, setClient] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<ProductTypes[]>([]);
  const [productArray, setProductArray] = useState<ProductTypes[]>([]);
  const [currentPage, setCurrentPage] = useState(2); 


  useEffect(() => {
    const getCategoriesView = async () => {
      const resp = await getCategories();
      setProductsData(resp.result);
    }
    getCategoriesView();
  }, [])

  return (
        <ProductContext.Provider value={{ productsData, setProductsData, client, setClient, selectedProducts, setSelectedProducts, currentPage, setCurrentPage, productArray, setProductArray }}>
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