'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { gridLayoutTypes, layoutTypes } from '@/types/gridLayout';

interface LayoutGridType {
    gridLayoutData: gridLayoutTypes[];
    isLoadingLayouts: boolean;
    getPageById: (gridLayoutId: string) => gridLayoutTypes | undefined;
    parseLayoutData: (gridLayoutId: gridLayoutTypes, isStatic?:boolean) => layoutTypes[] | []
}

const layoutGridContext = createContext<LayoutGridType | undefined>(undefined);

export const LayoutGridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [gridLayoutData, setGridLayoutData] = useState<gridLayoutTypes[]>([]);
    const [isLoadingLayouts, setIsLoadingLayouts] = useState(true);

    useEffect(() => {
        const getLayoutGrids = async () => {
            try {
                const resp = await fetch('https://hiresprintcanvas.dreamhosters.com/getGridLayouts');
                const data = await resp.json();

                if (resp.status === 200) {                  
                    setGridLayoutData(data.result);
                    setIsLoadingLayouts(false);
                } else {
                    console.error('Error al obtener los layouts:', resp);
                    setIsLoadingLayouts(false);
                }
            } catch (error) {
                console.error('Error al obtener los layouts:', error);
                setIsLoadingLayouts(false);
            }
        };

        getLayoutGrids();
    }, []);

    const getPageById = (gridLayoutId: string): gridLayoutTypes | undefined => {
        if (gridLayoutData.length == 0) return;
        const layoutFounded = gridLayoutData.find((layout) => layout._id == gridLayoutId);

        if ( layoutFounded ) {
            layoutFounded.layout = parseLayoutData(layoutFounded)
        }

        return layoutFounded
    };

    const parseLayoutData = (gridData: gridLayoutTypes, isStatic?: boolean): layoutTypes[] | [] => {
            if (isStatic == undefined) isStatic = true
            if (!gridData?.layout) return [];
    
            const parseGridElement = (element: any, isCell: boolean = false, group?:layoutTypes) => {
                const baseElement = {
                    i: element.i,
                    h: element.h,
                    w: element.w,
                    x: element.x,
                    y: element.y,
                    moved: false,
                    static: isStatic,
                    id_category: element.id_category,
                    minW: 6,
                    minH: 6,
                };
    
                if (isCell) return { ...baseElement, id_grid: element.id_grid, groupI: group && group.i, cellx: element.cellx, celly: element.celly, id: element.id_grid, idCategory: group && group.id_category };
    
                return {
                    ...baseElement,
                    range_cell_id_start: element.range_cell_id_start,
                    range_cell_id_end: element.range_cell_id_end,
                    gridCells: element.gridCells?.map((cell: any) => parseGridElement(cell, true, element ) ),
                };
            };
    
            return gridData.layout.map((group: layoutTypes) => parseGridElement(group) as layoutTypes);
        };

    return (
        <layoutGridContext.Provider value={{ gridLayoutData, isLoadingLayouts, getPageById, parseLayoutData}} >
            {children}
        </layoutGridContext.Provider>
    );
};

export const useLayoutGridContext = () => {
    const context = useContext(layoutGridContext);

    if (!context) throw new Error('useLayoutGridContext debe ser usado dentro de un LayoutGridProvider');

    return context;
};
