"use client";

import React, { createContext, useContext, useState } from 'react';
import { ProductDraggingType, ProductTypes } from '@/types/product';
import { categoriesInterface } from '@/types/category';


interface ProductContextType {
  productsData: ProductTypes[];
  setProductsData: (products: ProductTypes[]) => void;
  selectedProducts: ProductTypes[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductTypes[]>>;
  productArray: ProductTypes[];
  setProductArray: (product: ProductTypes[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  productDragging: ProductDraggingType | null;
  setProductDragging: (product: ProductDraggingType | null ) => void;
  category: categoriesInterface | null;
  setCategory: (category: categoriesInterface | null) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productsData, setProductsData] = useState<ProductTypes[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductTypes[]>([]);
  const [productArray, setProductArray] = useState<ProductTypes[]>([]);
  const [currentPage, setCurrentPage] = useState(2);
  const [productDragging, setProductDragging] = useState<ProductDraggingType | null>(null);
  const [category, setCategory] = useState<categoriesInterface | null>(null);


  return (
        <ProductContext.Provider value={{ productsData, setProductsData, selectedProducts, setSelectedProducts, currentPage, setCurrentPage, productArray, setProductArray, productDragging, setProductDragging, category, setCategory }}>
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
