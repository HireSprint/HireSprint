'use client'
import React from 'react';
import { BakeryIcon, DairyIcon, DeliIcon, FrozenIcon, GroceryIcon, LiquorIcon, MeatIcon, SeafoodIcon } from './icons';
 interface SidebarProps {
    onCategorySelect: (category: string) => void;
 }


const Sidebar = ({ onCategorySelect }: SidebarProps) => {

    return (
        <div className="flex flex-col justify-center items-center p-2 absolute left-0  bg-white shadow-lg p-4 z-50 overflow-y-auto space-y-2 pb-8 no-scrollbar ">
            <button className=' w-20 h-20 border-2 border-[#606060] hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center' id="bakery" onClick={() => {
                onCategorySelect('bakery');
            }}>
                <BakeryIcon />
            </button>
            <p className='text-gray-500'>Bakery</p>
            <button className='w-20 h-20 border-2 border-[#606060] rounded-lg cursor-pointer flex items-center justify-center' id="deli" onClick={() => {
                onCategorySelect('deli');
            }}>
                  <DeliIcon />
            </button>
            <p className='text-gray-500'>Deli</p>
            <button className=' w-20 h-20 border-2 border-[#606060] rounded-lg cursor-pointer flex items-center justify-center' id="dairy" onClick={() => {
                onCategorySelect('dairy');
            }}>
                <DairyIcon />
            </button>
            <p className='text-gray-500'>Dairy</p>
            <button className=' w-20 h-20 border-2 border-[#606060] rounded-lg cursor-pointer flex items-center justify-center' id="frozen" onClick={() => {
                onCategorySelect('frozen');
            }}>
                <FrozenIcon />
            </button>
            <p className='text-gray-500'>Frozen</p>
            <button className=' w-20 h-20 border-2 border-[#606060] rounded-lg cursor-pointer flex items-center justify-center' id="grocery" onClick={() => {
                onCategorySelect('grocery');
            }}>
                <GroceryIcon />
            </button>
            <p className='text-gray-500'>Grocery</p>
            <button className=' w-20 h-20 border-2 border-[#606060] rounded-lg cursor-pointer flex items-center justify-center' id="meat" onClick={() => {
                onCategorySelect('meat');
            }}>
                <MeatIcon />
            </button>
            <p className='text-gray-500'>Meat</p>
            <button className=' w-20 h-20 border-2 border-[#606060] rounded-lg cursor-pointer flex items-center justify-center' id="seafood" onClick={() => {
                onCategorySelect('seafood');
            }}>
                <SeafoodIcon />
            </button>
            <p className='text-gray-500'>Seafood</p>
            <button className=' w-20 h-20 border-2 border-[#606060] rounded-lg cursor-pointer flex items-center justify-center' id="liquor" onClick={() => {
                onCategorySelect('liquor');
            }}>
                <LiquorIcon />
            </button>
            <p className='text-gray-500'>Liquor</p>
        </div>
    );
};

export default Sidebar;
