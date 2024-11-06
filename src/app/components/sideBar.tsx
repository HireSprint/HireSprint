'use client'
import React from 'react';


const Sidebar = () => {

    return (
        <div className="flex flex-col justify-center items-center p-2 absolute left-0  bg-white shadow-lg p-4 z-50 overflow-y-auto space-y-2 pb-8 no-scrollbar">
            <button className=' w-20 h-20 border-2 border-black rounded-full cursor-pointer' onClick={() => {
                window.alert('Bakery');
            }}>
            </button>
            <p className='text-gray-500'>Bakery</p>
            <button className='w-20 h-20 border-2 border-black rounded-full cursor-pointer'></button>
            <p className='text-gray-500'>Deli</p>
            <button className=' w-20 h-20 border-2 border-black rounded-full cursor-pointer'></button>
            <p className='text-gray-500'>Dairy</p>
            <button className=' w-20 h-20 border-2 border-black rounded-full cursor-pointer'></button>
            <p className='text-gray-500'>Frozen</p>
            <button className=' w-20 h-20 border-2 border-black rounded-full cursor-pointer'></button>
            <p className='text-gray-500'>Grocery</p>
            <button className=' w-20 h-20 border-2 border-black rounded-full cursor-pointer'></button>
            <p className='text-gray-500'>Meat</p>
            <button className=' w-20 h-20 border-2 border-black rounded-full cursor-pointer'></button>
            <p className='text-gray-500'>Seafood</p>
            <button className=' w-20 h-20 border-2 border-black rounded-full cursor-pointer'></button>
            <p className='text-gray-500'>Liquor</p>
        </div>
    );
};

export default Sidebar;
