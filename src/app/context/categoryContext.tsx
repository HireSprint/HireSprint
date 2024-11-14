import React, { createContext, useContext, useEffect, useState } from "react";
import { categoriesInterface } from "@/types/category";

interface CategoryContextType {
  categoriesData: categoriesInterface[];
  isLoadingCategories: boolean;
  getCategoryByName: ( categoryName:string ) => categoriesInterface | undefined
}

const categoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categoriesData, setCategories] = useState<categoriesInterface[]>([]);
  const [isLoadingCategories, setIsLoading] = useState(true);

  useEffect(() => {
    const getProductView = async () => {
      try {
        const resp = await fetch("/api/apiMongo/getCategories");
        const data = await resp.json();
        
        if(resp.status === 200){
          setCategories(data.result);
          setIsLoading(false);
        }else{
          console.error("Error al obtener los productos:", resp);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    
    getProductView();
  }, []);


  const getCategoryByName = (categoryName: string): categoriesInterface | undefined => {
    if (categoriesData.length == 0) return;
    return categoriesData.find((category)=> category.name_category == categoryName )
  }

  return (
    <categoryContext.Provider value={{ categoriesData, isLoadingCategories, getCategoryByName }}>
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
