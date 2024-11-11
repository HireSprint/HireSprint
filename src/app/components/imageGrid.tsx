import Image from "next/image";
import { useState, useEffect } from "react";
import RightClick from "./rightClick";
import { GridCardProduct } from "./card";
import { useProductContext } from "../context/productContext";
import { ProductTypes } from "@/types/product";
import { categoriesInterface } from "@/types/category";
import { cellTypes } from "@/types/cell";
import { useCategoryContext } from "../context/categoryContext";


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
    const { getCategoryByName, isLoadingCategories, categoriesData } = useCategoryContext()

    const initialGridCells: cellTypes[] = [
        //meats
        { id: 1, top: "top-[21%] ", left: "left-[0%]", width: "23.5%", height: "6.5%", category: "Meat"},
        { id: 2, top: "top-[21%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 3, top: "top-[21%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 4, top: "top-[27.3%]", left: "left-[0%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 5, top: "top-[27.3%]", left: "left-[23.2%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 6, top: "top-[27.3%]", left: "left-[46.4%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 7, top: "top-[33.6%] ", left: "left-[0%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 8, top: "top-[33.6%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%", category: "Meat" },
        { id: 9, top: "top-[33.6%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%", category: "Meat" },
        //seaFood
        { id: 10, top: "top-[42%]", left: "left-0%", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 11, top: "top-[42%]", left: "left-[14.2%] ", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 12, top: "top-[42%]", left: "left-[28.4%] ", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 13, top: "top-[42%]", left: "left-[42.7%] ", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 14, top: "top-[42%]", left: "left-[57%] ", width: "14.5%", height: "6.4%", category: "SeaFood" },
        //SeaFood
        { id: 15, top: "top-[49.2%]", left: "left-[0]", width: "23.5%", height: "6.4%", category: "Deli" },
        { id: 16, top: "top-[49.2%]", left: "left-[23.9%] ", width: "23.5%", height: "6.4%", category: "Deli" },
        { id: 17, top: "top-[49.2%]", left: "left-[47.8%] ", width: "23.5%", height: "6.4%", category: "Deli" },
        //Grocery
        { id: 18, top: "top-[56.4%]", left: "left-[0%] ", width: "23.5%", height: "8.2%", category: "Grocery" },
        { id: 19, top: "top-[56.4%]", left: "left-[23.8%]", width: "23.5%", height: "8.2%", category: "Grocery" },
        { id: 20, top: "top-[56.4%]", left: "left-[47.5%]", width: "23.5%", height: "8.2%", category: "Grocery" },
        { id: 21, top: "top-[64.7%]", left: "left-[0%] ", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 22, top: "top-[64.7%]", left: "left-[18%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 23, top: "top-[64.7%]", left: "left-[35.5%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 24, top: "top-[64.7%]", left: "left-[53%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 25, top: "top-[71.5%]", left: "left-[0%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 26, top: "top-[71.5%]", left: "left-[18%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 27, top: "top-[71.5%]", left: "left-[35.5%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 28, top: "top-[71.5%]", left: "left-[53%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 29, top: "top-[78%]", left: "left-[0%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 30, top: "top-[78%]", left: "left-[18%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 31, top: "top-[78%]", left: "left-[35.5%]", width: "18%", height: "6.8%", category: "Grocery" },
        { id: 32, top: "top-[78%]", left: "left-[53%]", width: "18%", height: "6.8%", category: "Grocery" },
        //Dairy
        { id: 33, top: "top-[85.2%]", left: "left-[0%]", width: "18%", height: "6.4%", category: "Dairy" },
        { id: 34, top: "top-[85.2%]", left: "left-[18%]", width: "18%", height: "6.4%", category: "Dairy" },
        { id: 35, top: "top-[85.2%]", left: "left-[35.5%]", width: "18%", height: "6.4%", category: "Dairy" },
        { id: 36, top: "top-[85.2%]", left: "left-[53%]", width: "18%", height: "6.4%", category: "Dairy" },
        //froze
        { id: 37, top: "top-[92.2%]", left: "left-[0%]", width: "18%", height: "7%", category: "Dairy" },
        { id: 38, top: "top-[92.2%]", left: "left-[18%]", width: "18%", height: "7%", category: "Dairy" },
        { id: 39, top: "top-[92.2%]", left: "left-[35.5%]", width: "18%", height: "7%", category: "Dairy" },
        { id: 40, top: "top-[92.2%]", left: "left-[53%]", width: "18%", height: "7%", category: "Dairy" },
        //Produce
        { id: 41, top: "top-[20.5%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 42, top: "top-[27.9%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 43, top: "top-[35.3%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 44, top: "top-[42.7%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 45, top: "top-[50.1%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 46, top: "top-[57.5%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 47, top: "top-[64.9%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 48, top: "top-[72.3%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce" },
        { id: 49, top: "top-[79.7%]", left: "left-[72%]", width: "27%", height: "9%", category: "Produce" },
        { id: 50, top: "top-[88.5%]", left: "left-[72%]", width: "27%", height: "9%", category: "Produce" },
    ];

    
    const [productsData, setProductsData] = useState<ProductTypes[]>([]);
    const [gridCells, setGridCells] = useState<cellTypes[]>(initialGridCells);

    const { setProductArray } = useProductContext();

    useEffect(() => {
        if (!isLoadingCategories) {
            setGridCells((initialCells) =>
                initialCells.map((cell) => {
                    const matchedCategory = getCategoryByName(cell.category ?? '')
                    cell.idCategory = matchedCategory?.id_category
                    return cell;
                })
            );
        }
    }, [categoriesData]);

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
                        key={cell?.id}
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                        onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                        isLoading={isLoadingCategories}
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
    const { getCategoryByName, isLoadingCategories, categoriesData } = useCategoryContext()

    const initialGridCells: cellTypes[] = [
        // Grocery
        { id: 51, top: "top-[1%] ", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 52, top: "top-[1%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 53, top: "top-[1%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 54, top: "top-[1%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 55, top: "top-[1%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 56, top: "top-[6.8%]", left: "left-[0%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 57, top: "top-[6.8%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 58, top: "top-[6.8%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 59, top: "top-[6.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 60, top: "top-[6.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 61, top: "top-[12.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 62, top: "top-[12.5%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 63, top: "top-[12.5%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 64, top: "top-[12.5%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 65, top: "top-[12.5%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 66, top: "top-[18.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 67, top: "top-[18.2%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 68, top: "top-[18.2%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 69, top: "top-[18.2%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 70, top: "top-[18.2%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 71, top: "top-[23.9%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 72, top: "top-[23.9%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 73, top: "top-[23.9%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 74, top: "top-[23.9%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 75, top: "top-[23.9%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 76, top: "top-[29.6%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 77, top: "top-[29.6%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 78, top: "top-[29.6%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 79, top: "top-[29.6%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 80, top: "top-[29.6%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        //International
        { id: 81, top: "top-[36.3%]", left: "left-[0%]", width: "20.2%", height: "11%", category: "International" },
        { id: 82, top: "top-[36.3%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 83, top: "top-[36.3%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 84, top: "top-[36.3%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 85, top: "top-[36.3%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 86, top: "top-[41.8%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 87, top: "top-[41.8%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 88, top: "top-[41.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 89, top: "top-[41.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 90, top: "top-[47.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 91, top: "top-[47.5%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 92, top: "top-[47.5%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 93, top: "top-[47.5%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 94, top: "top-[47.5%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 95, top: "top-[53.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 96, top: "top-[53.2%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 97, top: "top-[53.2%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 98, top: "top-[53.2%]", left: "left-[60%]", width: "40%", height: "11.2%", category: "International" },
        { id: 99, top: "top-[59%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 100, top: "top-[59%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International" },
        { id: 101, top: "top-[59%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International" },
        //Breakfast
        { id: 102, top: "top-[65.8%]", left: "left-[0%]", width: "25.2%", height: "8.5%", category: "Breakfast" },
        { id: 103, top: "top-[65.8%]", left: "left-[25.2%]", width: "25.2%", height: "8.5%", category: "Breakfast" },
        { id: 104, top: "top-[65.8%]", left: "left-[50.4%]", width: "25.2%", height: "8.5%", category: "Breakfast" },
        { id: 105, top: "top-[65.8%]", left: "left-[75.6%]", width: "25.2%", height: "8.5%", category: "Breakfast" },
        { id: 106, top: "top-[74.3%]", left: "left-[0%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 107, top: "top-[74.3%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 108, top: "top-[74.3%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 109, top: "top-[74.3%]", left: "left-[75.6%]", width: "25.2%", height: "13.5%", category: "Breakfast" },
        { id: 110, top: "top-[80.8%]", left: "left-[0%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 111, top: "top-[80.8%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        { id: 112, top: "top-[80.8%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%", category: "Breakfast" },
        //Snack
        { id: 113, top: "top-[89.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Snack" },
        { id: 114, top: "top-[89.5%]", left: "left-[20.2%]", width: "20%", height: "5.5%", category: "Snack" },
        { id: 115, top: "top-[89.5%]", left: "left-[40.5%]", width: "19%", height: "5.5%", category: "Snack" },
        { id: 116, top: "top-[89.5%]", left: "left-[58.7%]", width: "20.2%", height: "5.5%", category: "Snack" },
        { id: 117, top: "top-[89.5%]", left: "left-[79.2%]", width: "20.8%", height: "10.5%", category: "Snack" },
        { id: 118, top: "top-[95%]", left: "left-[0%]", width: "20.2%", height: "4.8%", category: "Snack" },
        { id: 119, top: "top-[95%]", left: "left-[20.2%]", width: "20.2%", height: "4.8%", category: "Snack" },
        { id: 120, top: "top-[95%]", left: "left-[40.5%]", width: "19%", height: "4.8%", category: "Snack" },
        { id: 121, top: "top-[95%]", left: "left-[59.7%]", width: "20.2%", height: "4.8%", category: "Snack" },


    ];

    const { productArray, setProductArray, productsData, setProductsData } = useProductContext();
    const [gridCells, setGridCells] = useState<cellTypes[]>(initialGridCells);
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
        if (!isLoadingCategories) {
            setGridCells((initialCells) =>
                initialCells.map((cell) => {
                    const matchedCategory = getCategoryByName(cell.category ?? '')
                    cell.idCategory = matchedCategory?.id_category
                    return cell;
                })
            );
        }
    }, [categoriesData])


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
                        key={cell?.id}
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                        onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                        isLoading={isLoadingCategories}
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
    const { getCategoryByName, isLoadingCategories, categoriesData } = useCategoryContext()

    // + 5.7 top

    const initialGridCells: cellTypes[] = [
        // Dairy
        { id: 3001, top: "top-[1.8%] ", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3002, top: "top-[1.8%] ", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3003, top: "top-[1.8%] ", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3004, top: "top-[1.8%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3005, top: "top-[1.8%]", left: "left-[63%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3006, top: "top-[7.5%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3007, top: "top-[7.5%] ", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3008, top: "top-[7.5%] ", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3009, top: "top-[7.5%] ", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3010, top: "top-[7.5%]", left: "left-[63%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3011, top: "top-[13.3%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3012, top: "top-[13.3%]", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3013, top: "top-[13.3%]", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3014, top: "top-[13.3%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3015, top: "top-[13.3%]", left: "left-[63%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3016, top: "top-[19%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3017, top: "top-[19%]", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3018, top: "top-[19%]", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3019, top: "top-[19%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3020, top: "top-[19%]", left: "left-[63%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3021, top: "top-[24.8%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3022, top: "top-[24.8%]", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3023, top: "top-[24.8%]", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3024, top: "top-[24.8%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3025, top: "top-[24.8%]", left: "left-[63%]", width: "16.1%", height: "11.2%", category: "Dairy" },
        { id: 3026, top: "top-[30.5%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3027, top: "top-[30.5%]", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3028, top: "top-[30.5%]", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3029, top: "top-[30.5%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },


        // Frozen
        { id: 3030, top: "top-[37.4%]", left: "left-[0%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3031, top: "top-[37.4%]", left: "left-[13%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3032, top: "top-[37.4%]", left: "left-[26%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3033, top: "top-[37.4%]", left: "left-[39.2%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3034, top: "top-[37.4%]", left: "left-[52.3%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3035, top: "top-[37.4%]", left: "left-[65.5%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3036, top: "top-[42.4%]", left: "left-[0%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3037, top: "top-[42.4%]", left: "left-[13%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3038, top: "top-[42.4%]", left: "left-[26%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3039, top: "top-[42.4%]", left: "left-[39.2%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3040, top: "top-[42.4%]", left: "left-[52.3%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3041, top: "top-[42.4%]", left: "left-[65.5%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3042, top: "top-[47.4%]", left: "left-[0%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3043, top: "top-[47.4%]", left: "left-[13%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3044, top: "top-[47.4%]", left: "left-[26%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3045, top: "top-[47.4%]", left: "left-[39.2%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3046, top: "top-[47.4%]", left: "left-[52.3%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3047, top: "top-[47.4%]", left: "left-[65.5%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3048, top: "top-[52.4%]", left: "left-[0%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3049, top: "top-[52.4%]", left: "left-[13%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3050, top: "top-[52.4%]", left: "left-[26%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3051, top: "top-[52.4%]", left: "left-[39.2%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3052, top: "top-[52.4%]", left: "left-[52.3%]", width: "13.6%", height: "5.2%", category: "Frozen" },
        { id: 3053, top: "top-[52.4%]", left: "left-[65.5%]", width: "13.6%", height: "5.2%", category: "Frozen" },

        // Beverage
        { id: 3054, top: "top-[58.5%]", left: "left-[0%]", width: "13.6%", height: "10.1%", category: "Beverage" },
        { id: 3055, top: "top-[58.5%]", left: "left-[13%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3056, top: "top-[58.5%]", left: "left-[26%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3057, top: "top-[58.5%]", left: "left-[39.2%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3058, top: "top-[58.5%]", left: "left-[52.3%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3059, top: "top-[58.5%]", left: "left-[65.5%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3060, top: "top-[63.4%]", left: "left-[13%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3061, top: "top-[63.4%]", left: "left-[26%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3062, top: "top-[63.4%]", left: "left-[39.2%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3063, top: "top-[63.4%]", left: "left-[52.3%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3064, top: "top-[63.4%]", left: "left-[65.5%]", width: "13.6%", height: "5.2%", category: "Beverage" },
        { id: 3065, top: "top-[68.3%]", left: "left-[0%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3066, top: "top-[68.3%]", left: "left-[13%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3067, top: "top-[68.3%]", left: "left-[26%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3068, top: "top-[68.3%]", left: "left-[39.2%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3069, top: "top-[68.3%]", left: "left-[52.3%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3070, top: "top-[68.3%]", left: "left-[65.5%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3071, top: "top-[73.1%]", left: "left-[0%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3072, top: "top-[73.1%]", left: "left-[13%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3073, top: "top-[73.1%]", left: "left-[26%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3074, top: "top-[73.1%]", left: "left-[39.2%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3075, top: "top-[73.1%]", left: "left-[52.3%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3076, top: "top-[73.1%]", left: "left-[65.5%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3077, top: "top-[77.8%]", left: "left-[0%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3078, top: "top-[77.8%]", left: "left-[13%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3079, top: "top-[77.8%]", left: "left-[26%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3080, top: "top-[77.8%]", left: "left-[39.2%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3081, top: "top-[77.8%]", left: "left-[52.3%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3082, top: "top-[77.8%]", left: "left-[65.5%]", width: "13.6%", height: "9.7%", category: "Beverage" },
        { id: 3083, top: "top-[82.5%]", left: "left-[0%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3084, top: "top-[82.5%]", left: "left-[13%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3085, top: "top-[82.5%]", left: "left-[26%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3086, top: "top-[82.5%]", left: "left-[39.2%]", width: "13.6%", height: "5%", category: "Beverage" },
        { id: 3087, top: "top-[82.5%]", left: "left-[52.3%]", width: "13.6%", height: "5%", category: "Beverage" },

        // Extra
        { id: 3088, top: "top-[88.5%]", left: "left-[0%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3089, top: "top-[88.5%] ", left: "left-[16%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3090, top: "top-[88.5%] ", left: "left-[31.7%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3091, top: "top-[88.5%]", left: "left-[47.2%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3092, top: "top-[88.5%]", left: "left-[63%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3093, top: "top-[94.1%]", left: "left-[0%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3094, top: "top-[94.1%] ", left: "left-[16%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3095, top: "top-[94.1%] ", left: "left-[31.7%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3096, top: "top-[94.1%]", left: "left-[47.2%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3097, top: "top-[94.1%]", left: "left-[63%]", width: "16.1%", height: "5.8%", category: "Extra" },

        // Special
        { id: 3098, top: "top-[9.5%]", left: "left-[79%]", width: "21%", height: "9%", category: "Special" },
        { id: 3099, top: "top-[18.5%]", left: "left-[79%]", width: "21%", height: "9%", category: "Special" },
        { id: 3100, top: "top-[27.5%]", left: "left-[79%]", width: "21%", height: "9%", category: "Special" },
        { id: 3101, top: "top-[36.5%]", left: "left-[79%]", width: "21%", height: "9%", category: "Special" },
        { id: 3102, top: "top-[45.5%]", left: "left-[79%]", width: "21%", height: "9%", category: "Special" },
        { id: 3103, top: "top-[54.4%]", left: "left-[79%]", width: "21%", height: "9%", category: "Special" },
        { id: 3104, top: "top-[63.5%]", left: "left-[79%]", width: "21%", height: "9%", category: "Special" },
        { id: 3105, top: "top-[72.4%]", left: "left-[79%]", width: "21%", height: "9.3%", category: "Special" },
        { id: 3106, top: "top-[81.6%]", left: "left-[79%]", width: "21%", height: "9.3%", category: "Special" },
        { id: 3107, top: "top-[90.7%]", left: "left-[79%]", width: "21%", height: "9.3%", category: "Special" },

    ];

    const { productArray, setProductArray, productsData, setProductsData } = useProductContext();

    const [gridCells, setGridCells] = useState<cellTypes[]>(initialGridCells);
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
        if (!isLoadingCategories) {
            setGridCells((initialCells) =>
                initialCells.map((cell) => {
                    const matchedCategory = getCategoryByName(cell.category ?? '')
                    cell.idCategory = matchedCategory?.id_category
                    return cell;
                })
            );
        }
    }, [categoriesData])

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
                        key={cell?.id}
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                        onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                        isLoading={isLoadingCategories}
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
    const { getCategoryByName, isLoadingCategories, categoriesData } = useCategoryContext()

    const initialGridCells: cellTypes[] = [
        // Meat
        { id: 401, top: "top-[1.5%] ", left: "left-[21.6%]", width: "26.3%", height: "7.8%", category: "Meat" },
        { id: 402, top: "top-[1.5%] ", left: "left-[48%]", width: "26.3%", height: "7.8%", category: "Meat" },
        { id: 403, top: "top-[1.5%] ", left: "left-[74.4%]", width: "25.5%", height: "7.8%", category: "Meat" },
        { id: 404, top: "top-[9.5%]", left: "left-[21.6%]", width: "20%", height: "7%", category: "Meat" },
        { id: 405, top: "top-[9.5%]", left: "left-[41%]", width: "20%", height: "7%", category: "Meat" },
        { id: 406, top: "top-[9.5%]", left: "left-[60.5%] ", width: "20%", height: "7%", category: "Meat" },
        { id: 407, top: "top-[9.5%] ", left: "left-[79.9%]", width: "20%", height: "7%", category: "Meat" },
        { id: 408, top: "top-[16.6%] ", left: "left-[21.6%]", width: "20%", height: "7%", category: "Meat" },
        { id: 409, top: "top-[16.6%] ", left: "left-[41%]", width: "20%", height: "7%", category: "Meat" },
        { id: 410, top: "top-[16.6%]", left: "left-[60.5%] ", width: "20%", height: "7%", category: "Meat" },
        { id: 411, top: "top-[16.6%]", left: "left-[79.9%] ", width: "20%", height: "14.1%", category: "Meat" },
        { id: 412, top: "top-[23.7%] ", left: "left-[21.6%]", width: "20%", height: "7%", category: "Meat" },
        { id: 413, top: "top-[23.7%] ", left: "left-[41%]", width: "20%", height: "7%", category: "Meat" },
        { id: 414, top: "top-[23.7%]", left: "left-[60.5%] ", width: "20%", height: "7%", category: "Meat" },

        // Produce
        { id: 415, top: "top-[31.7%]", left: "left-[21.6%] ", width: "20.2%", height: "8.3%", category: "Produce" },
        { id: 416, top: "top-[31.7%]", left: "left-[41.2%] ", width: "20.2%", height: "8.3%", category: "Produce" },
        { id: 417, top: "top-[31.7%]", left: "left-[60.7%] ", width: "20.2%", height: "8.3%", category: "Produce" },
        { id: 418, top: "top-[31.7%]", left: "left-[80.4%] ", width: "19.7%", height: "8.3%", category: "Produce" },
        { id: 419, top: "top-[39.8%]", left: "left-[21.6%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 420, top: "top-[39.8%]", left: "left-[37.2%] ", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 421, top: "top-[39.8%]", left: "left-[52.8%] ", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 422, top: "top-[39.8%]", left: "left-[68.3%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 422, top: "top-[39.8%]", left: "left-[83.8%]", width: "15.8%", height: "11.2%", category: "Produce" },
        { id: 423, top: "top-[45.4%]", left: "left-[21.6%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 424, top: "top-[45.4%]", left: "left-[37.2%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 425, top: "top-[45.4%]", left: "left-[52.8%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 426, top: "top-[45.4%]", left: "left-[68.3%]", width: "15.8%", height: "5.7%", category: "Produce" },

        { id: 427, top: "top-[51%]", left: "left-[21.6%]", width: "31.6%", height: "11%", category: "Produce" },
        { id: 428, top: "top-[51%]", left: "left-[52.8%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 429, top: "top-[51%]", left: "left-[68.3%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 430, top: "top-[51%]", left: "left-[83.8%]", width: "15.8%", height: "5.7%", category: "Produce" },
        // { id: 431, top: "top-[64.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Produce" },
        // { id: 432, top: "top-[64.5%]", left: "left-[53.2%]", width: "18%", height: "8.2%", category: "Produce" },
        // { id: 433, top: "top-[72.6%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Produce" },



        // { id: 434, top: "top-[72.6%]", left: "left-[17.4%] ", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 435, top: "top-[72.6%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 436, top: "top-[72.6%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 437, top: "top-[81.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 438, top: "top-[81.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 439, top: "top-[81.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 440, top: "top-[81.5%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 441, top: "top-[90.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 442, top: "top-[90.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 443, top: "top-[90.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 444, top: "top-[90.5%]", left: "left-[53%]", width: "18%", height: "8.2%", category: "Breakfast" },
        // { id: 445, top: "top-[1.1%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        // { id: 446, top: "top-[10.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        // { id: 447, top: "top-[19.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        // { id: 448, top: "top-[28.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        // { id: 449, top: "top-[37.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        // { id: 450, top: "top-[46.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        // { id: 451, top: "top-[55.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        // { id: 452, top: "top-[64.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast" },
        // { id: 453, top: "top-[73.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Breakfast" },
        // { id: 454, top: "top-[84.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Breakfast" },

    ];

    const { productArray, setProductArray, productsData, setProductsData } = useProductContext();
    const [gridCells, setGridCells] = useState<cellTypes[]>(initialGridCells);
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
        if (!isLoadingCategories) {
            setGridCells((initialCells) =>
                initialCells.map((cell) => {
                    const matchedCategory = getCategoryByName(cell.category ?? '')
                    cell.idCategory = matchedCategory?.id_category
                    return cell;
                })
            );
        }
    }, [categoriesData])
    
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
                        key={cell?.id}
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                        onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                        isLoading={isLoadingCategories}
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
