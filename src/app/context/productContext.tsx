"use client";

import React, {createContext, useContext, useState, useEffect} from 'react';
import {ProductDraggingType, ProductReadyToDrag, ProductTypes} from '@/types/product';
import {categoriesInterface} from '@/types/category';
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
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
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
    const {idCircular, user} = useAuth();


    useEffect(() => {
      const getProductByCircular = async () => {
        if (!idCircular && !user) {
          return
        }
        try {
              const reqBody = {
                  "id_circular":Number(idCircular),
                  "id_client":user.userData.id_client
              }
              const resp = await getProductsByCircular(reqBody)
              setSelectedProducts(resp.result)
              setIsLoadingProducts(false)
          } catch (error) {
              console.error("Error al obtener los productos:", error);
          }
      };

      getProductByCircular();
    }, [idCircular, user]);
    
    console.log(selectedProducts, "selectedProducts")
  
    const updateGridProducts = (gridRange: { min: number; max: number }, circularProducts: ProductTypes[]) => {
      if (!selectedProducts.length || !circularProducts?.length) {
        console.log('No hay datos suficientes para procesar');
        return;
      }

      const productsMap = new Map(
        selectedProducts.map(product => [product.upc.toString(), product])
      );

      const groupsByGrid: { [key: string]: ProductTypes[] } = {};
      
      circularProducts.forEach(product => {
        const gridId = product.id_grid?.toString();
        if (!gridId) return;

        
        const numericGridId = Number(gridId);
        if (numericGridId < gridRange.min || numericGridId > gridRange.max) return;
        
        if (!productsMap.has(product.upc.toString())) return;
        
        if (!groupsByGrid[gridId]) {
          groupsByGrid[gridId] = [];
        }
        
        groupsByGrid[gridId].push(product);
      });
      
      console.log(groupsByGrid, "groupsByGrid")
      
      const multipleProducts = Object.entries(groupsByGrid)
        .filter(([_, products]) => products.length > 1)
        .reduce((acc, [gridId, products]) => {
          acc[gridId] = products;
          return acc;
        }, {} as { [key: string]: ProductTypes[] });

      console.log('Grupos encontrados:', {
        totalGrupos: Object.keys(multipleProducts).length,
        detalleGrupos: multipleProducts
      });

      setGroupedProducts(multipleProducts);
    };

    


    console.log(groupedProducts, "groupedProducts")


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
            setGroupedProducts
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
