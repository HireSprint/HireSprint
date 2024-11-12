import Image from "next/image";
import { useState, useEffect } from "react";
import RightClick from "./rightClick";
import { GridCardProduct } from "./card";
import { useProductContext } from "../context/productContext";
import { categoriesInterface } from "@/types/category";
import { ProductTypes } from "@/types/product";


interface ImageGridProps {
    onProductSelect: (gridId: number, categoryGridSelected: categoriesInterface, event: React.MouseEvent) => void;
    selectedProducts: ProductTypes[];
    onRemoveProduct: (productId: number) => void;
    onEditProduct: (productId: number) => void;
    onChangeProduct: (productId: number) => void;
    isMoveModeActive: boolean;
    onCopyProduct: (product: ProductTypes) => void;
    copiedProduct: ProductTypes | null;
    onPasteProduct: () => void;
}

export const ImageGrid = ({
    onProductSelect,
    selectedProducts,
    onRemoveProduct,
    onChangeProduct,
    isMoveModeActive,
    onCopyProduct,
    copiedProduct,
    onPasteProduct
}: ImageGridProps) => {
    const gridCells = [
        //meats
        { id: 1001, top: "top-[21%] ", left: "left-[0%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 1002, top: "top-[21%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 1003, top: "top-[21%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 1004, top: "top-[27.3%]", left: "left-[0%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 1005, top: "top-[27.3%]", left: "left-[23.2%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 1006, top: "top-[27.3%]", left: "left-[46.4%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 1007, top: "top-[33.6%] ", left: "left-[0%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 1008, top: "top-[33.6%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 1009, top: "top-[33.6%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%", category: "Meat" },
        //seaFood
        { id: 1010, top: "top-[42%]", left: "left-0%", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 1011, top: "top-[42%]", left: "left-[14.2%] ", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 1012, top: "top-[42%]", left: "left-[28.4%] ", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 1013, top: "top-[42%]", left: "left-[42.7%] ", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 1014, top: "top-[42%]", left: "left-[57%] ", width: "14.5%", height: "6.4%", category: "SeaFood" },
        //SeaFood
        { id: 1015, top: "top-[49.2%]", left: "left-[0]", width: "23.5%", height: "6.4%", category: "Deli" },
        { id: 1016, top: "top-[49.2%]", left: "left-[23.9%] ", width: "23.5%", height: "6.4%", category: "Deli" },
        { id: 1017, top: "top-[49.2%]", left: "left-[47.8%] ", width: "23.5%", height: "6.4%", category: "Deli" },
        //Grocery
        { id: 1018, top: "top-[56.4%]", left: "left-[0%] ", width: "23.5%", height: "8.2%", category: "Grocery" },
        { id: 1019, top: "top-[56.4%]", left: "left-[23.8%]", width: "23.5%", height: "8.2%", category: "Grocery" },
        { id: 1020, top: "top-[56.4%]", left: "left-[47.5%]", width: "23.5%", height: "8.2%", category: "Grocery" },
        { id: 1021, top: "top-[64.7%]", left: "left-[0%] ", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1022, top: "top-[64.7%]", left: "left-[18%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1023, top: "top-[64.7%]", left: "left-[35.5%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1024, top: "top-[64.7%]", left: "left-[53%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1025, top: "top-[71.5%]", left: "left-[0%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1026, top: "top-[71.5%]", left: "left-[18%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1027, top: "top-[71.5%]", left: "left-[35.5%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1028, top: "top-[71.5%]", left: "left-[53%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1029, top: "top-[78%]", left: "left-[0%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1030, top: "top-[78%]", left: "left-[18%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1031, top: "top-[78%]", left: "left-[35.5%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 1032, top: "top-[78%]", left: "left-[53%]", width: "18%", height: "6.8%", category: "Grocery" },
        //Dairy
        { id: 1033, top: "top-[85.2%]", left: "left-[0%]", width: "18%", height: "6.4%", category: "Dairy" },
        { id: 1034, top: "top-[85.2%]", left: "left-[18%]", width: "18%", height: "6.4%", category: "Dairy" },
        { id: 1035, top: "top-[85.2%]", left: "left-[35.5%]", width: "18%", height: "6.4%", category: "Dairy" },
        { id: 1036, top: "top-[85.2%]", left: "left-[53%]", width: "18%", height: "6.4%", category: "Dairy" },
        //froze
        { id: 1037, top: "top-[92.2%]", left: "left-[0%]", width: "18%", height: "7%", category: "Dairy" },
        { id: 1038, top: "top-[92.2%]", left: "left-[18%]", width: "18%", height: "7%", category: "Dairy" },
        { id: 1039, top: "top-[92.2%]", left: "left-[35.5%]", width: "18%", height: "7%", category: "Dairy" },
        { id: 1040, top: "top-[92.2%]", left: "left-[53%]", width: "18%", height: "7%", category: "Dairy" },
        //Produce
        { id: 1041, top: "top-[20.5%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 1042, top: "top-[27.9%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 1043, top: "top-[35.3%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 1044, top: "top-[42.7%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 1045, top: "top-[50.1%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 1046, top: "top-[57.5%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 1047, top: "top-[64.9%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 1048, top: "top-[72.3%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 1049, top: "top-[79.7%]", left: "left-[72%]", width: "27%", height: "9%", category: "Produce" },
        { id: 1050, top: "top-[88.5%]", left: "left-[72%]", width: "27%", height: "9%", category: "Produce" },
    ];
    const [productsData, setProductsData] = useState<ProductTypes[]>([]);
    const { setProductArray } = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: number;
    } | null>(null);


    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;
        const selectedProduct = selectedProducts.find(p => p.id_product === cellId);
        if (selectedProduct) {
            setContextMenu({
                visible: true,
                x: e.clientX,
                y: e.clientY,
                productId: cellId
            });
        }
    };



    const handleGridSelect = (
        gridId: number, 
        categoryGridSelected: categoriesInterface, 
        event: React.MouseEvent
      ) => {
        // Si hay un producto copiado y la celda está vacía
        if (copiedProduct && !selectedProducts.some(p => p.id_product === gridId)) {
          const newProduct = {
            ...copiedProduct,
            id_product: gridId
          };
          onProductSelect(gridId, categoryGridSelected, event);
          setProductArray([newProduct]);
          onPasteProduct();
          return;
        }
      
        // Lógica existente de selección...
        onProductSelect(gridId, categoryGridSelected, event);
    };


    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page01.jpg" alt="PDF" width={400} height={400} priority />
            {gridCells.map((cell) => {
                const selectedProduct = productsData?.find((p) => p.id_product === cell.id) || selectedProducts?.find((p) => p.id_product === cell.id);
                const categoryItem = { name_category: cell.category } as categoriesInterface;
                return (
                    <GridCardProduct
                        key={cell.id}
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                        onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                    />
                );
            })}

            {contextMenu?.visible && !isMoveModeActive && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 1000
                    }}
                >
                    <RightClick
                        productId={contextMenu.productId}
                        handleRemoveProduct={onRemoveProduct}
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_product === contextMenu.productId) as ProductTypes}
                        copiedProduct={copiedProduct}
                    />
                </div>
            )}
        </div>
    );
};


export const ImageGrid2 = ({
    onProductSelect,
    selectedProducts,
    isMoveModeActive,
    onRemoveProduct,
    onChangeProduct,
    onCopyProduct,
    copiedProduct,
    onPasteProduct
}: ImageGridProps) => {
    const gridCells = [
        // Grocery
        { id: 2001, top: "top-[1%] ", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2002, top: "top-[1%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2003, top: "top-[1%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2004, top: "top-[1%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2005, top: "top-[1%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2006, top: "top-[6.8%]", left: "left-[0%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2007, top: "top-[6.8%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2008, top: "top-[6.8%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2009, top: "top-[6.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2010, top: "top-[6.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2011, top: "top-[12.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2012, top: "top-[12.5%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2013, top: "top-[12.5%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2014, top: "top-[12.5%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2015, top: "top-[12.5%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2016, top: "top-[18.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2017, top: "top-[18.2%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2018, top: "top-[18.2%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2019, top: "top-[18.2%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2020, top: "top-[18.2%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2021, top: "top-[23.9%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2022, top: "top-[23.9%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2023, top: "top-[23.9%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2024, top: "top-[23.9%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2025, top: "top-[23.9%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2026, top: "top-[29.6%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2027, top: "top-[29.6%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2028, top: "top-[29.6%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2029, top: "top-[29.6%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2030, top: "top-[29.6%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        //International
        { id: 2031, top: "top-[36.3%]", left: "left-[0%]", width: "20.2%", height: "11%", category: "International" },
        { id: 2032, top: "top-[36.3%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2033, top: "top-[36.3%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2034, top: "top-[36.3%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2035, top: "top-[36.3%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2036, top: "top-[41.8%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2037, top: "top-[41.8%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2038, top: "top-[41.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2039, top: "top-[41.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2040, top: "top-[47.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2041, top: "top-[47.5%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2042, top: "top-[47.5%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2043, top: "top-[47.5%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2044, top: "top-[47.5%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2045, top: "top-[53.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2046, top: "top-[53.2%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2047, top: "top-[53.2%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2048, top: "top-[53.2%]", left: "left-[60%]", width: "40%", height: "11.2%", category: "International" },
        { id: 2049, top: "top-[59%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2050, top: "top-[59%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 2051, top: "top-[59%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        //Breakfast
        { id: 2052, top: "top-[65.8%]", left: "left-[0%]", width: "25.2%", height: "8.5%", category: "Breakfast" },
        { id: 2053, top: "top-[65.8%]", left: "left-[25.2%]", width: "25.2%", height: "8.5%", category: "Breakfast" },
        { id: 2054, top: "top-[65.8%]", left: "left-[50.4%]", width: "25.2%", height: "8.5%", category: "Breakfast" },
        { id: 2055, top: "top-[65.8%]", left: "left-[75.6%]", width: "25.2%", height: "8.5%", category: "Breakfast" },
        { id: 2056, top: "top-[74.3%]", left: "left-[0%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 2057, top: "top-[74.3%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 2058, top: "top-[74.3%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 2059, top: "top-[74.3%]", left: "left-[75.6%]", width: "25.2%", height: "13.5%", category: "Breakfast" },
        { id: 2060, top: "top-[80.8%]", left: "left-[0%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 2061, top: "top-[80.8%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 2062, top: "top-[80.8%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        //Snack
        { id: 2063, top: "top-[89.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Snack" },
        { id: 2064, top: "top-[89.5%]", left: "left-[20.2%]", width: "20%", height: "5.5%", category: "Snack" },
        { id: 2065, top: "top-[89.5%]", left: "left-[40.5%]", width: "19%", height: "5.5%", category: "Snack" },
        { id: 2066, top: "top-[89.5%]", left: "left-[58.7%]", width: "20.2%", height: "5.5%", category: "Snack" },
        { id: 2067, top: "top-[89.5%]", left: "left-[79.2%]", width: "20.8%", height: "10.5%", category: "Snack" },
        { id: 2068, top: "top-[95%]", left: "left-[0%]", width: "20.2%", height: "4.8%", category: "Snack" },
        { id: 2069, top: "top-[95%]", left: "left-[20.2%]", width: "20.2%", height: "4.8%", category: "Snack" },
        { id: 2070, top: "top-[95%]", left: "left-[40.5%]", width: "19%", height: "4.8%", category: "Snack" },
        { id: 2071, top: "top-[95%]", left: "left-[59.7%]", width: "20.2%", height: "4.8%", category: "Snack" },


    ];

    const { productArray, setProductArray, productsData, setProductsData } = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: number;
    } | null>(null);



    const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;

        // Obtener las coordenadas del clic derecho
        const container = e.currentTarget.closest('.scroll-container') as HTMLElement;
        const containerRect = container?.getBoundingClientRect();

        let posX = e.clientX;
        let posY = e.clientY;

        if (containerRect) {
            posX = e.clientX - containerRect.left + container.scrollLeft;
            posY = e.clientY - containerRect.top + container.scrollTop;
        }

        // Ajustar las coordenadas para evitar que el menú se salga de la pantalla
        const menuWidth = 150; // Ancho estimado del menú contextual
        const menuHeight = 200; // Alto estimado del menú contextual

        if (posX + menuWidth > window.innerWidth) {
            posX -= menuWidth;
        }
        if (posY + menuHeight > window.innerHeight) {
            posY -= menuHeight;
        }

        // Establecer el estado del menú contextual con las coordenadas ajustadas
        setContextMenu({
            visible: true,
            x: posX - 125,
            y: posY,
            productId: cellId
        });
    };


    useEffect(() => {

        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const handleGridSelect = (
        gridId: number, 
        categoryGridSelected: categoriesInterface, 
        event: React.MouseEvent
      ) => {
        // Si hay un producto copiado y la celda está vacía
        if (copiedProduct && !selectedProducts.some(p => p.id_product === gridId)) {
          const newProduct = {
            ...copiedProduct,
            id_product: gridId
          };
          onProductSelect(gridId, categoryGridSelected, event);
          setProductArray([newProduct]);
          onPasteProduct();
          return;
        }
      
        // Lógica existente de selección...
        onProductSelect(gridId, categoryGridSelected, event);
    };


    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page02.jpg" alt="PDF" width={360} height={360} priority />
            {gridCells.map((cell) => {

                const selectedProduct = productArray?.find((p) => p.id_product === cell.id) || selectedProducts?.find((p) => p.id_product === cell.id);
                const categoryItem = { name_category: cell.category } as categoriesInterface;

                return (
                    <GridCardProduct
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                        onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                       
                    />
                );
            })}

            {contextMenu?.visible && !isMoveModeActive && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 1000
                    }}
                >
                    <RightClick
                        productId={contextMenu.productId}
                        handleRemoveProduct={onRemoveProduct}
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_product === contextMenu.productId) as ProductTypes}
                        copiedProduct={copiedProduct}
                    />
                </div>
            )}

        </div>
    );

};

export const ImageGrid3 = ({
    onProductSelect,
    selectedProducts,
    isMoveModeActive,
    onRemoveProduct,
    onChangeProduct,
    onCopyProduct,
    copiedProduct,
    onPasteProduct
}: ImageGridProps) => {
    const gridCells = [
        { id: 301, top: "top-[1.8%] ", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Dairy" },
        { id: 302, top: "top-[1.8%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Dairy" },
        { id: 303, top: "top-[1.8%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%", category: "Dairy" },
        { id: 304, top: "top-[9.8%]", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Dairy" },
        { id: 305, top: "top-[9.8%]", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Dairy" },
        { id: 306, top: "top-[9.8%]", left: "left-[45.5%] ", width: "23.2%", height: "7.8%", category: "Dairy" },
        { id: 307, top: "top-[18%] ", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Dairy" },
        { id: 308, top: "top-[18%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Dairy" },
        { id: 309, top: "top-[18%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%", category: "Dairy" },
        { id: 310, top: "top-[27.9%]", left: "left-[0%]", width: "14.5%", height: "8%", category: "Dairy" },
        { id: 311, top: "top-[27.9%]", left: "left-[14.4%] ", width: "14%", height: "8%", category: "Dairy" },
        { id: 312, top: "top-[27.9%]", left: "left-[28.6%] ", width: "14%", height: "8%", category: "Dairy" },
        { id: 313, top: "top-[27.9%]", left: "left-[42.8%] ", width: "14%", height: "8%", category: "Dairy" },
        { id: 314, top: "top-[27.9%]", left: "left-[57%] ", width: "14%", height: "8%", category: "Dairy" },
        { id: 315, top: "top-[36.8%]", left: "left-[0%]", width: "23.5%", height: "8%", category: "Dairy" },
        { id: 316, top: "top-[36.8%]", left: "left-[24.2%] ", width: "23%", height: "8%", category: "Dairy" },
        { id: 317, top: "top-[36.8%]", left: "left-[47.5%] ", width: "23%", height: "8%", category: "Dairy" },
        { id: 318, top: "top-[45.8%]", left: "left-[0%]", width: "23%", height: "9.8%", category: "Dairy" },
        { id: 319, top: "top-[45.8%]", left: "left-[23.2%]", width: "23%", height: "9.8%", category: "Dairy" },
        { id: 320, top: "top-[45.8%]", left: "left-[46.5%]", width: "23%", height: "9.8%", category: "Dairy" },
        { id: 321, top: "top-[55.8%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 322, top: "top-[55.8%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 323, top: "top-[55.8%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 324, top: "top-[55.8%]", left: "left-[53.2%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 325, top: "top-[64.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 326, top: "top-[64.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 327, top: "top-[64.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 328, top: "top-[64.5%]", left: "left-[53.2%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 329, top: "top-[72.6%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 330, top: "top-[72.6%]", left: "left-[17.4%] ", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 331, top: "top-[72.6%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 332, top: "top-[72.6%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 333, top: "top-[81.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 334, top: "top-[81.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 335, top: "top-[81.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 336, top: "top-[81.5%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 337, top: "top-[90.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 338, top: "top-[90.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 339, top: "top-[90.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 340, top: "top-[90.5%]", left: "left-[53%]", width: "18%", height: "8.2%", category: "Dairy" },
        { id: 341, top: "top-[1.1%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy" },
        { id: 342, top: "top-[10.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy" },
        { id: 343, top: "top-[19.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy" },
        { id: 344, top: "top-[28.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy" },
        { id: 345, top: "top-[37.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy" },
        { id: 346, top: "top-[46.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy" },
        { id: 347, top: "top-[55.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy" },
        { id: 348, top: "top-[64.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy" },
        { id: 349, top: "top-[73.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Dairy" },
        { id: 350, top: "top-[84.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Dairy" },

    ];

    const { productArray, setProductArray, productsData, setProductsData } = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: number;
    } | null>(null);



    const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;

        // Obtener las coordenadas del clic derecho
        const container = e.currentTarget.closest('.scroll-container') as HTMLElement;
        const containerRect = container?.getBoundingClientRect();

        let posX = e.clientX;
        let posY = e.clientY;

        if (containerRect) {
            posX = e.clientX - containerRect.left + container.scrollLeft;
            posY = e.clientY - containerRect.top + container.scrollTop;
        }

        // Ajustar las coordenadas para evitar que el menú se salga de la pantalla
        const menuWidth = 150; // Ancho estimado del menú contextual
        const menuHeight = 200; // Alto estimado del menú contextual

        if (posX + menuWidth > window.innerWidth) {
            posX -= menuWidth;
        }
        if (posY + menuHeight > window.innerHeight) {
            posY -= menuHeight;
        }

        // Establecer el estado del menú contextual con las coordenadas ajustadas
        setContextMenu({
            visible: true,
            x: posX - 125,
            y: posY,
            productId: cellId
        });
    };


    useEffect(() => {

        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const handleGridSelect = (
        gridId: number, 
        categoryGridSelected: categoriesInterface, 
        event: React.MouseEvent
      ) => {
        // Si hay un producto copiado y la celda está vacía
        if (copiedProduct && !selectedProducts.some(p => p.id_product === gridId)) {
          const newProduct = {
            ...copiedProduct,
            id_product: gridId
          };
          onProductSelect(gridId, categoryGridSelected, event);
          setProductArray([newProduct]);
          onPasteProduct();
          return;
        }
      
        // Lógica existente de selección...
        onProductSelect(gridId, categoryGridSelected, event);
    };


    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page03.jpg" alt="PDF" width={360} height={360} priority />
            {gridCells.map((cell) => {

                const selectedProduct = productArray?.find((p) => p.id_product === cell.id) || selectedProducts?.find((p) => p.id_product === cell.id);
                const categoryItem = { name_category: cell.category } as categoriesInterface;

                return (
                    <GridCardProduct
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                        onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                       
                    />
                );
            })}

            {contextMenu?.visible && !isMoveModeActive && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 1000
                    }}
                >
                    <RightClick
                        productId={contextMenu.productId}
                        handleRemoveProduct={onRemoveProduct}
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_product === contextMenu.productId) as ProductTypes}
                        copiedProduct={copiedProduct}
                    />
                </div>
            )}

        </div>
    );
};

export const ImageGrid4 = ({
    onProductSelect,
    selectedProducts,
    isMoveModeActive,
    onRemoveProduct,
    onChangeProduct,
    onCopyProduct,
    copiedProduct,
    onPasteProduct
}: ImageGridProps) => {
    const gridCells = [
        { id: 401, top: "top-[1.8%] ", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Breakfast" },
        { id: 402, top: "top-[1.8%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Breakfast" },
        { id: 403, top: "top-[1.8%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%", category: "Breakfast" },
        { id: 404, top: "top-[9.8%]", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Breakfast" },
        { id: 405, top: "top-[9.8%]", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Breakfast" },
        { id: 406, top: "top-[9.8%]", left: "left-[45.5%] ", width: "23.2%", height: "7.8%", category: "Breakfast" },
        { id: 407, top: "top-[18%] ", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Breakfast" },
        { id: 408, top: "top-[18%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Breakfast" },
        { id: 409, top: "top-[18%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%", category: "Breakfast" },
        { id: 410, top: "top-[27.9%]", left: "left-[0%]", width: "14.5%", height: "8%", category: "Breakfast" },
        { id: 411, top: "top-[27.9%]", left: "left-[14.4%] ", width: "14%", height: "8%", category: "Breakfast" },
        { id: 412, top: "top-[27.9%]", left: "left-[28.6%] ", width: "14%", height: "8%", category: "Breakfast" },
        { id: 413, top: "top-[27.9%]", left: "left-[42.8%] ", width: "14%", height: "8%", category: "Breakfast" },
        { id: 414, top: "top-[27.9%]", left: "left-[57%] ", width: "14%", height: "8%", category: "Breakfast" },
        { id: 415, top: "top-[36.8%]", left: "left-[0%]", width: "23.5%", height: "8%", category: "Breakfast" },
        { id: 416, top: "top-[36.8%]", left: "left-[24.2%] ", width: "23%", height: "8%", category: "Breakfast" },
        { id: 417, top: "top-[36.8%]", left: "left-[47.5%] ", width: "23%", height: "8%", category: "Breakfast" },
        { id: 418, top: "top-[45.8%]", left: "left-[0%]", width: "23%", height: "9.8%", category: "Breakfast" },
        { id: 419, top: "top-[45.8%]", left: "left-[23.2%]", width: "23%", height: "9.8%", category: "Breakfast" },
        { id: 420, top: "top-[45.8%]", left: "left-[46.5%]", width: "23%", height: "9.8%", category: "Breakfast" },
        { id: 421, top: "top-[55.8%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 422, top: "top-[55.8%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 423, top: "top-[55.8%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 424, top: "top-[55.8%]", left: "left-[53.2%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 425, top: "top-[64.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 426, top: "top-[64.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 427, top: "top-[64.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 428, top: "top-[64.5%]", left: "left-[53.2%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 429, top: "top-[72.6%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 430, top: "top-[72.6%]", left: "left-[17.4%] ", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 431, top: "top-[72.6%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 432, top: "top-[72.6%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 433, top: "top-[81.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 434, top: "top-[81.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 435, top: "top-[81.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 436, top: "top-[81.5%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 437, top: "top-[90.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 438, top: "top-[90.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 439, top: "top-[90.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 440, top: "top-[90.5%]", left: "left-[53%]", width: "18%", height: "8.2%", category: "Breakfast" },
        { id: 441, top: "top-[1.1%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        { id: 442, top: "top-[10.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        { id: 443, top: "top-[19.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        { id: 444, top: "top-[28.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        { id: 445, top: "top-[37.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        { id: 446, top: "top-[46.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        { id: 447, top: "top-[55.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        { id: 448, top: "top-[64.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        { id: 449, top: "top-[73.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Breakfast" },
        { id: 450, top: "top-[84.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Breakfast" },

    ];

    const { productArray, setProductArray, productsData, setProductsData } = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: number;
    } | null>(null);




    const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;

        // Obtener las coordenadas del clic derecho
        const container = e.currentTarget.closest('.scroll-container') as HTMLElement;
        const containerRect = container?.getBoundingClientRect();

        let posX = e.clientX;
        let posY = e.clientY;

        if (containerRect) {
            posX = e.clientX - containerRect.left + container.scrollLeft;
            posY = e.clientY - containerRect.top + container.scrollTop;
        }

        // Ajustar las coordenadas para evitar que el menú se salga de la pantalla
        const menuWidth = 150; // Ancho estimado del menú contextual
        const menuHeight = 200; // Alto estimado del menú contextual

        if (posX + menuWidth > window.innerWidth) {
            posX -= menuWidth;
        }
        if (posY + menuHeight > window.innerHeight) {
            posY -= menuHeight;
        }

        // Establecer el estado del menú contextual con las coordenadas ajustadas
        setContextMenu({
            visible: true,
            x: posX - 125,
            y: posY,
            productId: cellId
        });
    };


    useEffect(() => {

        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const handleGridSelect = (
        gridId: number, 
        categoryGridSelected: categoriesInterface, 
        event: React.MouseEvent
      ) => {
        // Si hay un producto copiado y la celda está vacía
        if (copiedProduct && !selectedProducts.some(p => p.id_product === gridId)) {
          const newProduct = {
            ...copiedProduct,
            id_product: gridId
          };
          onProductSelect(gridId, categoryGridSelected, event);
          setProductArray([newProduct]);
          onPasteProduct();
          return;
        }
      
        // Lógica existente de selección...
        onProductSelect(gridId, categoryGridSelected, event);
    };


    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page04.jpg" alt="PDF" width={360} height={360} priority />
            {gridCells.map((cell) => {

                const selectedProduct = productArray?.find((p) => p.id_product === cell.id) || selectedProducts?.find((p) => p.id_product === cell.id);
                const categoryItem = { name_category: cell.category } as categoriesInterface;

                return (
                    <GridCardProduct
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                        onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                       
                    />
                );
            })}

            {contextMenu?.visible && !isMoveModeActive && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 1000
                    }}
                >
                    <RightClick
                        productId={contextMenu.productId}
                        handleRemoveProduct={onRemoveProduct}
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_product === contextMenu.productId) as ProductTypes}
                        copiedProduct={copiedProduct}
                    />
                </div>
            )}

        </div>
    );
};
