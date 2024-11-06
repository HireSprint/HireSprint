'use client'
import React from 'react';


const Sidebar = () => {

    return (
        <div className="pl-6 absolute left-0 w-[7%] h-[99vh]  bg-white shadow-lg p-4 z-50 overflow-y-auto space-y-2 pb-8 no-scrollbar">
            <div className=' w-16 h-16 border-2 border-black rounded-full'>
            </div>
            <p className='text-center text-gray-500'>Bakery</p>
            <div className=' w-16 h-16 border-2 border-black rounded-full'></div>
            <p className='text-center text-gray-500'>Deli</p>
            <div className=' w-16 h-16 border-2 border-black rounded-full'></div>
            <p className='text-center text-gray-500'>Dairy</p>
            <div className=' w-16 h-16 border-2 border-black rounded-full'></div>
            <p className='text-center text-gray-500'>Frozen</p>
            <div className=' w-16 h-16 border-2 border-black rounded-full'></div>
            <p className='text-center text-gray-500'>Grocery</p>
            <div className=' w-16 h-16 border-2 border-black rounded-full'></div>
            <p className='text-center text-gray-500'>Meat</p>
            <div className=' w-16 h-16 border-2 border-black rounded-full'></div>
            <p className='text-center text-gray-500'>Seafood</p>
            <div className=' w-16 h-16 border-2 border-black rounded-full'></div>
            <p className='text-center text-gray-500'>Liquor</p>
        </div>
    );
};

export default Sidebar;
