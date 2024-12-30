import { useCategoryContext } from '@/app/context/categoryContext';
import { useLayoutGridContext } from '@/app/context/layoutGridContext';
import { useProductContext } from '@/app/context/productContext';
import { gridLayoutTypes, layoutTypes } from '@/types/gridLayout';
import { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import { GridCardProduct } from '../card';

interface LayoutGridProps {
    grid_layout_id: string;
    onGridCellClick?: (gridId: number, idCategory: number | undefined,  event: React.MouseEvent) => void;
    onDragAndDropCell?: (gridCellToMove: any, stopDragEvent: MouseEvent) => void;
    setShowProductCardBrand?: (arg:boolean) => void;
}

export const LayoutGrid = ({
    grid_layout_id,
    onGridCellClick,
    onDragAndDropCell,
    setShowProductCardBrand
}: LayoutGridProps) => {
    const { gridLayoutData, isLoadingLayouts, getPageById, parseLayoutData } = useLayoutGridContext()
    const [ isLayoutLoaded, setIsLayoutLoaded ] = useState(false);
    const [ layoutGrid, setLayoutGrid ] = useState< gridLayoutTypes | undefined >(undefined);
    const [elementDimensions, setElementDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});
    const { getCategoryByName, isLoadingCategories, categoriesData } = useCategoryContext()
    const { productsData, selectedProducts, updateGridProducts, productDragging, panningOnPage1, panningOnSubPage } = useProductContext();
    
    const cols = 100; // Número de columnas del grid
    const rowHeight = 1; // Altura de una fila

    useEffect(() => {
        if (!isLayoutLoaded) {
            const currentLayout = getPageById(grid_layout_id);
            
            if (currentLayout) {
                setIsLayoutLoaded(true)
                console.log("currentLayout ", currentLayout);
                setLayoutGrid(currentLayout)
            } 
        }
    }, [gridLayoutData])

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute('id');

                if (id) {
                    setElementDimensions((prev) => ({
                        ...prev,
                        [id]: {
                            width: entry.contentRect.width,
                            height: entry.contentRect.height,
                        },
                    }));
                }
            });
        });

        document.querySelectorAll('[id^="group-"]').forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [layoutGrid]);

    if (!layoutGrid) {
        return <div></div>
    }

    return (
            <div className="w-full h-full flex justify-center " >
                <div className="flex items-center justify-center relative" style={{ width: `${layoutGrid.canva_width}px`, height: `${layoutGrid.canva_height}px` }}>
                    
                    <img src={layoutGrid.url_image} alt="image grid" className="object-fill" draggable={false} style={{ width: `${layoutGrid.canva_width}px`, height: `${layoutGrid.canva_height}px` }} />
                    
                    <div className="w-full h-full absolute top-0 left-0 z-10 ">
                        <GridLayout
                            className="layout"
                            layout={layoutGrid.layout}
                            cols={cols}
                            rowHeight={rowHeight}
                            width={Number(layoutGrid.canva_width)}
                            preventCollision={true}
                            autoSize={true}
                            margin={[0, 0]}
                            containerPadding={[0, 0]}
                            maxRows={Number(layoutGrid.canva_height)}
                            compactType={null}
                        >
                            {layoutGrid.layout.map((group: layoutTypes) => (
                                <div key={group.i} onClick={(e) => { e.stopPropagation()}} >
                                    <div id={'group-' + group.i} className={`w-full h-full box-border`} >
                                        {elementDimensions && group.gridCells && (
                                            <GridLayout
                                                key={'layout-group-cells-' + group.i}
                                                layout={group.gridCells || []}
                                                cols={cols}
                                                rowHeight={rowHeight}
                                                width={elementDimensions[`group-${group.i}`]?.width}
                                                preventCollision={true}
                                                autoSize={true}
                                                margin={[0, 0]}
                                                containerPadding={[0, 0]}
                                                maxRows={elementDimensions[`group-${group.i}`]?.height}
                                                compactType={null}
                                            >
                                                {group.gridCells?.map((cell: layoutTypes) => {
                                                    const selectedProduct = selectedProducts?.find((p) => p.id_grid === cell.id_grid);

                                                    return (<div id={'cell-' + cell.i} key={cell.i} onClick={(e) => { e.stopPropagation()}} >
                                                        <div className={`w-full h-full`} >
                                                            {/* <span className="bg-yellow-300 px-0.5 rounded-sm text-blue-950 font-bold text-[9px] absolute top-0 right-0">{cell?.id_grid && cell.id_grid.toString()}</span> */}
                                                            <GridCardProduct
                                                                key={cell?.i}
                                                                product={selectedProduct!}
                                                                cell={cell as any}
                                                                onGridCellClick={((layoutGrid.page_number == 1 && panningOnPage1) || (layoutGrid.page_number != 1 && panningOnSubPage)) ? onGridCellClick : undefined}
                                                                isLoading={isLoadingCategories}
                                                                onDragAndDropCell={onDragAndDropCell}
                                                                setShowProductCardBrand={setShowProductCardBrand}
                                                                page={2}

                                                            />
                                                        </div>
                                                    </div>)
                                                })}
                                            </GridLayout>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </GridLayout>
                    </div>
                </div>
            </div>
    )
}