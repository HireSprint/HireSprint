"use client";

import { useState } from "react";
import { ArrowIcon } from "../icons";

export const TemplateSelector = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    
    const handleTemplateSelect = (template: any) => {
        setSelectedTemplate(template)    
    };
    return (
        <div className="flex flex-col items-center">
            <label className="block text-lg font-medium text-gray-700 mb-3">Choose template</label>
            <div className="flex gap-3">
                <div className="flex items-center justify-center max-h-[270px]">
                    <button type="button" className="bg-[#7cc304] p-2 rounded-full hover:bg-[#78bb06] hover:scale-[1.1] rotate-180"> <ArrowIcon/> </button>
                </div>
                <div className="flex gap-2 h-auto w-[80vw] overflow-x-auto overflow-y-visible no-scrollbar">
                    {/* {[1,2,3].map((template: any, index: number) => (         */}
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map((template: any, index: number) => (        
                        <div key={index} className={`rounded-md p-2 cursor-pointer group  h-fit ${selectedTemplate == template ? 'bg-[#7cc304] hover:bg-[#78bb06] ' : 'bg-[#e7e7e7] hover:bg-[#dcdcdc]'}`} onClick={()=>handleTemplateSelect(template)}>
                            <label className={`block text-lg font-bold ${selectedTemplate == template ? 'text-white' : 'text-gray-700'}`}> TEMPLATE-{template} </label>
                            <div className="w-[170px] max-h-[170px] object-cover transition-all duration-300 ease-in-out group-hover:max-h-[500px] overflow-hidden rounded" >
                                <img 
                                    src="/pages/page01.jpg" 
                                    alt={`Preview page: ${index}`} 
                                    className="object-cover" 
                                    draggable={false} 
                                    onContextMenu={(e) => e.preventDefault()} 
                                    />
                            </div>
                            <span className={`block text-lg ${selectedTemplate == template ? 'text-white' : 'text-gray-700'}`}>
                                <span className="font-bold"> 300 </span> Products
                            </span>
                            <span className={`block text-lg ${selectedTemplate == template ? 'text-white' : 'text-gray-700'}`}>
                                <span className="font-bold"> 4 </span> Pages
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center max-h-[270px]">
                    <button type="button" className="bg-[#7cc304] p-2 rounded-full hover:bg-[#78bb06] hover:scale-[1.1]"> <ArrowIcon/> </button>
                </div>
            </div>
        </div>
    )
};
