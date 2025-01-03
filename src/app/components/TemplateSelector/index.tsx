"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "../icons";

export const TemplateSelector = () => {
    const selectorDivRef = useRef<HTMLDivElement>(null);
    const scrollPosition = useRef(0);

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showScrollButtons, setShowScrollButtons] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // view scroll of the bottomBar
    useEffect(() => {
        checkScroll();
        // Opcional: agregar listener para cambios de tamaño de ventana
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    // Captura la posición del scroll
    useEffect(() => {
        const selectorDiv = selectorDivRef.current;

        if (selectorDiv) {
        const handleScroll = () => {
            scrollPosition.current = selectorDiv.scrollLeft
            checkScrollButtons();
        }

        selectorDiv.addEventListener("scroll", handleScroll);

        return () => {
            selectorDiv.removeEventListener("scroll", handleScroll);
        };
        }
    }, []);
    
    const handleTemplateSelect = (template: any) => {
        setSelectedTemplate(template)    
    };

    // Función para manejar el scroll horizontal
    const handleWheel = (event: any) => {
        if (selectorDivRef.current) {
        selectorDivRef.current.scrollLeft += event.deltaY;
        event.stopPropagation();
        }
    };

        // verifica si se debe mostar los botones de scroll
    const checkScroll = () => {
        if (selectorDivRef.current) {
        const hasHorizontalScroll = selectorDivRef.current.scrollWidth > selectorDivRef.current.clientWidth;
        setShowScrollButtons(hasHorizontalScroll);
        checkScrollButtons();
        }
    };

    // verificar si se puede hacer scroll hacia la izquierda o derecha
    const checkScrollButtons = () => {
        if (selectorDivRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = selectorDivRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    // movescroll dynamically
    const handleManualScroll = ({direction}: { direction: "left" | "right" }) => {
        if (selectorDivRef.current) {
        const move = direction === "left" ? -300 : 300;
        selectorDivRef.current.scrollBy({ left: move, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col items-center">
            <label className="block text-lg font-medium text-gray-700 mb-3">Choose template</label>
            <div className="flex gap-3">
                <div className="flex items-center justify-center max-h-[270px]">
                    {showScrollButtons && <button onClick={() => { handleManualScroll({ direction: "left" }); } } disabled={!canScrollLeft} type="button" className={`bg-[#7cc304] p-2 rounded-full hover:bg-[#78bb06] hover:scale-[1.1] rotate-180 ${canScrollLeft ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'} transition-colors`}> <ArrowIcon/> </button>}
                </div>
                
                <div ref={selectorDivRef} onWheel={handleWheel} className="flex gap-2 h-auto w-[80vw] overflow-x-auto overflow-y-visible no-scrollbar">
                    {[1].map((template: any, index: number) => (        
                    //  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map((template: any, index: number) => (        
                        <div key={index} className={`rounded-md p-2 cursor-pointer group  h-fit ${selectedTemplate == template ? 'bg-[#7cc304] hover:bg-[#78bb06] ' : 'bg-[#e7e7e7] hover:bg-[#dcdcdc]'}`} onClick={()=>handleTemplateSelect(template)}>
                            <span className={`block text-lg ${selectedTemplate == template ? 'text-white' : 'text-gray-700'}`}>
                                <span className="font-bold"> 300 </span> Products
                            </span>
                            
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
                                <span className="font-bold"> 4 </span> Pages
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center max-h-[270px]">
                    {showScrollButtons && <button onClick={() => { handleManualScroll({ direction: "right" }) } } disabled={!canScrollRight} type="button" className={`bg-[#7cc304] p-2 rounded-full hover:bg-[#78bb06] hover:scale-[1.1] ${canScrollRight ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'} transition-colors`}> <ArrowIcon/> </button>}
                </div>
            </div>
        </div>
    )
};
