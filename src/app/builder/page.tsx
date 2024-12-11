'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MoveIcon, PlusIcon, TrashIcon } from '../components/icons';
import { Tooltip } from 'primereact/tooltip';
import { Message } from 'primereact/message';
import GridLayout from 'react-grid-layout';
import { useCategoryContext } from '../context/categoryContext';
import { gridLayoutTypes, groupGridCellsTypes, PartialGridLayoutTypes } from '@/types/gridLayout';
import { Skeleton } from 'primereact/skeleton';
import HoverGrid from '../components/hoverGrid';
import { AnimatePresence, motion } from 'framer-motion';
import { data1, data2, data3, data4 } from './data_layout';

const BuilderPage = () => {
    const { register, handleSubmit, formState: { errors }, watch, reset, trigger, } = useForm<any>({ defaultValues: { bg_width: '430', bg_height: '820', page_number: '1', image: {}, layout: [] } });

    const cols = 100; // Número de columnas del grid
    const rowHeight = 1; // Altura de una fila
    const elementWidth = 10; // Ancho del nuevo elemento
    const elementHeight = 40; // Altura del nuevo elemento

    const formRef = useRef<HTMLFormElement>(null);
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isProcessingLayout, setIsProcessingLayout] = useState<boolean>(false);
    const [isLayoutChanging, setIsLayoutChanging] = useState<boolean>(false);
    const [layout, setLayout] = useState<gridLayoutTypes[]>([]);
    const [customLayout, setCustomLayout] = useState<gridLayoutTypes[]>([]);
    const [newGroup, setNewGroup] = useState({ canAddAnother: true, x: 0, y: 0 });
    const [selectedGroup, setSelectedGroup] = useState<gridLayoutTypes | null>(null);
    const [selectedCell, setSelectedCell] = useState<gridLayoutTypes | null>(null);
    const [groupGridCells, setGroupGridCells] = useState<groupGridCellsTypes | null>(null);
    const { categoriesData, getCategoryById, isLoadingCategories } = useCategoryContext();
    const [elementDimensions, setElementDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});
    const [minGroupHeight, setMinGroupHeight] = useState<number>(24);
    const [minGroupWidth, setMinGroupWidth] = useState<number>(6);
    const [isRangeModalOpen, setIsRangeModalOpen] = useState<boolean>(false);
    const [rangeCells, setRengeCells] = useState<{ start: number; end: number } | null>(null);
    const [isClearAllPopupOpen, setIsClearAllPopupOpen] = useState(false);

    const imageFile = watch('image');
    const bg_width = watch('bg_width');
    const bg_height = watch('bg_height');
    const page_number = watch('page_number');

    useEffect(() => {
        // const layoutStructure: gridLayoutTypes[] = [ ]
        // const layoutStructure = parseLayoutData(data1);
        // const layoutStructure = parseLayoutData(data2);
        // const layoutStructure = parseLayoutData(data3);
        const layoutStructure = parseLayoutData(data4);

        layoutProcessing(layoutStructure);
        calculateNextPosition();
    }, []);

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
    }, [layout]);

    useEffect(() => {
        if (customLayout.length === 0) {
            setCustomLayout(layout);
            return;
        }

        const updatedLayout = [...layout].map((item: any) => {
            const existingItemIndex = customLayout.findIndex((group: any) => group.i === item.i);

            if (existingItemIndex !== -1) {
                customLayout[existingItemIndex] = { ...customLayout[existingItemIndex], ...item, };
                return customLayout[existingItemIndex];
            } else {
                return item;
            }
        });

        setCustomLayout(updatedLayout);
    }, [layout]);

    useEffect(() => {
        if (imageFile && imageFile[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setBackgroundUrl(e.target?.result as string);
            };
            reader.readAsDataURL(imageFile[0] as Blob);
        }
    }, [imageFile]);

    useEffect(() => {
        if (bg_width) setMinGroupWidth(Math.floor(bg_width * 0.015));
        if (bg_height) setMinGroupHeight(Math.floor(bg_height * 0.03));
    }, [bg_width, bg_height]);


    useEffect(() => {
        if (rangeCells) {
            applyGroupGridCells();
        }
    }, [rangeCells]);


    const parseLayoutData = (backendData: any) => {
        if (!backendData?.layout) return [];

        const parseGridElement = (element: any, isCell: boolean = false, groupId?: string) => {
            const baseElement = {
                i: element.i,
                h: element.h,
                w: element.w,
                x: element.x,
                y: element.y,
                moved: false,
                static: true,
                id_category: element.id_category,
                minW: 6,
                minH: 6,
            };

            if (isCell) return { ...baseElement, id_grid: element.id_grid, groupI: groupId, cellx: element.cellx, celly: element.celly };

            return {
                ...baseElement,
                range_cell_id_start: element.range_cell_id_start,
                range_cell_id_end: element.range_cell_id_end,
                gridCells: element.gridCells?.map((cell: any) => parseGridElement(cell, true, element.i ) ),
            };
        };

        return backendData.layout.map((group: any) => parseGridElement(group));
    };

    const layoutProcessing = (newLayout: gridLayoutTypes[]) => {
        if (isProcessingLayout) return;
        setIsProcessingLayout(true);

        setLayout(newLayout);
        
        setTimeout(() => {
            setIsProcessingLayout(false);
        }, 250);
    };

    const makeAllGroupAndCellsStatic = (groups: gridLayoutTypes[]) => {
        const allStatic = groups.map((group: gridLayoutTypes) => {
            const newGroup = { ...group, static: true };

            if (Array.isArray(group.gridCells) && group.gridCells.length > 0) {
                newGroup.gridCells = group.gridCells.map((cell: gridLayoutTypes) => ({ ...cell, static: true }));
            }

            return newGroup;
        });

        return [...allStatic];
    };

    const toggleStatic = (type: 'group') => {
        if (!selectedGroup) return;

        const newLayout = makeAllGroupAndCellsStatic(customLayout);
        const selectedGroupIndex = newLayout.findIndex((item: any) => item.i === selectedGroup?.i);

        if (selectedGroupIndex === -1) return;
        const newGroupSelected = { ...newLayout[selectedGroupIndex] };

        if (type === 'group') {
            // Toggle grupo
            newGroupSelected.static = !selectedGroup?.static;
            setSelectedGroup(newGroupSelected);
            newLayout[selectedGroupIndex] = newGroupSelected;
            setSelectedCell(null);
        }

        layoutProcessing(newLayout);
    };

    const handleSelection = (element: any) => {
        if (isLayoutChanging) return;

        const newLayout = makeAllGroupAndCellsStatic(customLayout);
        let newSelectedGroup = null;
        let newSelectedCell = null;

        // Si no hay elemento, limpiar selecciones
        if (!element) {
            layoutProcessing(newLayout);
            setSelectedGroup(null);
            setSelectedCell(null);
            return;
        }

        // Determinar si es una celda o un grupo
        const isCell = 'groupI' in element;

        if (isCell) {
            // Si hay un grupo seleccionado y no es estático, no hacer nada
            if (selectedGroup && !selectedGroup.static && element.groupI === selectedGroup.i) return;

            const groupIndex = newLayout.findIndex((item) => item.i === element.groupI);

            if (groupIndex !== -1) {
                newSelectedGroup = newLayout[groupIndex];

                if (newLayout[groupIndex].gridCells && newLayout[groupIndex].gridCells.length > 0) {
                    const cellIndex = newLayout[groupIndex].gridCells.findIndex((cell) => cell.i === element.i);
                    if (cellIndex !== -1) {
                        newLayout[groupIndex].gridCells[cellIndex].static = false;
                        newSelectedCell = newLayout[groupIndex].gridCells[cellIndex];
                    }
                }
            }
        } else {
            // Si el un grupo seleccinado es el mismo grupo que se clickeo y si hay una celda seleccionada y no es estática, no hacer nada
            if (selectedGroup?.gridCells && selectedGroup.i === element.i && selectedGroup?.gridCells.length > 0 && selectedCell && !selectedCell.static) {
                return;
            }

            const groupIndex = newLayout.findIndex((item) => item.i === element.i);

            if (groupIndex !== -1) {
                newLayout[groupIndex].static = false;
                newSelectedGroup = newLayout[groupIndex];
            }
        }

        layoutProcessing(newLayout);
        setSelectedGroup(newSelectedGroup);
        setSelectedCell(newSelectedCell);
    };

    const onSubmit: SubmitHandler<any> = async (data: any) => {
        setIsSubmitting(true);

        const pick_props = (element: gridLayoutTypes, type: 'group' | 'cell') => {
            let props: PartialGridLayoutTypes = { i: element.i };
            props.h = element.h;
            props.w = element.w;
            props.x = element.x;
            props.y = element.y;
            props.id_category = element.id_category;

            if (type == 'group') {
                props.range_cell_id_end = element.range_cell_id_end;
                props.range_cell_id_start = element.range_cell_id_start;
            } 
            
            if (type == 'cell') {
                props.id_grid = element.id_grid;
                props.cellx = element.cellx;
                props.celly = element.celly;
            }

            return props;
        };

        const layout_to_send = customLayout.map((group: gridLayoutTypes) => {
            return {
                ...pick_props(group, 'group'),
                gridCells: group.gridCells?.map((cell: gridLayoutTypes) => ({
                    ...pick_props(cell, 'cell'),
                })),
            };
        });
        const data_to_send = { ...data, layout: layout_to_send };

        console.log('data_to_send ', JSON.stringify(data_to_send));

        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);
    };

    const layoutGroupChangeHandler = (newLayout: any) => {
        layoutProcessing(newLayout);
        calculateNextPosition();
    };

    const layoutCellChangeHandler = (newLayout: any) => {
        if (!selectedGroup) return;

        const updatedLayout = layout.map((group) => {
            if (group.i === selectedGroup.i) {
                const updatedCells = newLayout.map((newCell: any) => {
                    const existingCell = group.gridCells?.find((cell: any) => cell.i === newCell.i);

                    const minW = elementDimensions[`group-${selectedGroup.i}`]?.width * 0.03;
                    const minH = elementDimensions[`group-${selectedGroup.i}`]?.height * 0.09;
                    return {
                        ...existingCell,
                        ...newCell,
                        groupI: selectedGroup.i,
                        static: existingCell?.static ?? true,
                        id_category: selectedGroup.id_category,
                        minW,
                        minH,
                    };
                });

                return { ...group, gridCells: updatedCells };
            }
            return group;
        });

        layoutProcessing(updatedLayout);

        const newSelectedGroup = updatedLayout.find((group) => group.i === selectedGroup.i);
        if (newSelectedGroup) setSelectedGroup(newSelectedGroup);
    };

    const calculateNextPosition = () => {
        const totalRows = Math.floor(bg_height / rowHeight);
        const grid = Array.from({ length: totalRows }, () => Array(cols).fill(false));

        for (const item of layout) {
            const maxY = Math.min(item.y + item.h, totalRows);
            const maxX = Math.min(item.x + item.w, cols);

            for (let y = item.y; y < maxY; y++) {
                for (let x = item.x; x < maxX; x++) {
                    grid[y][x] = 1;
                }
            }
        }

        for (let y = 0; y < totalRows - elementHeight + 1; y++) {
            for (let x = 0; x <= cols - elementWidth; x++) {
                let spaceAvailable = true;

                outer: for (let dy = 0; dy < elementHeight; dy++) {
                    for (let dx = 0; dx < elementWidth; dx++) {
                        if (grid[y + dy][x + dx]) {
                            spaceAvailable = false;
                            break outer;
                        }
                    }
                }

                if (spaceAvailable) {
                    setNewGroup({ canAddAnother: true, x, y });
                    return;
                }
            }
        }

        setNewGroup({ canAddAnother: false, x: 0, y: 0 });
    };

    const findNextAvailableNumber = (layout: gridLayoutTypes[]): number => {
        const numbers = layout.map((item) => parseInt(item.i)).sort((a, b) => a - b);

        if (numbers.length === 0) return 1;

        for (let i = 1; i <= numbers.length; i++) {
            if (numbers[i - 1] !== i) return i;
        }

        return numbers[numbers.length - 1] + 1;
    };

    const addGroup = () => {
        if (!newGroup.canAddAnother) return;

        const newItem = {
            i: `${findNextAvailableNumber(layout)}`,
            x: newGroup.x,
            y: newGroup.y,
            w: elementWidth,
            h: elementHeight,
            moved: false,
            static: true,
            id_category: null,
            minW: minGroupWidth,
            minH: minGroupHeight,
        };

        setLayout((prevLayout: any) => {
            return [...prevLayout, { ...newItem }];
        });

        calculateNextPosition();
    };

    const removeElement = (type: 'group' | 'cell') => {
        if (type === 'group' && !selectedGroup) return;
        if (type === 'cell' && (!selectedCell || !selectedGroup)) return;

        if (type === 'group') {
            // Eliminar grupo
            setLayout((prevLayout: any) => {
                const newLayout = prevLayout.filter((item: any) => item.i !== selectedGroup?.i);
                return newLayout;
            });
            setSelectedGroup(null);
        } else {
            // Eliminar celda

            let newLayout = layout.map((group: any) => {
                if (group.i === selectedGroup?.i) {
                    return { ...group, gridCells: group.gridCells?.filter((cell: any) => cell.i !== selectedCell?.i) };
                }
                return {...group};
            });

            newLayout = reorderGridRangesAfterDelete(newLayout, selectedGroup?.i!);

            layoutProcessing(newLayout);
            setSelectedCell(null);
        }

        calculateNextPosition();
    };

    const reorderGridRangesAfterDelete = (currentLayout: gridLayoutTypes[], deletedFromGroupId: string) => {
        const groupsWithCells = currentLayout
            .filter((group) => group.gridCells && group.gridCells.length > 0)
            .sort((a, b) => (a.range_cell_id_start || 0) - (b.range_cell_id_start || 0));
    
        let updatedLayout = [...currentLayout];
        let currentStartId = 0;
    
        const deletedGroupIndex = groupsWithCells.findIndex((group) => group.i === deletedFromGroupId);
        if (deletedGroupIndex === -1) return currentLayout;
    
        for (let i = deletedGroupIndex; i < groupsWithCells.length; i++) {
            const currentGroup = groupsWithCells[i];
            
            if (i === deletedGroupIndex) {
                currentStartId = currentGroup.range_cell_id_start || 1;
            }
    
            const cellCount = currentGroup.gridCells?.length || 0;
            const newEndId = currentStartId + cellCount - 1;
    
            const updatedCells = currentGroup.gridCells?.map((cell, index) => ({
                ...cell,
                id_grid: page_number * 1000 + currentStartId + index,
            }));
    
            updatedLayout = updatedLayout.map((group) => {
                if (group.i === currentGroup.i) {
                    return {
                        ...group,
                        gridCells: updatedCells,
                        range_cell_id_start: currentStartId,
                        range_cell_id_end: newEndId,
                    };
                }
                return group;
            });
    
            currentStartId = newEndId + 1;
        }
    
        return updatedLayout;
    };

    const updateSelectedGroup = (group: PartialGridLayoutTypes) => {
        const newLayout = [...layout];
        const selectedIndex = newLayout.findIndex((item: any) => item.i === group.i);

        if (selectedIndex !== -1) {
            const newGroup: gridLayoutTypes = { ...newLayout[selectedIndex], ...group };

            if (newGroup.gridCells && newGroup.gridCells.length > 0) newGroup.gridCells = newGroup.gridCells?.map((cell: gridLayoutTypes) => ({ ...cell, id_category: group.id_category ?? null }));

            setSelectedGroup(newGroup);
            newLayout[selectedIndex] = newGroup;

            if (selectedCell && selectedCell.groupI === group.i && group.id_category) {
                const newCell: gridLayoutTypes = { ...selectedCell, id_category: newGroup.id_category };
                setSelectedCell(newCell);
            }
        }

        layoutProcessing(newLayout);
    };

    const handleCategoryChange = (e: any) => {
        if (!selectedGroup) return;

        const idCategory = e.target.value;
        if (idCategory) updateSelectedGroup({ i: selectedGroup.i, id_category: idCategory });
    };

    const getCustomReference = (group: gridLayoutTypes): gridLayoutTypes | null => {
        const existingItemIndex = customLayout.findIndex((item: gridLayoutTypes) => item.i === group.i);
        return customLayout[existingItemIndex] || null;
    };

    const handleGroupGridSelection = (data: any) => {
        setGroupGridCells(data);
    };

    const generateGridCells = (num_rows: number, num_cols: number, rangeCells: any) => {
        if (!selectedGroup) return;

        const cells: gridLayoutTypes[] = [];
        let cellCounter = 1;

        // Espaciado entre las celdas
        const spacing = 0.4;
        const totalXSpacing = (num_cols - 1) * spacing; 
        const totalYSpacing = (num_rows - 1) * spacing; 

        const effectiveWidth = (100 - totalXSpacing) / num_cols;
        const totalHeight = elementDimensions[`group-${selectedGroup?.i}`]?.height || 0;
        const effectiveHeight = (totalHeight - totalYSpacing) / num_rows;

        for (let row = 0; row < num_rows; row++) {
            let currentX = 0;
            let currentY = row * (effectiveHeight + spacing);

            for (let col = 0; col < num_cols; col++) {
                cells.push({
                    i: `cell-${selectedGroup?.i}-${cellCounter}`,
                    x: Math.round(currentX * 1000) / 1000,
                    y: Math.round(currentY * 1000) / 1000,
                    w: Math.round(effectiveWidth * 1000) / 1000,
                    h: Math.round(effectiveHeight * 1000) / 1000,
                    moved: false,
                    static: true,
                    minW: elementDimensions[`group-${selectedGroup.i}`]?.width * 0.03,
                    minH: elementDimensions[`group-${selectedGroup.i}`]?.height * 0.09,
                    cellx: col + 1,
                    celly: row + 1,
                    id_category: selectedGroup.id_category,
                    id_grid: page_number * 1000 + (rangeCells.start - 1) + cellCounter,
                    groupI: selectedGroup.i,
                });

                currentX += effectiveWidth + spacing;
                cellCounter++;
            }
        }

        return cells;
    };

    const validateAndUpdateGridRanges = (currentLayout: gridLayoutTypes[], selectedGroupId: string) => {
        const groupsWithCells = currentLayout.filter((group) => group.gridCells && group.gridCells.length > 0).sort((a, b) => (a.range_cell_id_start || 0) - (b.range_cell_id_start || 0));

        let updatedLayout = [...currentLayout];
        let lastEndId = 0;

        const selectedGroupIndex = groupsWithCells.findIndex((group) => group.i === selectedGroupId);
        if (selectedGroupIndex === -1) return currentLayout;

        lastEndId = groupsWithCells[selectedGroupIndex].range_cell_id_end || 0;


        for (let i = selectedGroupIndex + 1; i < groupsWithCells.length; i++) {
            const currentGroup = groupsWithCells[i];
            const currentStart = currentGroup.range_cell_id_start || 0;


            if (currentStart <= lastEndId) {

                const cellCount = currentGroup.gridCells?.length || 0;
                const newStartId = lastEndId + 1;
                const newEndId = newStartId + cellCount - 1;

                const updatedCells = currentGroup.gridCells?.map((cell, index) => ({ ...cell, id_grid: page_number * 1000 + newStartId + index, }));

                updatedLayout = updatedLayout.map((group) => {
                    if (group.i === currentGroup.i) {
                        return { ...group, gridCells: updatedCells, range_cell_id_start: newStartId, range_cell_id_end: newEndId, };
                    }
                    return group;
                });

                lastEndId = newEndId;
            } else {
                break;
            }
        }

        return updatedLayout;
    };

    const applyGroupGridCells = () => {
        if (!rangeCells || !selectedGroup || !groupGridCells) return;

        const { rows, cols } = groupGridCells;
        const generatedCells = generateGridCells(rows, cols, rangeCells);
        const newLayout = makeAllGroupAndCellsStatic(customLayout);

        let updatedLayout = newLayout.map((group) => {
            if (group.i === selectedGroup.i) {
                return { ...group, gridCells: generatedCells, range_cell_id_start: rangeCells.start, range_cell_id_end: rangeCells.end, };
            } else {
                return group;
            }
        });

        updatedLayout = validateAndUpdateGridRanges(updatedLayout, selectedGroup.i);

        const newGroupIndex = updatedLayout.findIndex((group: any) => group.i === selectedGroup.i);
        if (newGroupIndex !== -1) updateSelectedGroup(updatedLayout[newGroupIndex]);

        layoutProcessing(updatedLayout);
        
        setTimeout(() => {
            setGroupGridCells(null);
            setRengeCells(null);
        }, 200);
    };
    
    const transformGridCellsToFormat = (gridCells: any[]) => {
        return ( gridCells?.map((cell) => ({ row: cell.celly, col: cell.cellx, })) || [] );
    };
    
    const confirmClear = () => {
        reset();
        setBackgroundUrl(null);
        layoutProcessing([]);
        setIsClearAllPopupOpen(false);
    }

    if (isLoadingCategories) {
        return <Skeleton width="100%" height="100%" borderRadius="0"></Skeleton>;
    }

    return (
        <div className="w-full h-full grid grid-cols-[min-content_1fr] overflow-hidden">
            <div className="bg-gray-300 w-[300px] h-full p-2 pt-4 overflow-y-auto no-scrollbar">
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                    {/* ----- PAGE NUMBER ----- */}
                    <h2 className="text-green-800 font-bold text-xl mb-1">Page number</h2>
                    <div className="bg-gray-400 bg-opacity-[0.4] p-2 rounded-md">
                        <div className="flex flex-col w-full">
                            <div className="relative">
                                <Tooltip target="#page-number-input" disabled={layout.length === 0} content="You can only set the page number before adding a group" position="right" autoHide={true} showOnDisabled={true} />
                                <input
                                    id="page-number-input"
                                    disabled={layout.length > 0}
                                    type="number"
                                    {...register('page_number', {
                                        required: true,
                                        min: {
                                            value: 1,
                                            message: 'Page number must be at least 1',
                                        },
                                        onBlur: (e) => {
                                            trigger('page_number');
                                        },
                                    })}
                                    className="bg-white text-gray-700 p-1 rounded w-full disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    placeholder="Page number"
                                    min="1"
                                />
                            </div>

                            {errors.page_number && (
                                <span className="text-red-500 text-sm">
                                    {errors.page_number?.type === 'required' && 'Page number is required'}
                                    {errors.page_number?.type === 'min' && errors.page_number?.message?.toString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ----- BACKGROUND ----- */}
                    <h2 className="text-green-800 font-bold text-xl mb-1 mt-3">Background</h2>
                    <div className="bg-gray-400 bg-opacity-[0.4] p-2 rounded-md">
                        <input {...register('image')} className="hidden" type="file" accept="image/*" id="backgroundInput" />
                        <h2 className="text-black text-lg mb-0">Image </h2>
                        <div className="flex items-center justify-center gap-3">
                            <button type="button" className="w-[120px] bg-[#7cc304] text-white p-1 rounded-md hover:bg-green-600 transition-colors flex-1" onClick={() => document.getElementById('backgroundInput')?.click()}>
                                <span className="text-sm">{'Browse files'}</span>
                            </button>

                            {backgroundUrl && (
                                <div className="flex items-center justify-center">
                                    <Tooltip target="#remove-background-btn" content="Remove background image" position="right" autoHide={true} />
                                    <button id="remove-background-btn" type="button" className="w-[30px] bg-red-500 text-white p-1 rounded-md hover:bg-red-700 transition-colors" onClick={() => setBackgroundUrl(null)}>
                                        <div className="flex items-center justify-center">
                                            <TrashIcon color="#fff" />
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                        <h2 className="text-black text-lg mb-0 mt-3">Size </h2>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-gray-500 text-lg">Height</span>
                                <input type="number" {...register('bg_height', { required: true })} className="bg-white text-gray-700 p-1 rounded w-full" placeholder="Height" />
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <span className="text-gray-500 text-lg">Width</span>
                                <input type="number" {...register('bg_width', { required: true })} className="bg-white text-gray-700 p-1 rounded w-full" placeholder="Width" />
                            </div>
                        </div>
                    </div>

                    {/* ----- GROUP ----- */}
                    <h2 className="text-green-800 font-bold text-xl mb-1 mt-3">Group </h2>
                    <div className="bg-gray-400 bg-opacity-[0.4] p-2 rounded-md">
                        <div className="flex items-center justify-end gap-2">
                            <span className="text-gray-500 text-lg flex-1">Add Group</span>
                            <Tooltip disabled={page_number && !Boolean(errors.page_number)} target="#add-group-btn" content={Boolean(errors.page_number) ? errors.page_number?.message?.toString() : 'You must set the page number before adding a group'} position="right" autoHide={true} showOnDisabled={true} />
                            <button id="add-group-btn" disabled={!newGroup.canAddAnother || !page_number || Boolean(errors.page_number)} type="button" className="p-2 rounded-md bg-[#7cc304] hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { addGroup(); }} >
                                <PlusIcon color="#fff" />
                            </button>
                        </div>

                        {selectedGroup && (
                            <div className="flex flex-col gap-2 bg-gray-200 p-2 rounded-md mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-black text-md font-bold text-green-700 mb-0"> Selected Group </h2>
                                        <span className="text-black text-md font-bold text-green-700 mb-0">{selectedGroup.i}</span>
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <div className="flex items-center justify-end gap-2">
                                            <Tooltip target="#move-group-btn" content={`${selectedGroup.static ? 'Move group' : 'Make group static'}`} position="top" autoHide={true} />
                                            <button id="move-group-btn" type="button" className={`w-[30px] text-white p-1 rounded-md ${selectedGroup.static ? 'bg-gray-300 hover:bg-gray-400' : 'bg-[#7cc304] hover:bg-green-600'} transition-colors`} onClick={() => toggleStatic('group')} >
                                                <div className="flex items-center justify-center">
                                                    <MoveIcon color={`${selectedGroup.static ? '#9e9c9c' : '#fff'}`} />
                                                </div>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-end gap-2">
                                            <Tooltip target="#remove-group-btn" content="Remove group" position="top" autoHide={true} />
                                            <button id="remove-group-btn" type="button" className="w-[30px] text-white p-1 rounded-md bg-red-500 hover:bg-red-700 transition-colors" onClick={() => removeElement('group')}>
                                                <div className="flex items-center justify-center">
                                                    <TrashIcon color="#fff" />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h2 className="text-black text-lg mb-0">Category </h2>

                                    <select className="text-black w-36 font-bold px-1 py-2 rounded-md" value={selectedGroup?.id_category || ''} onChange={handleCategoryChange}>
                                        <option value="" disabled> Select category </option>

                                        {categoriesData.map((cat) => (
                                            <option key={cat.id_category} value={cat.id_category}>
                                                {cat.name_category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h2 className="text-black text-lg mb-0">Select the cells of the group.</h2>

                                    <HoverGrid key={selectedGroup?.i} rows={11} cols={8} onSelection={handleGroupGridSelection} existingCells={selectedGroup?.gridCells ? transformGridCellsToFormat(selectedGroup.gridCells) : undefined} />

                                    <div className="flex items-center justify-end">
                                        <button disabled={!groupGridCells} type="button" className="w-[120px] bg-[#7cc304] text-white p-1 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { setIsRangeModalOpen(true); }} >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-5">
                        <button type="button" className="h-10 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 " onClick={() => { setIsClearAllPopupOpen(true) }} >
                            Clear
                        </button>

                        <button type="submit" disabled={isSubmitting} className="h-10 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center">
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* GRID LAYOUT */}
            <div className="relative h-full overflow-y-auto" onClick={() => { handleSelection(null); }} >
                <div className="p-4">
                    <div className="w-full flex justify-center">
                        {!bg_width || !bg_height ? (
                            <div className="flex items-center justify-center">
                                <Message style={{ borderLeft: '6px solid #b91c1c', color: '#b91c1c' }} severity="error" text="You must specify the width and height of the background" className="mb-4" />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center relative">
                                {backgroundUrl ? (
                                    <img src={backgroundUrl} alt="Vista previa" className="object-fill" draggable={false} style={{ width: `${bg_width}px`, height: `${bg_height}px` }} />
                                ) : (
                                    <div className={`bg-white rounded-md flex items-center justify-center`} style={{ width: `${bg_width}px`, height: `${bg_height}px` }}>
                                        {/* <span className="text-gray-500 text-lg">No image selected</span> */}
                                    </div>
                                )}
                                <div className="w-full h-full absolute top-0 left-0 z-10 overflow-hidden">
                                    <GridLayout
                                        onDragStart={() => { setIsLayoutChanging(true); }}
                                        onDragStop={() => { setTimeout(() => { setIsLayoutChanging(false); }, 250); }}
                                        onResizeStart={() => { setIsLayoutChanging(true); }}
                                        onResizeStop={() => { setTimeout(() => { setIsLayoutChanging(false); }, 250); }}
                                        key={'layout-group'}
                                        onLayoutChange={layoutGroupChangeHandler}
                                        className="layout"
                                        layout={layout}
                                        cols={cols}
                                        rowHeight={rowHeight}
                                        width={bg_width}
                                        preventCollision={true}
                                        autoSize={true}
                                        margin={[0, 0]}
                                        containerPadding={[0, 0]}
                                        maxRows={bg_height}
                                        resizeHandles={['se']}
                                        compactType={null}
                                    >
                                        {layout.map((group: gridLayoutTypes) => (
                                            <div key={group.i} onClick={(e) => { e.stopPropagation(); handleSelection(group); }} >
                                                <Tooltip target={'#group-' + group.i} position="top" disabled={(getCustomReference(group)?.gridCells || [])?.length > 0 ?? false} autoHide={true} mouseTrack mouseTrackTop={25}>
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-white text-md font-bold">Grupo</span>
                                                            <span className="text-white text-sm">{group.i}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-white text-md font-bold">Category:</span>
                                                            {getCustomReference(group)?.id_category ? (
                                                                <span className="text-white text-sm">{getCategoryById(getCustomReference(group)?.id_category || 0)?.name_category}</span>
                                                            ) : (
                                                                <span className="text-white text-sm mb-0 italic"> No category Selected </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Tooltip>

                                                <div id={'group-' + group.i} className={`w-full h-full border-[1px] border-[#7cc304] box-border cursor-pointer ${ selectedGroup && selectedGroup?.i === group.i ? 'border-2 border-green-600 hover:bg-green-600 hover:bg-opacity-[0.3] bg-green-600 bg-opacity-[0.2]' : 'hover:bg-black hover:bg-opacity-[0.2]' }`} >
                                                    {elementDimensions && getCustomReference(group)?.gridCells && (
                                                        <GridLayout
                                                            key={'layout-group-cells-' + group.i}
                                                            onLayoutChange={layoutCellChangeHandler}
                                                            layout={getCustomReference(group)?.gridCells || []}
                                                            cols={cols}
                                                            rowHeight={rowHeight}
                                                            width={elementDimensions[`group-${group.i}`]?.width}
                                                            preventCollision={true}
                                                            autoSize={true}
                                                            margin={[0, 0]}
                                                            containerPadding={[0, 0]}
                                                            maxRows={elementDimensions[`group-${group.i}`]?.height}
                                                            resizeHandles={['se']}
                                                            compactType={null}
                                                        >
                                                            {getCustomReference(group)?.gridCells?.map((cell: gridLayoutTypes) => (
                                                                <div id={'cell-' + cell.i} key={cell.i} onClick={(e) => { e.stopPropagation(); handleSelection(cell); }} >
                                                                    <Tooltip target={'#cell-' + cell.i} position="top" autoHide={true} mouseTrack mouseTrackTop={25}>
                                                                        <div className="flex flex-col gap-3">
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-white text-md font-bold">Grupo:</span>
                                                                                <span className="text-white text-sm">{group.i}</span>
                                                                            </div>

                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-white text-md font-bold">Cell ID:</span>
                                                                                <span className="text-white text-sm">{cell.id_grid}</span>
                                                                            </div>

                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-white text-md font-bold">Category:</span>
                                                                                {getCustomReference(group)?.id_category ? (
                                                                                    <span className="text-white text-sm">{getCategoryById(cell?.id_category || 0)?.name_category}</span>
                                                                                ) : (
                                                                                    <span className="text-white text-sm mb-0 italic">No category Selected</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Tooltip>
                                                                    <div className={`w-full h-full border-[1px] relative border-gray-500 rounded text-black ${ selectedCell && selectedCell?.i === cell.i ? 'border-2 border-green-600 hover:bg-green-600 hover:bg-opacity-[0.3] bg-green-600 bg-opacity-[0.2]' : 'hover:bg-black hover:bg-opacity-[0.2]' }`} >
                                                                        <span className="bg-yellow-300 px-0.5 rounded-sm text-blue-950 font-bold text-[9px] absolute top-0 right-0">{cell?.id_grid && cell.id_grid.toString()}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </GridLayout>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </GridLayout>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {selectedCell && (
                        <motion.div initial={{ opacity: 0, y: 20 }} exit={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fixed top-[calc(100vh-50%)] right-3">
                            <CellToolBox selectedCell={selectedCell} remove={removeElement} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    <RangeModal
                        isRangeModalOpen={isRangeModalOpen}
                        setIsRangeModalOpen={setIsRangeModalOpen}
                        setRengeCells={setRengeCells}
                        groupGridCells={groupGridCells}
                        selectedGroup={selectedGroup}
                        getCustomReference={getCustomReference}
                        customLayout={customLayout}
                    />
                </AnimatePresence>

                {/* Pop-up de confirmación */}
                {isClearAllPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg text-center space-y-2">
                            <h2 className="text-lg font-bold text-black">Confirm Clear All</h2>
                            <p className="text-black">¿Are you sure you want to clear the layout?</p>
                            <div className="flex justify-end mt-4">
                                <button onClick={(e) => { e.stopPropagation(); setIsClearAllPopupOpen(false) }} className="bg-gray-400 p-2 rounded-md mr-2 text-white hover:bg-gray-600">Cancel</button>
                                <button onClick={(e) => { e.stopPropagation(); confirmClear() }} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuilderPage;

interface cellToolBoxProps {
    selectedCell: gridLayoutTypes;
    remove: (type: 'group' | 'cell') => void;
}

const CellToolBox: React.FC<cellToolBoxProps> = ({ selectedCell, remove }) => {
    const { getCategoryById } = useCategoryContext();
    return (
        <div className="flex flex-col gap-2 bg-gray-200 p-2 rounded-md mt-3 shadow-md min-w-[215px] max-w-[250px]">
            <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-black text-md font-bold text-green-700 mb-0">Selected Cell</h2>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <Tooltip target="#remove-cell-btn" content="Remove cell" position="top" autoHide={true} />
                    <button
                        id="remove-cell-btn"
                        type="button"
                        className="w-[30px] text-white p-1 rounded-md bg-red-500 hover:bg-red-700 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            remove('cell');
                        }}
                    >
                        <div className="flex items-center justify-center">
                            <TrashIcon color="#fff" />
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <h2 className="text-black text-md font-bold mb-0">Cell ID: </h2>
                <span className="text-black text-sm mb-0">{selectedCell?.id_grid}</span>
            </div>

            <div className="flex items-center gap-1">
                <h2 className="text-black text-md font-bold mb-0">Category: </h2>
                {selectedCell?.id_category ? <span className="text-black text-sm mb-0">{getCategoryById(selectedCell?.id_category || 0)?.name_category}</span> : <span className="text-black text-sm mb-0 italic">No category Selected</span>}
            </div>
        </div>
    );
};

interface RangeModalProps {
    selectedGroup: gridLayoutTypes | null;
    isRangeModalOpen: boolean;
    setIsRangeModalOpen: (value: boolean) => void;
    setRengeCells: (value: { start: number; end: number }) => void;
    groupGridCells: groupGridCellsTypes | null;
    getCustomReference: (group: gridLayoutTypes) => gridLayoutTypes | null;
    customLayout: gridLayoutTypes[];
}

const RangeModal: React.FC<RangeModalProps> = ({ selectedGroup, isRangeModalOpen, setIsRangeModalOpen, setRengeCells, groupGridCells, getCustomReference, customLayout }) => {
    const [start, setStart] = useState<number>(selectedGroup ? getCustomReference(selectedGroup)?.range_cell_id_start ?? 0 : 0);
    const [end, setEnd] = useState<number>(selectedGroup ? getCustomReference(selectedGroup)?.range_cell_id_end ?? 0 : 0);
    const [errors, setErrors] = useState<{ start?: string; end?: string; range?: string; overlap?: string }>({});

    useEffect(() => {
        if (!isRangeModalOpen) return;
        const customSelectedGroup = selectedGroup ? getCustomReference(selectedGroup) : null;

        const startVal = customSelectedGroup?.range_cell_id_start ?? 0;
        const endVal = customSelectedGroup?.range_cell_id_end ?? 0;
        setStart(startVal);
        setEnd(endVal);

        if (startVal && endVal) validateRange(startVal, endVal);
    }, [isRangeModalOpen]);

    const validateRange = (startVal: number, endVal: number) => {
        if (!groupGridCells) return;

        const rangeSize = endVal - startVal + 1;

        const anotherGroups = customLayout.filter((group) => group.i !== selectedGroup?.i);

        const overlaps = anotherGroups.some((group) => {
            if (!group.range_cell_id_start || !group.range_cell_id_end) return false;

            return startVal >= group.range_cell_id_start && startVal <= group.range_cell_id_end;
        });

        if (overlaps) {
            setErrors((prev) => ({
                ...prev,
                overlap: `Range start overlaps with another group`,
            }));
            return false;
        }

        if (rangeSize < groupGridCells.totalItems) {
            setErrors((prev) => ({
                ...prev,
                range: `Range is incomplete. Need ${groupGridCells.totalItems} cells but range only covers ${rangeSize} cells`,
            }));
            return false;
        }

        if (rangeSize > groupGridCells.totalItems) {
            setErrors((prev) => ({
                ...prev,
                range: `Range is too large. Need ${groupGridCells.totalItems} cells but range covers ${rangeSize} cells`,
            }));
            return false;
        }

        setErrors((prev) => ({ ...prev, range: undefined, overlap: undefined }));
        return true;
    };

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!groupGridCells) return;

        if (!e.target.value) {
            setStart(0);
            setEnd(0);
            return;
        }

        const value = parseInt(e.target.value);
        setStart(value);

        const end = value + groupGridCells?.totalItems - 1;
        setEnd(end);

        validateRange(value, end);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!groupGridCells) return;

        const isRangeValid = validateRange(start, end);

        if (!errors.start && !errors.end && !errors.range && start && end && isRangeValid) {
            setRengeCells({ start, end });
            handleOpenCloseModal(false);
        }
    };

    const handleOpenCloseModal = (visible: boolean) => {
        setIsRangeModalOpen(visible);
        setStart(0);
        setEnd(0);
        setErrors({});
    };

    return (
        <React.Fragment>
            {isRangeModalOpen && (
                <motion.div
                    className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-[9999]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <div className="w-96 bg-white p-6 relative rounded-lg">
                        <h1 className="text-black text-2xl font-bold mb-4">Select cell range</h1>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Start Range</label>
                                <input type="number" value={start || ''} onChange={handleStartChange} min={1} className="bg-white text-gray-700 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter start range" />
                                {errors.start && <span className="text-red-500 text-sm">{errors.start}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">End Range</label>
                                <input type="number" value={end || ''} disabled={true} className="border rounded-md p-2 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" placeholder="Enter end range" />

                                {groupGridCells && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-400">Total cells:</span>
                                        <span className="text-sm font-medium text-gray-500">{groupGridCells.totalItems} cells</span>
                                    </div>
                                )}
                            </div>

                            {(errors.range || errors.overlap) && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{errors.range || errors.overlap}</div>}

                            <div className="flex gap-2 mt-4">
                                <button type="button" onClick={() => handleOpenCloseModal(false)} className="bg-gray-500 text-white p-2 rounded-md w-24 hover:bg-gray-600 transition-colors">
                                    Cancel
                                </button>

                                <button type="submit" disabled={!start || !end || Boolean(errors.start) || Boolean(errors.end) || Boolean(errors.range) || Boolean(errors.overlap)} className="bg-[#7cc304] text-white p-2 rounded-md w-24 flex items-center justify-center hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed" >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
        </React.Fragment>
    );
};
