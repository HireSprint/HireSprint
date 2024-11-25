import Image from "next/image";
import { useState, useEffect } from "react";
import RightClick from "./rightClick";
import { GridCardProduct } from "./card";
import { useProductContext } from "../context/productContext";
import { ProductTypes } from "@/types/product";
import { categoriesInterface } from "@/types/category";
import { cellTypes } from "@/types/cell";
import { useCategoryContext } from "../context/categoryContext";
import { useAuth } from "./provider/authprovider";


interface ImageGridProps {
    onGridCellClick: (gridId: number, idCategory: number | undefined, event: React.MouseEvent) => void;
    onRemoveProduct: (gridId: number) => void;
    onEditProduct: (gridId: number) => void;
    onChangeProduct: (gridId: number) => void;
    isMoveModeActive: boolean;
    onCopyProduct: (product: ProductTypes) => void;
    copiedProduct: ProductTypes | null;
    onDragAndDropCell: (gridCellToMove: any, stopDragEvent: MouseEvent) => void;

}

export const ImageGrid = ({
    onGridCellClick,
    onRemoveProduct,
    onChangeProduct,
    isMoveModeActive,
    onCopyProduct,
    copiedProduct,
    onDragAndDropCell

}: ImageGridProps) => {
    const { getCategoryByName, isLoadingCategories, categoriesData } = useCategoryContext()
    const { selectedProducts, productDragging, setProductDragging } = useProductContext();

    const initialGridCells: cellTypes[] = [
        //meats
        { id: 1001, top: "top-[20.8%]", left: "left-[0%]", width: "24.2%", height: "6.9%", category: "Meat"},
        { id: 1002, top: "top-[20.8%]", left: "left-[24%]", width: "24.2%", height: "6.9%", category: "Meat" },
        { id: 1003, top: "top-[20.8%]", left: "left-[47.5%]", width: "24.2%", height: "6.9%", category: "Meat" },
        { id: 1004, top: "top-[27.6%]", left: "left-[0%]", width: "24.2%", height: "6.9%", category: "Meat" },
        { id: 1005, top: "top-[27.6%]", left: "left-[24%]", width: "24.2%", height: "6.9%", category: "Meat" },
        { id: 1006, top: "top-[27.6%]", left: "left-[47.5%]", width: "24.2%", height: "6.9%", category: "Meat" },
        { id: 1007, top: "top-[34.4%]", left: "left-[0%]", width: "24.2%", height: "6.9%", category: "Meat" },
        { id: 1008, top: "top-[34.4%]", left: "left-[24%]", width: "24.2%", height: "6.9%", category: "Meat" },
        { id: 1009, top: "top-[34.4%]", left: "left-[47.5%]", width: "24.2%", height: "6.9%", category: "Meat" },

        //seaFood
        { id: 1010, top: "top-[42%]", left: "left-0%", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 1011, top: "top-[42%]", left: "left-[14.2%]", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 1012, top: "top-[42%]", left: "left-[28.4%]", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 1013, top: "top-[42%]", left: "left-[42.7%]", width: "14.5%", height: "6.4%", category: "SeaFood" },
        { id: 1014, top: "top-[42%]", left: "left-[57%]", width: "14.5%", height: "6.4%", category: "SeaFood" },

        //Deli
        { id: 1015, top: "top-[49.2%]", left: "left-[0]", width: "18.2%", height: "6.4%", category: "Deli" },
        { id: 1016, top: "top-[49.2%]", left: "left-[17.9%]", width: "18.2%", height: "6.4%", category: "Deli" },
        { id: 1017, top: "top-[49.2%]", left: "left-[35.8%]", width: "18.2%", height: "6.4%", category: "Deli" },
        { id: 1018, top: "top-[49.2%]", left: "left-[53.8%]", width: "18.2%", height: "6.4%", category: "Deli" },

        //Grocery
        { id: 1019, top: "top-[56.4%]", left: "left-[0%]", width: "24.2%", height: "8.2%", category: "Grocery" },
        { id: 1020, top: "top-[56.4%]", left: "left-[23.8%]", width: "24.2%", height: "8.2%", category: "Grocery" },
        { id: 1021, top: "top-[56.4%]", left: "left-[47.9%]", width: "24.2%", height: "8.2%", category: "Grocery" },
        { id: 1022, top: "top-[64.7%]", left: "left-[0%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1023, top: "top-[64.7%]", left: "left-[18.1%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1024, top: "top-[64.7%]", left: "left-[35.8%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1025, top: "top-[64.7%]", left: "left-[53.7%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1026, top: "top-[71.2%]", left: "left-[0%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1027, top: "top-[71.2%]", left: "left-[18.1%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1028, top: "top-[71.2%]", left: "left-[35.8%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1029, top: "top-[71.2%]", left: "left-[53.7%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1030, top: "top-[77.7%]", left: "left-[0%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1031, top: "top-[77.7%]", left: "left-[18.1%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1032, top: "top-[77.7%]", left: "left-[35.8%]", width: "18.2%", height: "6.7%", category: "Grocery" },
        { id: 1033, top: "top-[77.7%]", left: "left-[53.7%]", width: "18.2%", height: "6.7%", category: "Grocery" },

        //Dairy
        { id: 1034, top: "top-[85.2%]", left: "left-[0%]", width: "18.2%", height: "6.4%", category: "Dairy" },
        { id: 1035, top: "top-[85.2%]", left: "left-[18.1%]", width: "18.2%", height: "6.4%", category: "Dairy" },
        { id: 1036, top: "top-[85.2%]", left: "left-[35.8%]", width: "18.2%", height: "6.4%", category: "Dairy" },
        { id: 1037, top: "top-[85.2%]", left: "left-[53.7%]", width: "18.2%", height: "6.4%", category: "Dairy" },

        //froze
        { id: 1038, top: "top-[92.2%]", left: "left-[0%]", width: "18.2%", height: "7%", category: "Dairy" },
        { id: 1039, top: "top-[92.2%]", left: "left-[18.1%]", width: "18.2%", height: "7%", category: "Dairy" },
        { id: 1040, top: "top-[92.2%]", left: "left-[35.8%]", width: "18.2%", height: "7%", category: "Dairy" },
        { id: 1041, top: "top-[92.2%]", left: "left-[53.7%]", width: "18.2%", height: "7%", category: "Dairy" },

        //Produce
        { id: 1042, top: "top-[20.7%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
        { id: 1043, top: "top-[28.5%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
        { id: 1044, top: "top-[36.3%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
        { id: 1045, top: "top-[44.1%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
        { id: 1046, top: "top-[52%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
        { id: 1047, top: "top-[59.8%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
        { id: 1048, top: "top-[67.7%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
        { id: 1049, top: "top-[75.5%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
        { id: 1050, top: "top-[83.4%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
        { id: 1051, top: "top-[91.2%]", left: "left-[72%]", width: "27%", height: "8%", category: "Produce" },
    ];


    const [gridCells, setGridCells] = useState<cellTypes[]>(initialGridCells);

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
        gridId: number;
    } | null>(null);


    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const handleContextMenu = (e: React.MouseEvent, gridId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;
        const selectedProduct = selectedProducts.find(p => p.id_grid === gridId);
        if (selectedProduct) {
            setContextMenu({
                visible: true,
                x: e.clientX,
                y: e.clientY,
                gridId: gridId
            });
        }
    };


    return (
        <div className={`relative no-scrollbar ${ productDragging ? 'overflow-visible' : 'overflow-auto' }`} >
            <Image src="/pages/page01.jpg" alt="PDF" width={400} height={400} priority />
            {gridCells.map((cell) => {
                const selectedProduct = selectedProducts?.find((p) => p.id_grid === cell.id);

                return (
                    <GridCardProduct
                        key={cell?.id}
                        product={selectedProduct!}
                        cell={cell}
                        onGridCellClick={onGridCellClick}
                        onContextMenu={handleContextMenu}
                        isLoading={isLoadingCategories}
                        onDragAndDropCell={onDragAndDropCell}
                        page={1}
                    />
                );
            })}

            {contextMenu?.visible && !isMoveModeActive && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 800
                    }}
                >
                    <RightClick
                        gridId={contextMenu.gridId}
                        handleRemoveProduct={onRemoveProduct}
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_grid === contextMenu.gridId) as ProductTypes}
                        copiedProduct={copiedProduct}
                    />
                </div>
            )}
        </div>
    );
};


export const ImageGrid2 = ({
    onGridCellClick,
    isMoveModeActive,
    onRemoveProduct,
    onChangeProduct,
    onCopyProduct,
    copiedProduct,
    onDragAndDropCell
}: ImageGridProps) => {
    const { getCategoryByName, isLoadingCategories, categoriesData } = useCategoryContext()
    const { circulars, idCircular } = useAuth();
    const { productArray, productsData, selectedProducts, setSelectedProducts, productDragging } = useProductContext();
    const [ hasFilledGrid, setHasFilledGrid ] = useState(false);
    const initialGridCells: cellTypes[] = [
        // Grocery
        { id: 2001, top: "top-[1%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2002, top: "top-[1%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2003, top: "top-[1%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2004, top: "top-[1%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2005, top: "top-[1%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2006, top: "top-[6.8%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2007, top: "top-[6.8%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2008, top: "top-[6.8%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2009, top: "top-[6.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2010, top: "top-[6.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2011, top: "top-[12.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2012, top: "top-[12.5%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2013, top: "top-[12.5%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2014, top: "top-[12.5%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2015, top: "top-[12.5%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2016, top: "top-[18.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2017, top: "top-[18.2%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2018, top: "top-[18.2%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2019, top: "top-[18.2%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery" },
        { id: 2020, top: "top-[18.2%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery" },
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
        { id: 2052, top: "top-[65.8%]", left: "left-[0%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
        { id: 2053, top: "top-[65.8%]", left: "left-[25.2%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
        { id: 2054, top: "top-[65.8%]", left: "left-[50.4%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
        { id: 2055, top: "top-[65.8%]", left: "left-[75.6%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
        { id: 2056, top: "top-[73.1%]", left: "left-[0%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
        { id: 2057, top: "top-[73.1%]", left: "left-[25.2%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
        { id: 2058, top: "top-[73.1%]", left: "left-[50.4%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
        { id: 2059, top: "top-[73.1%]", left: "left-[75.6%]", width: "25.2%", height: "14.8%", category: "Breakfast" },
        { id: 2060, top: "top-[80.4%]", left: "left-[0%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
        { id: 2061, top: "top-[80.4%]", left: "left-[25.2%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
        { id: 2062, top: "top-[80.4%]", left: "left-[50.4%]", width: "25.2%", height: "7.5%", category: "Breakfast" },
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

    const [gridCells, setGridCells] = useState<cellTypes[]>(initialGridCells);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        gridId: number;
    } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, gridId: number) => {
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
            gridId: gridId
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
        if (productsData.length && gridCells.length && !hasFilledGrid && circulars?.length > 0) {
            const numericIdCircular = idCircular;
            const currentCircular = circulars.find(circular =>
                circular.id_circular === numericIdCircular
            );

            if (currentCircular) {
                const circularUPCs = currentCircular.circular_products_upc || [];

                let list:string[] = []

                Object.values(circularUPCs).map((item: { upc:string,id_grid:number })=>(
                    list.push(item.upc)
                ))
                const circularProducts = productsData.filter((product:ProductTypes) =>
                    list.includes(product.upc)
                );


                const gridFilled = fillGridWithProducts(gridCells, circularProducts);
                setSelectedProducts(prev => {
                    const newProducts = [...prev, ...gridFilled];
                    return newProducts;
                });

                if (gridCells.some((cell) => cell?.idCategory != undefined && cell?.idCategory != null)) {
                    setHasFilledGrid(true);
                }
            }
        }
    }, [productsData, gridCells, circulars, idCircular]);

    useEffect(() => {
        if (selectedProducts.length > 0) {
            localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
        }
    }, [selectedProducts]);

    const fillGridWithProducts = (gridCells: cellTypes[], products: ProductTypes[]) => {
        // 1. Crear un mapa para agrupar productos por categoría
        const productsByCategory = products.reduce((acc, product) => {
            if (!acc[product.id_category]) {
                acc[product.id_category] = [];
            }
            acc[product.id_category].push(product);
            return acc;
        }, {} as Record<number, ProductTypes[]>);

        // 2. Asignar productos a las celdas de la grilla
        const filledGrid = gridCells.reduce((acc: ProductTypes[], cell: cellTypes) => {
            const { idCategory } = cell;
            if (idCategory) {
                const productsForCategory = productsByCategory[idCategory] || [];
                if (productsForCategory.length > 0) {
                    const product = productsForCategory.shift()!;
                    acc.push({ ...product, id_grid: cell.id });
                }
            }
            return acc;
        }, []);

        return filledGrid;
    };

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    return (
        <div className={`relative no-scrollbar ${ productDragging ? '' : 'overflow-auto' }`} >
            <Image src="/pages/page02.jpg" alt="PDF" width={360} height={360} priority sizes="(max-width: 768px) 100vw, 360px" className={`${productDragging ? '!z-0' : ''}`}/>
            {gridCells.map((cell) => {

                const selectedProduct = selectedProducts?.find((p) => p.id_grid === cell.id);


                return (
                    <GridCardProduct
                        key={cell?.id}
                        product={selectedProduct!}
                        cell={cell}
                        onGridCellClick={onGridCellClick}
                        onContextMenu={handleContextMenu}
                        isLoading={isLoadingCategories}
                        onDragAndDropCell={onDragAndDropCell}
                        page={2}

                    />
                );
            })}

            {contextMenu?.visible && !isMoveModeActive && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 800
                    }}
                >
                    <RightClick
                        gridId={contextMenu.gridId}
                        handleRemoveProduct={onRemoveProduct}
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_grid === contextMenu.gridId) as ProductTypes}
                        copiedProduct={copiedProduct}
                    />
                </div>
            )}
        </div>
    );
};

export const ImageGrid3 = ({
    onGridCellClick,
    isMoveModeActive,
    onRemoveProduct,
    onChangeProduct,
    onCopyProduct,
    copiedProduct,
    onDragAndDropCell
}: ImageGridProps) => {
    const { getCategoryByName, isLoadingCategories, categoriesData,} = useCategoryContext()
    const { productArray, productsData, selectedProducts, setSelectedProducts, productDragging } = useProductContext();
    const [ hasFilledGrid, setHasFilledGrid ] = useState(false);
    const { circulars, idCircular } = useAuth();
    const initialGridCells: cellTypes[] = [
        // Dairy
        { id: 3001, top: "top-[1.6%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3002, top: "top-[1.6%]", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3003, top: "top-[1.6%]", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3004, top: "top-[1.6%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3005, top: "top-[1.6%]", left: "left-[63%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3006, top: "top-[7.4%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3007, top: "top-[7.4%]", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3008, top: "top-[7.4%]", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3009, top: "top-[7.4%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3010, top: "top-[7.4%]", left: "left-[63%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3011, top: "top-[13.2%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3012, top: "top-[13.2%]", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3013, top: "top-[13.2%]", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3014, top: "top-[13.2%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3015, top: "top-[13.2%]", left: "left-[63%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3016, top: "top-[18.9%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3017, top: "top-[18.9%]", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3018, top: "top-[18.9%]", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3019, top: "top-[18.9%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3020, top: "top-[18.9%]", left: "left-[63%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3021, top: "top-[24.7%]", left: "left-[0%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3022, top: "top-[24.7%]", left: "left-[16%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3023, top: "top-[24.7%]", left: "left-[31.7%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3024, top: "top-[24.7%]", left: "left-[47.2%]", width: "16.1%", height: "5.5%", category: "Dairy" },
        { id: 3025, top: "top-[24.7%]", left: "left-[63%]", width: "16.1%", height: "11.4%", category: "Dairy" },
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
        { id: 3089, top: "top-[88.5%]", left: "left-[16%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3090, top: "top-[88.5%]", left: "left-[31.7%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3091, top: "top-[88.5%]", left: "left-[47.2%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3092, top: "top-[88.5%]", left: "left-[63%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3093, top: "top-[94.1%]", left: "left-[0%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3094, top: "top-[94.1%]", left: "left-[16%]", width: "16.1%", height: "5.8%", category: "Extra" },
        { id: 3095, top: "top-[94.1%]", left: "left-[31.7%]", width: "16.1%", height: "5.8%", category: "Extra" },
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

    const [gridCells, setGridCells] = useState<cellTypes[]>(initialGridCells);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        gridId: number;
    } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, gridId: number) => {
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
            gridId: gridId
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
        if (productsData.length && gridCells.length && !hasFilledGrid && circulars?.length > 0) {
            // Convertir idCircular a número para asegurar una comparación correcta
            const numericIdCircular = idCircular;

            // Buscar el circular correcto usando el id_circular
            const currentCircular = circulars.find(circular =>
                circular.id_circular === numericIdCircular
            );

            if (currentCircular) {
                // Obtener los UPCs del circular actual
                const circularUPCs = currentCircular.circular_products_upc || [];
                let list:string[] = []

                Object.values(circularUPCs).map((item: { upc:string,id_grid:number })=>(
                    list.push(item.upc)
                ))
                const circularProducts = productsData.filter((product:ProductTypes) =>
                    list.includes(product.upc)
                );

                // Llenar la grilla con los productos filtrados
                const gridFilled = fillGridWithProducts(gridCells, circularProducts);
                setSelectedProducts(prev => [...prev, ...gridFilled]);

                if (gridCells.some((cell) => cell?.idCategory != undefined && cell?.idCategory != null)) {
                    setHasFilledGrid(true);
                }
            } else {
            }
        }
    }, [productsData, gridCells, circulars, idCircular]);

    const fillGridWithProducts = (gridCells: cellTypes[], products: ProductTypes[]) => {
        // 1. Crear un mapa para agrupar productos por categoría
        const productsByCategory = products.reduce((acc, product) => {
            if (!acc[product.id_category]) {
                acc[product.id_category] = [];
            }
            acc[product.id_category].push(product);
            return acc;
        }, {} as Record<number, ProductTypes[]>);

        // 2. Asignar productos a las celdas de la grilla
        const filledGrid = gridCells.reduce((acc: ProductTypes[], cell: cellTypes) => {
            const { idCategory } = cell;
            if (idCategory) {
                const productsForCategory = productsByCategory[idCategory] || [];
                if (productsForCategory.length > 0) {
                    const product = productsForCategory.shift()!;
                    acc.push({ ...product, id_grid: cell.id });
                }
            }
            return acc;
        }, []);

        return filledGrid;
    };

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    return (
        <div className={`relative no-scrollbar ${ productDragging ? 'overflow-visible' : 'overflow-auto' }`} >
            <Image
                src="/pages/page03.jpg"
                alt="PDF"
                width={470}
                height={460}
                priority
                sizes="(max-width: 768px) 100vw, 470px"
            />
            {gridCells.map((cell) => {

                const selectedProduct = selectedProducts?.find((p) => p.id_grid === cell.id);


                return (
                    <GridCardProduct
                    key={cell?.id}
                    product={selectedProduct!}
                    cell={cell}
                    onGridCellClick={onGridCellClick}
                    onContextMenu={handleContextMenu}
                    isLoading={isLoadingCategories}
                    onDragAndDropCell={onDragAndDropCell}
                    page={3}
                    />
                );
            })}

            {contextMenu?.visible && !isMoveModeActive && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 800
                    }}
                >
                    <RightClick
                        gridId={contextMenu.gridId}
                        handleRemoveProduct={onRemoveProduct}
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_grid === contextMenu.gridId) as ProductTypes}
                        copiedProduct={copiedProduct}
                    />
                </div>
            )}

        </div>
    );
};

export const ImageGrid4 = ({
    onGridCellClick,
    isMoveModeActive,
    onRemoveProduct,
    onChangeProduct,
    onCopyProduct,
    copiedProduct,
    onDragAndDropCell
}: ImageGridProps) => {
    const { getCategoryByName, isLoadingCategories, categoriesData } = useCategoryContext()
    const { idCircular, circulars } = useAuth();
    const { productArray, productsData, selectedProducts, setSelectedProducts, productDragging } = useProductContext();
    const [hasFilledGrid, setHasFilledGrid] = useState(false);
    const initialGridCells: cellTypes[] = [
        // Meat
        { id: 4001, top: "top-[1.5%]", left: "left-[21.6%]", width: "26.3%", height: "8.2%", category: "Meat" },
        { id: 4002, top: "top-[1.5%]", left: "left-[48%]", width: "26.3%", height: "8.2%", category: "Meat" },
        { id: 4003, top: "top-[1.5%]", left: "left-[74.4%]", width: "25.5%", height: "8.2%", category: "Meat" },
        { id: 4004, top: "top-[9.5%]", left: "left-[21.6%]", width: "20%", height: "7%", category: "Meat" },
        { id: 4005, top: "top-[9.5%]", left: "left-[41.1%]", width: "20%", height: "7%", category: "Meat" },
        { id: 4006, top: "top-[9.5%]", left: "left-[60.5%]", width: "20%", height: "7%", category: "Meat" },
        { id: 4007, top: "top-[9.5%]", left: "left-[79.9%]", width: "20%", height: "7%", category: "Meat" },
        { id: 4008, top: "top-[16.6%]", left: "left-[21.6%]", width: "20%", height: "7%", category: "Meat" },
        { id: 4009, top: "top-[16.6%]", left: "left-[41.1%]", width: "20%", height: "7%", category: "Meat" },
        { id: 4010, top: "top-[16.6%]", left: "left-[60.5%]", width: "20%", height: "7%", category: "Meat" },
        { id: 4011, top: "top-[16.6%]", left: "left-[79.9%]", width: "20%", height: "14.1%", category: "Meat" },
        { id: 4012, top: "top-[23.7%]", left: "left-[21.6%]", width: "20%", height: "7%", category: "Meat" },
        { id: 4013, top: "top-[23.7%]", left: "left-[41.1%]", width: "20%", height: "7%", category: "Meat" },
        { id: 4014, top: "top-[23.7%]", left: "left-[60.5%]", width: "20%", height: "7%", category: "Meat" },

        // Produce
        { id: 4015, top: "top-[31.9%]", left: "left-[21.6%]", width: "20.2%", height: "8.3%", category: "Produce" },
        { id: 4016, top: "top-[31.9%]", left: "left-[41.2%]", width: "20.2%", height: "8.3%", category: "Produce" },
        { id: 4017, top: "top-[31.9%]", left: "left-[60.7%]", width: "20.2%", height: "8.3%", category: "Produce" },
        { id: 4018, top: "top-[31.9%]", left: "left-[80.4%]", width: "19.7%", height: "8.3%", category: "Produce" },
        { id: 4019, top: "top-[39.9%]", left: "left-[21.6%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4020, top: "top-[39.9%]", left: "left-[37.2%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4021, top: "top-[39.9%]", left: "left-[52.8%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4022, top: "top-[39.9%]", left: "left-[68.3%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4023, top: "top-[39.9%]", left: "left-[83.8%]", width: "15.8%", height: "11.2%", category: "Produce" },
        { id: 4024, top: "top-[45.3%]", left: "left-[21.6%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4025, top: "top-[45.3%]", left: "left-[37.2%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4026, top: "top-[45.3%]", left: "left-[52.8%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4027, top: "top-[45.3%]", left: "left-[68.3%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4028, top: "top-[50.6%]", left: "left-[21.6%]", width: "31.6%", height: "11.2%", category: "Produce" },
        { id: 4029, top: "top-[50.6%]", left: "left-[52.8%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4030, top: "top-[50.6%]", left: "left-[68.3%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4031, top: "top-[50.6%]", left: "left-[83.8%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4032, top: "top-[56.1%]", left: "left-[52.8%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4033, top: "top-[56.1%]", left: "left-[68.3%]", width: "15.8%", height: "5.7%", category: "Produce" },
        { id: 4034, top: "top-[56.1%]", left: "left-[83.8%]", width: "15.8%", height: "5.7%", category: "Produce" },

        // Fish
        { id: 4035, top: "top-[63.3%]", left: "left-[21.6%]", width: "20%", height: "7.6%", category: "Fish" },
        { id: 4036, top: "top-[63.3%]", left: "left-[41.1%]", width: "20%", height: "7.6%", category: "Fish" },
        { id: 4037, top: "top-[63.3%]", left: "left-[60.5%]", width: "20%", height: "7.6%", category: "Fish" },
        { id: 4038, top: "top-[63.3%]", left: "left-[79.9%]", width: "20%", height: "7.6%", category: "Fish" },

        // Deli
        { id: 4039, top: "top-[72.5%]", left: "left-[21.6%]", width: "20%", height: "13.9%", category: "Deli" },
        { id: 4040, top: "top-[72.5%]", left: "left-[41.1%]", width: "20%", height: "7%", category: "Deli" },
        { id: 4041, top: "top-[72.5%]", left: "left-[60.5%]", width: "20%", height: "7%", category: "Deli" },
        { id: 4042, top: "top-[72.5%]", left: "left-[79.9%]", width: "20%", height: "7%", category: "Deli" },
        { id: 4043, top: "top-[79.4%]", left: "left-[41.1%]", width: "20%", height: "7%", category: "Deli" },
        { id: 4044, top: "top-[79.4%]", left: "left-[60.5%]", width: "20%", height: "7%", category: "Deli" },
        { id: 4045, top: "top-[79.4%]", left: "left-[79.9%]", width: "20%", height: "7%", category: "Deli" },
        { id: 4046, top: "top-[86.2%]", left: "left-[21.6%]", width: "20%", height: "7%", category: "Deli" },
        { id: 4047, top: "top-[86.2%]", left: "left-[41.1%]", width: "20%", height: "7%", category: "Deli" },
        { id: 4048, top: "top-[86.2%]", left: "left-[60.5%]", width: "20%", height: "7%", category: "Deli" },
        { id: 4049, top: "top-[86.2%]", left: "left-[79.9%]", width: "20%", height: "7%", category: "Deli" },

        // Better
        { id: 4050, top: "top-[94.6%]", left: "left-[21.6%]", width: "15.8%", height: "5.4%", category: "Better For You" },
        { id: 4051, top: "top-[94.6%]", left: "left-[37.2%]", width: "15.8%", height: "5.4%", category: "Better For You" },
        { id: 4052, top: "top-[94.6%]", left: "left-[52.8%]", width: "15.8%", height: "5.4%", category: "Better For You" },
        { id: 4053, top: "top-[94.6%]", left: "left-[68.3%]", width: "15.8%", height: "5.4%", category: "Better For You" },
        { id: 4054, top: "top-[94.6%]", left: "left-[83.8%]", width: "15.8%", height: "5.4%", category: "Better For You" },

        // Liquor-Beer
        { id: 4055, top: "top-[16.4%]", left: "left-[0%]", width: "22%", height: "9.9%", category: "Liquor-Beer" },
        { id: 4056, top: "top-[26%]", left: "left-[0%]", width: "22%", height: "9.9%", category: "Liquor-Beer" },
        { id: 4057, top: "top-[35.7%]", left: "left-[0%]", width: "22%", height: "9.9%", category: "Liquor-Beer" },
        { id: 4058, top: "top-[45.3%]", left: "left-[0%]", width: "22%", height: "9.9%", category: "Liquor-Beer" },
        { id: 4059, top: "top-[55%]", left: "left-[0%]", width: "22%", height: "9.9%", category: "Liquor-Beer" },

    ];

    const [gridCells, setGridCells] = useState<cellTypes[]>(initialGridCells);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        gridId: number;
    } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, gridId: number) => {
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
            gridId: gridId
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
        if (productsData.length && gridCells.length && !hasFilledGrid && circulars?.length > 0) {
            // Convertir idCircular a número para asegurar una comparación correcta
            const numericIdCircular = idCircular;

            // Buscar el circular correcto usando el id_circular
            const currentCircular = circulars.find(circular =>
                circular.id_circular === numericIdCircular
            );

            if (currentCircular) {
                // Obtener los UPCs del circular actual
                const circularUPCs = currentCircular.circular_products_upc || [];

                let list:string[] = []

                Object.values(circularUPCs).map((item: { upc:string,id_grid:number })=>(
                    list.push(item.upc)
                ))
                const circularProducts = productsData.filter((product:ProductTypes) =>
                    list.includes(product.upc)
                );

                // Llenar la grilla con los productos filtrados
                const gridFilled = fillGridWithProducts(gridCells, circularProducts);
                setSelectedProducts(prev => [...prev, ...gridFilled]);

                if (gridCells.some((cell) => cell?.idCategory != undefined && cell?.idCategory != null)) {
                    setHasFilledGrid(true);
                }
            } else {
            }
        }
    }, [productsData, gridCells, circulars, idCircular]);

    const fillGridWithProducts = (gridCells: cellTypes[], products: ProductTypes[]) => {
        // 1. Crear un mapa para agrupar productos por categoría
        const productsByCategory = products.reduce((acc, product) => {
            if (!acc[product.id_category]) {
                acc[product.id_category] = [];
            }
            acc[product.id_category].push(product);
            return acc;
        }, {} as Record<number, ProductTypes[]>);

        // 2. Asignar productos a las celdas de la grilla
        const filledGrid = gridCells.reduce((acc: ProductTypes[], cell: cellTypes) => {
            const { idCategory } = cell;
            if (idCategory) {
                const productsForCategory = productsByCategory[idCategory] || [];
                if (productsForCategory.length > 0) {
                    const product = productsForCategory.shift()!;
                    acc.push({ ...product, id_grid: cell.id });
                }
            }
            return acc;
        }, []);

        return filledGrid;
    };

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    return (
        <div className={`relative no-scrollbar ${ productDragging ? 'overflow-visible' : 'overflow-auto' }`} >
            <Image src="/pages/page04.jpg" alt="PDF" width={470} height={460} priority sizes="(max-width: 768px) 100vw, 470px" />
            {gridCells.map((cell) => {

                const selectedProduct = selectedProducts?.find((p) => p.id_grid === cell.id);


                return (
                    <GridCardProduct
                    key={cell?.id}
                    product={selectedProduct!}
                    cell={cell}
                    onGridCellClick={onGridCellClick}
                    onContextMenu={handleContextMenu}
                    isLoading={isLoadingCategories}
                    onDragAndDropCell={onDragAndDropCell}
                    page={4}
                    />
                );
            })}

            {contextMenu?.visible && !isMoveModeActive && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 800
                    }}
                >
                    <RightClick
                        gridId={contextMenu.gridId}
                        handleRemoveProduct={onRemoveProduct}
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_grid === contextMenu.gridId) as ProductTypes}
                        copiedProduct={copiedProduct}
                    />
                </div>
            )}

        </div>
    );
};
