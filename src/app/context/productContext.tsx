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
          try {
              const reqBody = {
                  "id_circular":Number(idCircular),
                  "id_client":user.userData.id_client
              }
              const resp = await getProductsByCircular(reqBody)
              setProductsData(resp.result)
              setIsLoadingProducts(false)
          } catch (error) {
              console.error("Error al obtener los productos:", error);
          }
      };

      getProductByCircular();
  }, [idCircular, user]);

  
    const updateGridProducts = (gridRange: { min: number; max: number }, circularProducts: ProductTypes[]) => {
      if (productsData.length && circularProducts?.length > 0) {
        const productsMap = new Map(
          productsData.map(product => [product.upc.toString(), product])
        );
  
        const gridFilled = circularProducts
          .filter(circularProduct => {
            const gridId = Number(circularProduct.id_grid) || 0;
            const isInRange = gridId >= gridRange.min && gridId <= gridRange.max;
            return isInRange && productsMap.has(circularProduct.upc.toString());
          })
          .map(circularProduct => {
            const baseProduct = productsMap.get(circularProduct.upc.toString())!;
            return {
              ...baseProduct,
              id_grid: circularProduct.id_grid,
              price: circularProduct.price || baseProduct.price,
              burst: circularProduct.burst,
              addl: circularProduct.addl,
              limit: circularProduct.limit,
              must_buy: circularProduct.must_buy,
              with_card: circularProduct.with_card
            };
          });
  
        setSelectedProducts(prevProducts => {
          const otherGridProducts = prevProducts.filter(p => {
            const gridId = Number(p.id_grid) || 0;
            return gridId < gridRange.min || gridId > gridRange.max;
          });
          return [...otherGridProducts, ...gridFilled];
        });
  
        // Para productos múltiples (como en ImageGrid2)
        const multipleProducts: { [key: string]: ProductTypes[] } = {};
        gridFilled.forEach(product => {
          const gridId = product.id_grid?.toString();
          if (gridId && gridFilled.filter(p => p.id_grid === product.id_grid).length > 1) {
            if (!multipleProducts[gridId]) {
              multipleProducts[gridId] = [];
            }
            multipleProducts[gridId].push(product);
          }
        });
        setGroupedProducts(multipleProducts);
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
