"use client";
import React, { useEffect, useRef, useState } from "react";
import { BakeryIcon, DairyIcon, DeliIcon, FrozenIcon, GroceryIcon, LiquorIcon, MeatIcon, SeafoodIcon, FloralIcon, HBIcon, HotFoodIcon, ProduceIcon, BeverageIcon, SnackIcon, CircleArrowIcon, ArrowIcon, } from "./icons";
import { categoriesInterface } from "@/types/category";
import { useCategoryContext } from "../context/categoryContext";
import { useProductContext } from "../context/productContext";
import { ProductTypes } from "@/types/product";
import { Skeleton } from "primereact/skeleton";


interface BottomBarProps {
  onCategorySelect: (category: categoriesInterface) => void;
  categorySelected: categoriesInterface | null;
  onClick?: () => void;
}

interface BottomBarButton {
  label: string;
  category: categoriesInterface;
  Icon: React.FC<{ isActive: boolean }> | null;
  onClick?: (e: React.MouseEvent) => void;
}

const BottomBar = ({ onCategorySelect, categorySelected, onClick }: BottomBarProps) => {
  const { categoriesData } = useCategoryContext();
  const { productsData } = useProductContext();
  const [bottomBarButtons, setBottomBarButtons] = useState<{ main: BottomBarButton[]; more: BottomBarButton[]; all: BottomBarButton[] }>({ main: [], more: [], all: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);


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

  // ordenamiento de las categorias dependiendo del numero de productos que haya registrado en cada categoria
  const orderCategoriesByProductCount = (products: ProductTypes[]): number[] => {
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.id_category] = (acc[product.id_category] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(categoryCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([categoryId]) => parseInt(categoryId));
  };

  // division de los botones para mostrar los productos default y los que se muestran al presionar ver mas categorias
  const generateBottomBarButtons = (): { main: BottomBarButton[]; more: BottomBarButton[]; all: BottomBarButton[] } => {
    if (!categoriesData.length || !productsData.length) return { main: [], more: [], all: [] };

    const orderedCategories = orderCategoriesByProductCount(productsData);
    const orderedCategoryMap = new Map(orderedCategories.map((id, index) => [id, index]));

    const sortedCategories = categoriesData.sort((a, b) => {
      const orderA = orderedCategoryMap.get(a.id_category) ?? Infinity;
      const orderB = orderedCategoryMap.get(b.id_category) ?? Infinity;
      return orderA - orderB;
    });

    const buttons: BottomBarButton[] = sortedCategories.map((category) => {
      const icon = sidebarIcons.find((btn) => btn.label === category.name_category)?.Icon || null;
      return { label: category.name_category, category, Icon: icon };
    });

    return {
      main: buttons.slice(0, 14),
      more: buttons.slice(14),
      all: buttons
    };
  };


  // verifica si se debe mostar los botones de scroll
  const checkScroll = () => {
    if (bottomBarRef.current) {
      const hasHorizontalScroll = bottomBarRef.current.scrollWidth > bottomBarRef.current.clientWidth;
      setShowScrollButtons(hasHorizontalScroll);
      checkScrollButtons();
    }
  };

  // verificar si se puede hacer scroll hacia la izquierda o derecha
  const checkScrollButtons = () => {
    if (bottomBarRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = bottomBarRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Captura la posición del scroll
  useEffect(() => {
    const bottomBar = bottomBarRef.current;

    if (bottomBar) {
      const handleScroll = () => {
        scrollPosition.current = bottomBar.scrollLeft
        checkScrollButtons();
      }

      bottomBar.addEventListener("scroll", handleScroll);

      return () => {
        bottomBar.removeEventListener("scroll", handleScroll);
      };
    }
  }, [bottomBarButtons]);


  // ocultar las categorias extras cuando se ocultan las categorias
  useEffect(() => {
    setShowMore(false);
    checkScroll();
  }, [showCategories]);

  // Restaura la posición del scroll después del renderizado
  useEffect(() => (bottomBarRef.current?.scrollTo({ left: scrollPosition.current, behavior: "auto", })), [categorySelected]);

  // seteo de los botones del bottomBar
  useEffect(() => (setBottomBarButtons(generateBottomBarButtons())), [categoriesData, productsData]);

  // verificar si necesita mostrar los botones de scroll
  useEffect(() => (checkScroll()), [showMore]);

  // view scroll of the bottomBar
  useEffect(() => {
    checkScroll();
    // Opcional: agregar listener para cambios de tamaño de ventana
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);


  // filtrado de las categorias
  const filteredButtons = bottomBarButtons.all.filter(({ label }) =>
    label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isActive = (categoryId: number) => categorySelected?.id_category === categoryId;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!categoriesData.length || !productsData.length) {
    return (
      <div className="bg-white shadow-up-lg p-2">
          <Skeleton width="120px" height="35px" className="skeleton-none-mb" />
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <button
        className="bg-white text-black px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
        onClick={() => {
          setShowCategories(!showCategories);
          onClick?.();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Show Categories
      </button>

      {showCategories && (
        <div className="absolute bottom-16 bg-white rounded-lg shadow-xl w-64 py-2 border border-gray-200 text-black">
          <div className="max-h-96 overflow-y-auto">
            {categoriesData?.map((category) => (
              <button
                key={category.id_category}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200"
                onClick={() => {
                  onCategorySelect(category);
                  setShowCategories(false);
                }}
              >
                {category.name_category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomBar;
