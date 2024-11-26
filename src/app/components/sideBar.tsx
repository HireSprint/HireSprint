"use client.ts";
import React, { useEffect, useRef, useState } from "react";
import { BakeryIcon, DairyIcon, DeliIcon, FrozenIcon, GroceryIcon, LiquorIcon, MeatIcon, SeafoodIcon, FloralIcon, HBIcon, HotFoodIcon, ProduceIcon, BeverageIcon, SnackIcon, } from "./icons";
import { categoriesInterface } from "@/types/category";
import { useCategoryContext } from "../context/categoryContext";
import { useProductContext } from "../context/productContext";
import { ProductTypes } from "@/types/product";
import { Skeleton } from "primereact/skeleton";
import { Message } from "primereact/message";


interface SidebarProps {
  onCategorySelect: (category: categoriesInterface) => void;
  categorySelected: categoriesInterface | null;
}

interface SidebarButton {
  label: string;
  category: categoriesInterface;
  Icon: React.FC<{ isActive: boolean }> | null;
  onClick?: (e: React.MouseEvent) => void;
}

const Sidebar = ({ onCategorySelect, categorySelected }: SidebarProps) => {
  const { categoriesData } = useCategoryContext();
  const { productsData } = useProductContext();
  const [sidebarButtons, setSidebarButtons] = useState<{ main: SidebarButton[]; more: SidebarButton[]; all: SidebarButton[] }>({ main: [], more: [], all: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [showMore, setShowMore] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  const sidebarIcons = [
    { label: "Bakery", Icon: BakeryIcon },
    { label: "Deli", Icon: DeliIcon },
    { label: "Dairy", Icon: DairyIcon },
    { label: "Frozen", Icon: FrozenIcon },
    { label: "Grocery", Icon: GroceryIcon },
    { label: "Liquor-Beer", Icon: LiquorIcon },
    { label: "Meat", Icon: MeatIcon },
    { label: "SeaFood", Icon: SeafoodIcon },
    { label: "Floral", Icon: FloralIcon },
    { label: "H&B-GM", Icon: HBIcon },
    { label: "Hot Foods - (pizza-Sandwich)", Icon: HotFoodIcon },
    { label: "Produce", Icon: ProduceIcon },
    { label: "Beverage", Icon: BeverageIcon },
    { label: "Snack", Icon: SnackIcon },
  ];

  const orderCategoriesByProductCount = (products: ProductTypes[]): number[] => {
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.id_category] = (acc[product.id_category] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(categoryCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([categoryId]) => parseInt(categoryId));
  };

  const generateSidebarButtons = (): { main: SidebarButton[]; more: SidebarButton[]; all: SidebarButton[] } => {
    if (!categoriesData.length || !productsData.length) return { main: [], more: [], all: [] };

    const orderedCategories = orderCategoriesByProductCount(productsData);
    const orderedCategoryMap = new Map(orderedCategories.map((id, index) => [id, index]));

    const sortedCategories = categoriesData.sort((a, b) => {
      const orderA = orderedCategoryMap.get(a.id_category) ?? Infinity;
      const orderB = orderedCategoryMap.get(b.id_category) ?? Infinity;
      return orderA - orderB;
    });

    const buttons: SidebarButton[] = sortedCategories.map((category) => {
      const icon = sidebarIcons.find((btn) => btn.label === category.name_category)?.Icon || null;
      return { label: category.name_category, category, Icon: icon };
    });

    return {
      main: buttons.slice(0, 10),
      more: buttons.slice(10),
      all: buttons
    };
  };

  // Captura la posición del scroll
  useEffect(() => {
    const sidebar = sidebarRef.current;

    if (sidebar) {
      const handleScroll = () => scrollPosition.current = sidebar.scrollTop
      sidebar.addEventListener("scroll", handleScroll);

      return () => {
        sidebar.removeEventListener("scroll", handleScroll);
      };
    }
  }, [sidebarButtons]);


  // Restaura la posición del scroll después del renderizado
  useEffect(() => {
    sidebarRef.current?.scrollTo({ top: scrollPosition.current, behavior: "auto", });
  }, [categorySelected]);

  useEffect(() => {
    setSidebarButtons(generateSidebarButtons());
  }, [categoriesData, productsData]);

  const filteredButtons = sidebarButtons.all.filter(({ label }) =>
    label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isActive = (categoryId: number) => categorySelected?.id_category === categoryId;

  if (!categoriesData.length || !productsData.length) {
    return (
      <div className="h-full flex flex-col items-center bg-white shadow-lg overflow-y-auto no-scrollbar overflow-x-hidden space-y-2 px-1 pt-[75px] pb-8 w-[158px]">
        {
          Array(10).fill(null).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton width="80px" height="80px" />
              <Skeleton width="60px" height="1rem" />
            </div>
          ))
        }
      </div>
    );
  }


  const CategoryButton = ({ category, label, Icon }: { category: categoriesInterface; label:string; Icon: any }) => (
    <div className="flex flex-col items-center w-[145px] text-center group cursor-pointer hover:scale-[1.05]" onClick={() => onCategorySelect(category)} >
      <button className={`w-20 h-20 border-2 ${ isActive(category.id_category) ? "border-[#7cc304]" : "border-[#606060]" } rounded-lg flex items-center justify-center group-hover:border-[#7cc304]`} >
        {Icon && <Icon isActive={isActive(category.id_category)} />}
      </button>

      <p className={`${ isActive(category.id_category) ? "text-[#7cc304]" : "text-[#606060]" } group-hover:text-[#7cc304]`} >
        {label}
      </p>
    </div>
  )

  const categoryList = searchTerm ? filteredButtons : sidebarButtons.main
  return (
    <div ref={sidebarRef} className="h-full flex flex-col items-center bg-white shadow-lg overflow-y-auto no-scrollbar overflow-x-hidden space-y-4 px-1 pb-8 w-[158px]">
      <input type="text" placeholder="Find Category" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="text-black p-2 mt-2 mb-3 border border-gray-300 rounded w-[130px]" />

      {
        searchTerm && filteredButtons.length === 0 ?
        (
          <Message
            style={{ borderLeft: "6px solid #b91c1c", color: "#b91c1c" }}
            className="w-full max-w-[130px]"
            severity="error"
            text="Category not found"
          />
        )
        :
        categoryList.map(({ category, label, Icon }) => (
          <CategoryButton key={category.id_category} category={category} label={label} Icon={Icon} />
        ))
      }

      {!searchTerm &&
        (
          <div className="flex flex-col items-center space-y-4">
            <button type="button" className="w-[120px] bg-[#7cc304] text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors" onClick={() => setShowMore(!showMore)} >
              {showMore ? "Hide" : "Show More"}
            </button>

            {
              showMore &&
              sidebarButtons.more.map(({ category, label, Icon }) => (
                <CategoryButton  key={category.id_category} category={category} label={label} Icon={Icon} />
              ))
            }
          </div>
        )
      }
    </div>
  );
};

export default Sidebar;
