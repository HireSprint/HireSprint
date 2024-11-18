'use client'
import React from 'react';
import { BakeryIcon, DairyIcon, DeliIcon, FrozenIcon, GroceryIcon, LiquorIcon, MeatIcon, SeafoodIcon } from './icons';
import { categoriesInterface } from '@/types/category';
import { useCategoryContext } from '../context/categoryContext';

 interface SidebarProps {
    onCategorySelect: (category: categoriesInterface) => void;
    categorySelected: categoriesInterface | null
 }


const Sidebar = ({ onCategorySelect, categorySelected }: SidebarProps) => {
    const {categoriesData} = useCategoryContext()

    function isActive( category: number ): boolean {
        return categorySelected ?  category === categorySelected.id_category : false;
    }

    return (
        <div className="flex flex-col justify-center items-center p-2 absolute left-0  bg-white shadow-lg p-4 z-50 overflow-y-auto space-y-2 pb-8 no-scrollbar ">
            <button className={`w-20 h-20 border-2 ${isActive(categoriesData[0]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group `} id="bakery" onClick={() => {
                onCategorySelect(categoriesData[0]);
            }}>
                <FrozenIcon isActive={isActive(categoriesData[0]?.id_category)}/>
               
            </button>
            <p className='text-gray-500'>{categoriesData[0]?.name_category}</p>
            <button className={`w-20 h-20 border-2 ${isActive(categoriesData[1]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="deli" onClick={() => {
                onCategorySelect(categoriesData[1]);
            }}> <BakeryIcon isActive={isActive(categoriesData[1]?.id_category)}/>

            </button>
            <p className='text-gray-500'>{categoriesData[1]?.name_category}</p>
            <button className={`w-20 h-20 border-2 ${isActive(categoriesData[2]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="dairy" onClick={() => {
                onCategorySelect(categoriesData[2]);
            }}>
                <GroceryIcon isActive={isActive(categoriesData[2]?.id_category)}/>

            </button>
            <p className='text-gray-500'>{categoriesData[2]?.name_category}</p>
            <button className={`w-20 h-20 border-2 ${isActive(categoriesData[3]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="frozen" onClick={() => {
                onCategorySelect(categoriesData[3]);
            }}>
                <MeatIcon isActive={isActive(categoriesData[3]?.id_category)}/>
            </button>
            <p className='text-gray-500'>{categoriesData[3]?.name_category}</p>
            <button className={`w-20 h-20 border-2 ${isActive(categoriesData[4]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="grocery" onClick={() => {
                onCategorySelect(categoriesData[4]);
            }}>
                <DairyIcon isActive={isActive(categoriesData[4]?.id_category)}/>

            </button>
            <p className='text-gray-500'>{categoriesData[4]?.name_category}</p>
            <button className={`w-20 h-20 border-2 ${isActive(categoriesData[5]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="meat" onClick={() => {
                onCategorySelect(categoriesData[5]);
            }}>
                <DeliIcon isActive={isActive(categoriesData[5]?.id_category)}/>
            </button>
            <p className='text-gray-500'>{categoriesData[5]?.name_category}</p>
            <button className={`w-20 h-20 border-2 ${isActive(categoriesData[13]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="seafood" onClick={() => {
                onCategorySelect(categoriesData[13]);
            }}>
                <SeafoodIcon isActive={isActive(categoriesData[13]?.id_category)}/>
            </button>
            <p className='text-gray-500'>{categoriesData[13]?.name_category}</p>
            <button className={`w-20 h-20 border-2 ${isActive(categoriesData[10]?.id_category) ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="liquor" onClick={() => {
                onCategorySelect(categoriesData[10]);
            }}>
                <LiquorIcon isActive={isActive(categoriesData[10]?.id_category)}/>
            </button>
            <p className='text-gray-500'>{categoriesData[10]?.name_category}</p>
        </div>
    );
};

export default Sidebar;
