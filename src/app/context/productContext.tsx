"use client";

import React, { createContext, useContext, useState } from 'react';
import { ProductDraggingType, ProductReadyToDrag, ProductTypes } from '@/types/product';
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
  productReadyDrag: ProductReadyToDrag | null;
  setProductReadyDrag: (product: ProductReadyToDrag | null ) => void;
  category: categoriesInterface | null;
  setCategory: (category: categoriesInterface | null) => void;
  isLoadingProducts: boolean;
  setIsLoadingProducts: ( arg: boolean ) => void;
  isSendModalOpen: boolean;
  setIsSendModalOpen: (value: boolean) => void;
  scale: number;
  setScale(scale: number): void;
  scaleSubPagines: number;
  setScaleSubPagines: (scaleSubPagines: number) => void;
  panningOnPage1: boolean;
  setPanningOnPage1: (panningOnPage1: boolean) => void;
  panningOnSubPage: boolean;
  setPanningOnSubPage: (panningOnSubPage: boolean) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productsData, setProductsData] = useState<ProductTypes[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductTypes[]>([]);
  const [productArray, setProductArray] = useState<ProductTypes[]>([]);
  const [currentPage, setCurrentPage] = useState(2);
  const [productDragging, setProductDragging] = useState<ProductDraggingType | null>(null);
  const [productReadyDrag, setProductReadyDrag] = useState<ProductDraggingType | null>(null);
  const [category, setCategory] = useState<categoriesInterface | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [scale, setScale] = useState(0);
  const [scaleSubPagines, setScaleSubPagines] = useState(0);
  const [panningOnPage1, setPanningOnPage1] = useState(true);
  const [panningOnSubPage, setPanningOnSubPage] = useState(true);
  return (
    <ProductContext.Provider value={{ productsData, setProductsData, selectedProducts, setSelectedProducts, currentPage, setCurrentPage, productArray, setProductArray, productDragging, setProductDragging, category, setCategory, productReadyDrag, setProductReadyDrag, isLoadingProducts, setIsLoadingProducts, isSendModalOpen, setIsSendModalOpen, scale, setScale, scaleSubPagines, setScaleSubPagines,
      panningOnPage1,
      setPanningOnPage1,
      panningOnSubPage,
      setPanningOnSubPage, }}>
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
