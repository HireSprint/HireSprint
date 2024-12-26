"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductDraggingType, ProductReadyToDrag, ProductTypes } from '@/types/product';
import { categoriesInterface } from '@/types/category';
import { getProductsByCircular } from '@/pages/api/apiMongo/getProductsByCircular';
import { useAuth } from '../components/provider/authprovider';

interface GroupedProducts {
  [key: string]: ProductTypes[];
}

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
  setProductDragging: (product: ProductDraggingType | null) => void;
  productReadyDrag: ProductReadyToDrag | null;
  setProductReadyDrag: (product: ProductReadyToDrag | null) => void;
  category: categoriesInterface | null;
  setCategory: (category: categoriesInterface | null) => void;
  isLoadingProducts: boolean;
  setIsLoadingProducts: (arg: boolean) => void;
  isSendModalOpen: boolean;
  setIsSendModalOpen: (value: boolean) => void;
  scale: number;
  setScale(scale: number): void;
  scaleSubPagines: boolean;
  setScaleSubPagines: (scaleSubPagines: boolean) => void;
  panningOnPage1: boolean;
  setPanningOnPage1: (panningOnPage1: boolean) => void;
  panningOnSubPage: boolean;
  setPanningOnSubPage: (panningOnSubPage: boolean) => void;
  zoomScalePage1: number;
  setZoomScalePage1: (zoomScalePage1: number) => void;
  zoomScaleSubPagines: number;
  setZoomScaleSubPagines: (zoomScaleSubPagines: number) => void;
  groupedProducts: GroupedProducts;
  setGroupedProducts: (groupedProducts: GroupedProducts) => void;
  updateGridProducts: (gridRange: { min: number; max: number }, circularProducts: ProductTypes[]) => void;
  panelShowCategoriesOpen: boolean;
  setPanelShowCategoriesOpen: (showCategories: boolean) => void;
  isLoadingGridProducts: boolean;
  setIsLoadingGridProducts: (loading: boolean) => void;
  autoSaveVarieties: boolean;
  setAutoSaveVarieties: (autoSaveVarieties: boolean) => void;
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
  const [scaleSubPagines, setScaleSubPagines] = useState(false);
  const [panningOnPage1, setPanningOnPage1] = useState(true);
  const [panningOnSubPage, setPanningOnSubPage] = useState(true);
  const [zoomScalePage1, setZoomScalePage1] = useState(1);
  const [zoomScaleSubPagines, setZoomScaleSubPagines] = useState(1);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const { idCircular, user } = useAuth();
  const [panelShowCategoriesOpen, setPanelShowCategoriesOpen] = useState(false);
  const [isLoadingGridProducts, setIsLoadingGridProducts] = useState(false);
  const [autoSaveVarieties, setAutoSaveVarieties] = useState(false);
    

  useEffect(() => {
    const getProductByCircular = async () => {
      if (!idCircular && !user) {
        return
      }
      try {
        const reqBody = {
          "id_circular": Number(idCircular),
          "id_client": user.userData.id_client
        }
        const resp = await getProductsByCircular(reqBody)
        setSelectedProducts(resp.result)
        setProductsData(resp.result)
        setIsLoadingProducts(false)
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    getProductByCircular();
  }, [idCircular, user]);

  const productWithCard = productsData.filter(product => product.with_card)
  console.log(productWithCard, "productWithCard")


  const updateGridProducts = async (gridRange: { min: number; max: number }, circularProducts: ProductTypes[]) => {
    setIsLoadingGridProducts(true);
    
    try {
      if (!selectedProducts.length || !circularProducts?.length) {
        return;
      }

      const existingGroups = { ...groupedProducts };
      
      const productsMap = new Map(
        selectedProducts.map(product => [product.upc.toString(), product])
      );

      const groupsByGrid: { [key: string]: ProductTypes[] } = {};

      circularProducts.forEach(product => {
        const gridId = product.id_grid?.toString();
        if (!gridId) return;

        if (!groupsByGrid[gridId]) {
          groupsByGrid[gridId] = [];
        }
        if (productsMap.has(product.upc.toString())) {
          groupsByGrid[gridId].push(product);
        }
      });

      const combinedGroups = {
        ...existingGroups,
        ...Object.entries(groupsByGrid)
          .filter(([_, products]) => products.length > 1)
          .reduce((acc, [gridId, products]) => {
            acc[gridId] = products;
            return acc;
          }, {} as { [key: string]: ProductTypes[] })
      };

      await new Promise(resolve => setTimeout(resolve, 100));
      setGroupedProducts(combinedGroups);
    } finally {
      setIsLoadingGridProducts(false);
    }
  };

  return (
    <ProductContext.Provider value={{
      productsData,
      setProductsData,
      selectedProducts,
      setSelectedProducts,
      currentPage,
      setCurrentPage,
      productArray,
      setProductArray,
      productDragging,
      setProductDragging,
      category,
      setCategory,
      productReadyDrag,
      setProductReadyDrag,
      isLoadingProducts,
      setIsLoadingProducts,
      isSendModalOpen,
      setIsSendModalOpen,
      scale,
      setScale,
      scaleSubPagines,
      setScaleSubPagines,
      zoomScalePage1,
      setZoomScalePage1,
      zoomScaleSubPagines,
      setZoomScaleSubPagines,
      panningOnPage1,
      setPanningOnPage1,
      panningOnSubPage,
      setPanningOnSubPage,
      updateGridProducts,
      groupedProducts,
      setGroupedProducts,
      panelShowCategoriesOpen,
      setPanelShowCategoriesOpen,
      isLoadingGridProducts,
      setIsLoadingGridProducts, 
      autoSaveVarieties, 
      setAutoSaveVarieties,
    }}>
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
