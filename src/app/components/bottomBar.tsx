"use client.ts";
import React, { useEffect, useRef, useState } from "react";
import { BakeryIcon, DairyIcon, DeliIcon, FrozenIcon, GroceryIcon, LiquorIcon, MeatIcon, SeafoodIcon, FloralIcon, HBIcon, HotFoodIcon, ProduceIcon, BeverageIcon, SnackIcon, CircleArrowIcon, ArrowIcon, } from "./icons";
import { categoriesInterface } from "@/types/category";
import { useCategoryContext } from "../context/categoryContext";
import { useProductContext } from "../context/productContext";
import { ProductTypes } from "@/types/product";
import { Skeleton } from "primereact/skeleton";
import { Message } from "primereact/message";
import { Tooltip } from 'primereact/tooltip';


interface BottomBarProps {
  onCategorySelect: (category: categoriesInterface) => void;
  categorySelected: categoriesInterface | null;
}

interface BottomBarButton {
  label: string;
  category: categoriesInterface;
  Icon: React.FC<{ isActive: boolean }> | null;
  onClick?: (e: React.MouseEvent) => void;
}

const BottomBar = ({ onCategorySelect, categorySelected }: BottomBarProps) => {
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
  const tooltipRef = useRef<Tooltip>(null);


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

  // Función para manejar el scroll horizontal
  const handleWheel = (event: any) => {
    if (bottomBarRef.current) {
      bottomBarRef.current.scrollLeft += event.deltaY;
      event.stopPropagation();
    }
  };

  
  // movescroll dynamically
  const handleManualScroll = ({direction}: { direction: "left" | "right" }) => {
    if (bottomBarRef.current) {
      const move = direction === "left" ? -400 : 400;
      bottomBarRef.current.scrollBy({ left: move, behavior: 'smooth' });
    }
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


  if (!categoriesData.length || !productsData.length) {
    return (
      <div className="bg-white shadow-up-lg p-2">
          <Skeleton width="120px" height="35px" className="skeleton-none-mb" />
      </div>
    );
  }

  // html del boton
  const CategoryButton = ({ category, label, Icon }: { category: categoriesInterface; label:string; Icon: any }) => (
    <div className="flex flex-col items-center min-w-[125px] text-center group cursor-pointer hover:scale-[1.05]" onClick={() => onCategorySelect(category)} >
      <button className={`w-16 h-16 border-2 ${ isActive(category.id_category) ? "border-[#7cc304]" : "border-[#606060]" } rounded-lg flex items-center justify-center group-hover:border-[#7cc304]`} >
        {Icon && <Icon isActive={isActive(category.id_category)} />}
      </button>

      <p className={`text-sm ${ isActive(category.id_category) ? "text-[#7cc304]" : "text-[#606060]" } group-hover:text-[#7cc304]`} >
        {label}
      </p>
    </div>
  )

  // listado a utilizar dependiendo si esta filtrando o si se esta mostrando todo o solo los principales
  const categoryList = searchTerm ? filteredButtons : showMore ?  [...bottomBarButtons.main, ...bottomBarButtons.more ] : bottomBarButtons.main

  return (
    <div  className="grid grid-rows-[1fr_min-content] bg-white shadow-up-lg p-2">
      
      {/* barra de tareas */}
      <div className="flex justify-between gap-4">
        <div className="flex gap-4">
          <button type="button" className="w-[120px] bg-[#7cc304] text-white p-1 rounded-md hover:bg-green-600 transition-colors" onClick={() => setShowCategories(!showCategories)} >
            <span className="text-sm">{ showCategories ? "Hide Categories" : "Show Categories" }</span> 
          </button>

          {
            <div className={`flex gap-4 overflow-hidden transition-all duration-300 ${ showCategories ? "max-w-[210px]" : "max-w-0" }`}>
              <input type="text" placeholder="Find Category" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="text-black p-2 border border-gray-300 rounded w-[150px] h-[35px]" />

              <Tooltip target="#show-more-btn" ref={tooltipRef} content={ showMore ? "Hide More Categories" : "Show More Categories" } position="right"/>
              { !searchTerm &&
                <button id="show-more-btn" type="button" className="bg-[#7cc304] text-white p-1 rounded-md hover:bg-green-600 transition-colors" onClick={() => { setShowMore(!showMore); tooltipRef && tooltipRef.current && tooltipRef.current.hide()} }>
                  <div className={`transform transition-transform duration-500 ${ showMore ? 'rotate-90': '-rotate-90' }`}>
                    <CircleArrowIcon color="#fff" />
                  </div>
                </button>
              }
            </div>
          }
        </div>

        <div className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ${ showCategories && showScrollButtons  ? "max-w-[210px]" : "max-w-0" }`}>
          <button disabled={!canScrollLeft} id="scroll-start" type="button" className={`bg-[#7cc304] h-fit text-white p-[5px] rounded-md ${canScrollLeft ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'} transition-colors`} onClick={() => { handleManualScroll({ direction: "left" }); } }>
              <div className="rotate-180">
              <ArrowIcon color="#fff" />
            </div>
          </button>

          <button disabled={!canScrollRight} id="scroll-end" type="button" className={`bg-[#7cc304] h-fit text-white p-[5px] rounded-md ${canScrollRight ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'} transition-colors`} onClick={() => { handleManualScroll({ direction: "right" }) } }>
              <div >
              <ArrowIcon color="#fff" />
            </div>
          </button>
        </div>
      </div>

      {/* listado de categorías */}
      <div ref={bottomBarRef} onWheel={handleWheel} className={`w-full flex no-scrollbar overflow-x-auto overflow-y-hidden gap-2 overflow-hidden transition-all duration-300 ${ showCategories ? "h-[95px] pt-2" : "h-0" }`}>

        {
          searchTerm && filteredButtons.length === 0 ?
          (
            <Message
              style={{ borderLeft: "6px solid #b91c1c", color: "#b91c1c" }}
              className="w-full max-w-[230px]"
              severity="error"
              text="Category not found"
            />
          )
          :
          categoryList.map(({ category, label, Icon }) => (
            <CategoryButton key={category.id_category} category={category} label={label} Icon={Icon} />
          ))
        }
      </div>
    </div>
  );
};

export default BottomBar;
