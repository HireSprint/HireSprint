"use client";
import React, { useEffect, useState } from "react";
import {
  BakeryIcon,
  DairyIcon,
  DeliIcon,
  FrozenIcon,
  GroceryIcon,
  LiquorIcon,
  MeatIcon,
  SeafoodIcon,
} from "./icons";
import { categoriesInterface } from "@/types/category";
import { useCategoryContext } from "../context/categoryContext";

interface SidebarProps {
  onCategorySelect: (category: categoriesInterface) => void;
  categorySelected: categoriesInterface | null;
}

const Sidebar = ({ onCategorySelect, categorySelected }: SidebarProps) => {
  const { categoriesData, getCategoryByName } = useCategoryContext();
	
  const initialSidebarButtons = [{ label: "Bakery", Icon: BakeryIcon }];
  const [sideBarButtons, setSideBarButtons] = useState<any[]>( initialSidebarButtons );

  useEffect(() => {
    setSideBarButtons((initialBtns) => {
      return categoriesData.map((category) => {
        const iconMatched = initialSidebarButtons.find((btn) => btn.label === category.name_category );

        return {
          label: category.name_category,
          Icon: iconMatched?.Icon ?? null,
          category: category,
        };
      });
    });
  }, [categoriesData]);

  function isActive(category: number): boolean {
    return categorySelected ? category === categorySelected.id_category : false;
  }

  return (
    <div className="h-full flex flex-col items-center absolute left-0  bg-white shadow-lg p-1 pt-8 z-50 overflow-y-auto space-y-4 pb-8">
      {sideBarButtons.map(({ category, label, Icon }) => (
				<div key={category.id_category} className="flex flex-col items-center max-w-[145px] text-center group cursor-pointer" >

					<button id={`btn-${label}`} className={`w-20 h-20 border-2 ${isActive(category?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } group-hover:border-[#7cc304] rounded-lg  flex items-center justify-center`} onClick={() => { onCategorySelect(category) }} >
						{ Icon && <Icon isActive={isActive(category?.id_category)}/> }
					</button>

					<p className={`${isActive(category?.id_category) ? 'text-[#7cc304]' : 'text-gray-500' } group-hover:text-[#7cc304]`}>{label}</p>

				</div>
      ))}
    </div>
  );
  // return (
  //     <div className="flex flex-col justify-center items-center p-2 absolute left-0  bg-white shadow-lg p-4 z-50 overflow-y-auto space-y-2 pb-8 no-scrollbar ">
  //         <button className={`w-20 h-20 border-2 ${isActive(categoriesData[0]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group `} id="bakery" onClick={() => {
  //             onCategorySelect(categoriesData[0]);
  //         }}>
  //             <FrozenIcon isActive={isActive(categoriesData[0]?.id_category)}/>

  //         </button>
  //         <p className='text-gray-500'>{categoriesData[0]?.name_category}</p>
  //         <button className={`w-20 h-20 border-2 ${isActive(categoriesData[1]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="deli" onClick={() => {
  //             onCategorySelect(categoriesData[1]);
  //         }}> <BakeryIcon isActive={isActive(categoriesData[1]?.id_category)}/>

  //         </button>
  //         <p className='text-gray-500'>{categoriesData[1]?.name_category}</p>
  //         <button className={`w-20 h-20 border-2 ${isActive(categoriesData[2]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="dairy" onClick={() => {
  //             onCategorySelect(categoriesData[2]);
  //         }}>
  //             <GroceryIcon isActive={isActive(categoriesData[2]?.id_category)}/>

  //         </button>
  //         <p className='text-gray-500'>{categoriesData[2]?.name_category}</p>
  //         <button className={`w-20 h-20 border-2 ${isActive(categoriesData[3]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="frozen" onClick={() => {
  //             onCategorySelect(categoriesData[3]);
  //         }}>
  //             <MeatIcon isActive={isActive(categoriesData[3]?.id_category)}/>
  //         </button>
  //         <p className='text-gray-500'>{categoriesData[3]?.name_category}</p>
  //         <button className={`w-20 h-20 border-2 ${isActive(categoriesData[4]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="grocery" onClick={() => {
  //             onCategorySelect(categoriesData[4]);
  //         }}>
  //             <DairyIcon isActive={isActive(categoriesData[4]?.id_category)}/>

  //         </button>
  //         <p className='text-gray-500'>{categoriesData[4]?.name_category}</p>
  //         <button className={`w-20 h-20 border-2 ${isActive(categoriesData[5]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="meat" onClick={() => {
  //             onCategorySelect(categoriesData[5]);
  //         }}>
  //             <DeliIcon isActive={isActive(categoriesData[5]?.id_category)}/>
  //         </button>
  //         <p className='text-gray-500'>{categoriesData[5]?.name_category}</p>
  //         <button className={`w-20 h-20 border-2 ${isActive(categoriesData[13]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="seafood" onClick={() => {
  //             onCategorySelect(categoriesData[13]);
  //         }}>
  //             <SeafoodIcon isActive={isActive(categoriesData[13]?.id_category)}/>
  //         </button>
  //         <p className='text-gray-500'>{categoriesData[13]?.name_category}</p>
  //         <button className={`w-20 h-20 border-2 ${isActive(categoriesData[10]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="liquor" onClick={() => {
  //             onCategorySelect(categoriesData[10]);
  //         }}>
  //             <LiquorIcon isActive={isActive(categoriesData[10]?.id_category)}/>
  //         </button>
  //         <p className='text-gray-500'>{categoriesData[10]?.name_category}</p>
  //     </div>
  // );
};

export default Sidebar;
