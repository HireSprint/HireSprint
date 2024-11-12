"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { useProductContext } from '../context/productContext';
import { MessageIcon, ProfileIcon, VideoIcon } from './icons';
import SendModal from './sendModal';




export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  const { currentPage, setCurrentPage, isSendModalOpen, setIsSendModalOpen } = useProductContext();
  const [direction, setDirection] = useState(0);



  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const changePage = (newPage: number) => {
    setDirection(newPage > currentPage ? 1 : -1);
    setCurrentPage(newPage);
};



  return (
    <div className="flex items-center p-4 bg-[#393939] space-x-4 justify-between ">
      <div className='flex items-center justify-center '>
        <button className="flex items-center justify-center" onClick={() => router.push('/')}>
          <Image src="/HPlogo.png" alt="Retail Fluent" width={70} height={70} />
          <Image src="/nameLogo.png" alt="Retail Fluent" width={120} height={100} className='pt-3' />

        </button>
      </div>
      <div className="justify-center items-center space-x-4 hidden lg:flex xl:flex md:flex ">
       {/* <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection showIcon />*/} 
        <p className='text-white text-xl font-bold'>Client: </p>
      </div>
      <div className='flex items-center justify-center space-x-2 '>
       <h1 className='text-white text-xl font-bold'>Page:</h1>
       <button className={`bg-[#585858] text-white font-bold text-md h-8 w-8 rounded-lg hover:bg-[#7cc304] hover:text-black ${currentPage === 2 ? 'bg-[#7cc304] text-black' : ''}`} onClick={() => changePage(2)}>2</button>
       <button className={`bg-[#585858] text-white font-bold text-md h-8 w-8 rounded-lg hover:bg-[#7cc304] hover:text-black ${currentPage === 3 ? 'bg-[#7cc304] text-black' : ''}`} onClick={() => changePage(3)}>3</button>
       <button className={`bg-[#585858] text-white font-bold text-md h-8 w-8 rounded-lg hover:bg-[#7cc304] hover:text-black ${currentPage === 4 ? 'bg-[#7cc304] text-black' : ''}`} onClick={() => changePage(4)}>4</button>
       <div className='flex items-center justify-center space-x-2 pl-8'>
       <button >
       <VideoIcon />
       </button>
       <button >
       <ProfileIcon />
       </button>
       <button onClick={()=>setIsSendModalOpen(true)}>
       <MessageIcon />
       </button>
       </div>
      </div>
    </div>
  );
}
