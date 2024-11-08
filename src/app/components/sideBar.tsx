'use client'
import React from 'react';
import { BakeryIcon, DairyIcon, DeliIcon, FrozenIcon, GroceryIcon, LiquorIcon, MeatIcon, SeafoodIcon } from './icons';
 interface SidebarProps {
    onCategorySelect: (category: string) => void;
    categorySelected: string | null
 }


const Sidebar = ({ onCategorySelect, categorySelected }: SidebarProps) => {

    function isActive( category: string ): boolean {
        return categorySelected ?  category === categorySelected : false;
    }

    return (
        <div className="flex flex-col justify-center items-center p-2 absolute left-0  bg-white shadow-lg p-4 z-50 overflow-y-auto space-y-2 pb-8 no-scrollbar ">
            <button className={`w-20 h-20 border-2 ${isActive('bakery') ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group `} id="bakery" onClick={() => {
                onCategorySelect('bakery');
            }}>
                <BakeryIcon isActive={isActive('bakery')}/>
            </button>
            <p className='text-gray-500'>Bakery</p>
            <button className={`w-20 h-20 border-2 ${isActive('deli') ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="deli" onClick={() => {
                onCategorySelect('deli');
            }}>
                  <DeliIcon isActive={isActive('deli')}/>
            </button>
            <p className='text-gray-500'>Deli</p>
            <button className={`w-20 h-20 border-2 ${isActive('dairy') ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="dairy" onClick={() => {
                onCategorySelect('dairy');
            }}>
                <DairyIcon isActive={isActive('dairy')}/>
            </button>
            <p className='text-gray-500'>Dairy</p>
            <button className={`w-20 h-20 border-2 ${isActive('frozen') ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="frozen" onClick={() => {
                onCategorySelect('frozen');
            }}>
                <FrozenIcon isActive={isActive('frozen')}/>
            </button>
            <p className='text-gray-500'>Frozen</p>
            <button className={`w-20 h-20 border-2 ${isActive('grocery') ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="grocery" onClick={() => {
                onCategorySelect('grocery');
            }}>
                <GroceryIcon isActive={isActive('grocery')}/>
            </button>
            <p className='text-gray-500'>Grocery</p>
            <button className={`w-20 h-20 border-2 ${isActive('meat') ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="meat" onClick={() => {
                onCategorySelect('meat');
            }}>
                <MeatIcon isActive={isActive('meat')}/>
            </button>
            <p className='text-gray-500'>Meat</p>
            <button className={`w-20 h-20 border-2 ${isActive('seafood') ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="seafood" onClick={() => {
                onCategorySelect('seafood');
            }}>
                <SeafoodIcon isActive={isActive('seafood')}/>
            </button>
            <p className='text-gray-500'>Seafood</p>
            <button className={`w-20 h-20 border-2 ${isActive('liquor') ? 'border-[#7cc304]' : 'border-[#606060]' } hover:border-[#7cc304] rounded-lg cursor-pointer flex items-center justify-center group`} id="liquor" onClick={() => {
                onCategorySelect('liquor');
            }}>
                <LiquorIcon isActive={isActive('liquor')}/>
            </button>
            <p className='text-gray-500'>Liquor</p>
        </div>
    );
};

export default Sidebar;
