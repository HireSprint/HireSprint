"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { categoriesInterface } from "@/types/category";
import { ProductTypes } from "@/types/product";

interface CategoryContextType {
  categoriesData: categoriesInterface[];
  isLoadingCategories: boolean;
  getCategoryByName: (categoryName: string) => categoriesInterface | undefined;
  getCategoryById: (categoryId: number) => categoriesInterface | undefined;
  getProductsByCategory: (categoryId: number, page: number) => Promise<ProductTypes[]>;
  isLoadingProducts: boolean;
  selectedProductCategory: ProductTypes[];
  setSelectedProductCategory: (products: ProductTypes[]) => void;
}

const categoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categoriesData, setCategories] = useState<categoriesInterface[]>([]);
  const [isLoadingCategories, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedProductCategory, setSelectedProductCategory] = useState<ProductTypes[]>([]);

  useEffect(() => {
    const getProductView = async () => {
      try {
        const resp = await fetch("/api/apiMongo/getCategories");
        const data = await resp.json();

        if (resp.status === 200) {
          setCategories(data.result);
          setIsLoading(false);
        } else {
          console.error("Error al obtener las categorías:", resp);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setIsLoading(false);
      }
    };

    getProductView();
  }, []);

  const getProductsByCategory = async (categoryId: number, page: number): Promise<ProductTypes[]> => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch('https://hiresprintcanvas.dreamhosters.com/getProductsByCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: categoryId,
          page: page
        })
      });

      const data = await response.json();
      const prodctActive = data.result.filter((product: ProductTypes) => product.status_active);
      setSelectedProductCategory(prodctActive);
      return prodctActive || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const getCategoryByName = (categoryName: string): categoriesInterface | undefined => {
    if (categoriesData.length == 0) return;
    return categoriesData.find((category) => category.name_category == categoryName);
  };

  const getCategoryById = (categoryId: number): categoriesInterface | undefined => {
    if (categoriesData.length == 0) return;
    return categoriesData.find((category) => category.id_category == categoryId);
  };

  return (
    <categoryContext.Provider 
      value={{ 
        categoriesData, 
        isLoadingCategories, 
        getCategoryByName, 
        getCategoryById,
        getProductsByCategory,
        isLoadingProducts,
        selectedProductCategory,
        setSelectedProductCategory
      }}
    >
      {children}
    </categoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(categoryContext);

  if (!context)
    throw new Error(
      "useCategoryContext debe ser usado dentro de un CategoryProvider"
    );

  return context;
};
