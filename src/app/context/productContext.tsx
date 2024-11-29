"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProductDraggingType, ProductReadyToDrag, ProductTypes } from '@/types/product';
import { categoriesInterface } from '@/types/category';
import { useAuth } from '../components/provider/authprovider';
import { safeLocalStorage } from '../utils/localStore';


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
  const { idCircular } = useAuth();

  useEffect(() => {
    if (idCircular && typeof window !== 'undefined') {
        const storedProducts = localStorage.getItem('circularProducts');
        if (storedProducts) {
            const productsMap = JSON.parse(storedProducts);
            const circularProducts = productsMap[idCircular] || {};
            
            // Obtener todos los productos de todas las páginas y combinarlos
            const allProducts = Object.values(circularProducts).reduce((acc: ProductTypes[], products: any) => {
                return acc.concat(products);
            }, []);
            
            setSelectedProducts(allProducts as ProductTypes[]);
        }
    }
}, [idCircular]);

  // Función para actualizar productos
  const updateSelectedProducts: React.Dispatch<React.SetStateAction<ProductTypes[]>> = (newProductsOrFn) => {
    if (idCircular && typeof window !== 'undefined') {
        const newProducts = typeof newProductsOrFn === 'function' 
            ? newProductsOrFn(selectedProducts) 
            : newProductsOrFn;
            
        const storedProducts = localStorage.getItem('circularProducts');
        const productsMap = storedProducts ? JSON.parse(storedProducts) : {};
        
        if (!productsMap[idCircular]) {
            productsMap[idCircular] = {};
        }

        // Mantener los productos existentes en otras páginas
        const existingPages = productsMap[idCircular];
        
        // Agrupar los nuevos productos por página
        const productsByPage = newProducts.reduce((acc: {[key: number]: ProductTypes[]}, product) => {
            if (product.id_grid) {
                let pageNumber;
                if (product.id_grid >= 1001 && product.id_grid <= 1999) pageNumber = 1;
                else if (product.id_grid >= 2001 && product.id_grid <= 2999) pageNumber = 2;
                else if (product.id_grid >= 3001 && product.id_grid <= 3999) pageNumber = 3;
                else if (product.id_grid >= 4001 && product.id_grid <= 4999) pageNumber = 4;

                if (pageNumber) {
                    acc[pageNumber] = acc[pageNumber] || [];
                    acc[pageNumber].push(product);
                }
            }
            return acc;
        }, {...existingPages}); // Mantener productos existentes

        productsMap[idCircular] = productsByPage;
        safeLocalStorage.setItem('circularProducts', productsMap);  
        setSelectedProducts(newProducts);
    }
  };
  
  return (
    <ProductContext.Provider value={{ productsData, setProductsData, selectedProducts, setSelectedProducts: updateSelectedProducts, currentPage, setCurrentPage, productArray, setProductArray, productDragging, setProductDragging, category, setCategory, productReadyDrag, setProductReadyDrag, isLoadingProducts, setIsLoadingProducts, isSendModalOpen, setIsSendModalOpen }}>
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

function isProductType(product: unknown): product is ProductTypes {
    return product !== null && 
           typeof product === 'object' && 
           'id_grid' in product; // agregar más propiedades necesarias
}
