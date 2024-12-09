"use client";

import { watch } from "fs";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MoveIcon, PlusIcon, TrashIcon } from "../components/icons";
import { Tooltip } from 'primereact/tooltip';
import { Message } from "primereact/message";
import GridLayout from "react-grid-layout";
import { useCategoryContext } from "../context/categoryContext";
import { gridLayoutTypes, PartialGridLayoutTypes } from "@/types/gridLayout";
import { Skeleton } from 'primereact/skeleton';
import HoverGrid from "../components/hoverGrid";
import { AnimatePresence, motion } from "framer-motion";

const BuilderPage = () => {
	const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<any>({ defaultValues: { id_category: 0, bg_width: '430', bg_height: '820' } })

	const cols = 100; // Número de columnas del grid
	const rowHeight = 1; // Altura de una fila
	const elementWidth = 10; // Ancho del nuevo elemento
	const elementHeight = 40; // Altura del nuevo elemento

	const formRef = useRef<HTMLFormElement>(null);
	const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [layout, setLayout] = useState<gridLayoutTypes[]>([]);
	const [customLayout, setCustomLayout] = useState<gridLayoutTypes[]>([]);
	const [newGroup, setNewGroup] = useState({ canAddAnother: true, x: 0, y: 0, });
	const [selectedGroup, setSelectedGroup] = useState<gridLayoutTypes | null>(null);
	const [selectedCell, setSelectedCell] = useState<gridLayoutTypes | null>(null);
	const [groupGridCells, setGroupGridCells] = useState<any>(null);
	const {categoriesData, getCategoryById, isLoadingCategories} = useCategoryContext();
	const [elementDimensions, setElementDimensions] = useState<{[key: string]: {width: number, height: number}}>({});


	const imageFile = watch("image");
	const bg_width = watch('bg_width');
	const bg_height = watch('bg_height');

	useEffect(() => {
		
		const layoutStructure: gridLayoutTypes[] = [
			{ w: 72,  h: 168,   x: 0,     y: 170,    moved: false,  i: "1",  static: true,  id_category: 5  },
			{ w: 72,  h: 50,    x: 0,     y: 345,    moved: false,  i: "2",  static: true,  id_category: 16 },
			{ w: 72,  h: 53,    x: 0,     y: 403,    moved: false,  i: "3",  static: true,  id_category: 7  },
			{ w: 72,  h: 229,   x: 0,     y: 463,    moved: false,  i: "4",  static: true,  id_category: 4  },
			{ w: 72,  h: 51,    x: 0,     y: 699,    moved: false,  i: "5",  static: true,  id_category: 6  },
			{ w: 28,  h: 651,   x: 72,    y: 169,    moved: false,  i: "6",  static: false, id_category: 15 },
			{ w: 72,  h: 64,    x: 0,     y: 756,    moved: false,  i: "7",  static: true,  id_category: 1  }
		]

		setLayout(layoutStructure);
		calculateNextPosition()
	}, []);

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
		  entries.forEach(entry => {
			const id = entry.target.getAttribute('id');
			
			if (id) {
			  setElementDimensions(prev => ({
				...prev,
				[id]: {
				  width: entry.contentRect.width,
				  height: entry.contentRect.height
				}
			  }));
			}
		  });
		});
	
		document.querySelectorAll('[id^="group-"]').forEach(element => observer.observe(element));
	
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
				customLayout[existingItemIndex] = { ...customLayout[existingItemIndex], ...item };
				return customLayout[existingItemIndex]
			} else {	
				return item
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


	const makeAllGroupAndCellsStatic = (groups: gridLayoutTypes[]) => {
		return groups.map((group: gridLayoutTypes) => {
			const newGroup = { ...group, static: true };
			
			if (Array.isArray(group.gridCells) && group.gridCells.length > 0) {
				newGroup.gridCells = group.gridCells.map((cell: gridLayoutTypes) => ({ ...cell, static: true }));
			}
			
			return newGroup;
		});
	};

	const toggleStatic = (type: 'group' | 'cell') => {
		
		if (type === 'group' && !selectedGroup) return;	
		if (type === 'cell' && (!selectedCell || !selectedGroup)) return;	
		
		
		const newLayout = makeAllGroupAndCellsStatic(customLayout);
		const selectedGroupIndex = newLayout.findIndex((item: any) => item.i === selectedGroup?.i );
		
		if (selectedGroupIndex === -1) return;
		const newGroupSelected = {...newLayout[selectedGroupIndex]};

		if (type === 'group') {
			// Toggle grupo
			newGroupSelected.static = !selectedGroup?.static;
			setSelectedGroup(newGroupSelected);
		} else {
			// Toggle celda
			if (newLayout[selectedGroupIndex].gridCells && newLayout[selectedGroupIndex].gridCells.length > 0) {
				const selectedCellIndex = newLayout[selectedGroupIndex].gridCells.findIndex((item: any) => item.i === selectedCell?.i );
				
				if (selectedCellIndex === -1)  return;
				const newCellSelected = {...newLayout[selectedGroupIndex].gridCells[selectedCellIndex]};
				
				newCellSelected.static = !selectedCell?.static;
				newLayout[selectedGroupIndex].gridCells[selectedCellIndex] = newCellSelected;

				setSelectedCell(newCellSelected);
			}
		}
		
		setLayout(newLayout);
	};

	const handleSelection = (element: any) => {
		const newLayout = makeAllGroupAndCellsStatic(customLayout);
		let newSelectedGroup = null;
		let newSelectedCell = null;

		// Si no hay elemento, limpiar selecciones
		if (!element) {
			setLayout(newLayout);
			setSelectedGroup(null);
			setSelectedCell(null);
			return;
		}

		// Determinar si es una celda o un grupo
		const isCell = 'groupI' in element;

		if (isCell) {
			// Si hay un grupo seleccionado y no es estático, no hacer nada
			if (selectedGroup && !selectedGroup.static && element.groupI === selectedGroup.i) return;

			// Encontrar y seleccionar el grupo al que pertenece la celda
			const groupIndex = newLayout.findIndex(item => item.i === element.groupI);
			
			if (groupIndex !== -1) {
				newSelectedGroup = newLayout[groupIndex];
				
				// Buscar y seleccionar la celda
				if (newLayout[groupIndex].gridCells && newLayout[groupIndex].gridCells.length > 0) {
					const cellIndex = newLayout[groupIndex].gridCells.findIndex(cell => cell.i === element.i );
					if (cellIndex !== -1) {
						newLayout[groupIndex].gridCells[cellIndex].static = false;
						newSelectedCell = newLayout[groupIndex].gridCells[cellIndex];
					}
				}
			}
		} else {
			// Selección de grupo
			const groupIndex = newLayout.findIndex(item => item.i === element.i);
			if (groupIndex !== -1) {
				newLayout[groupIndex].static = false;
				newSelectedGroup = newLayout[groupIndex];
			}
		}

		setLayout(newLayout);
		setSelectedGroup(newSelectedGroup);
		setSelectedCell(newSelectedCell);
	};

	const onSubmit: SubmitHandler<any> = async (data: any) => {
		setIsSubmitting(true);
		
		setTimeout(() => {
			setIsSubmitting(false);
		}, 2000);
	}

	const layoutGroupChangeHandler = (newLayout: any) => {
		setLayout(newLayout);
		calculateNextPosition()
	}
	
	const layoutCellChangeHandler = (newLayout: any) => {
		if (!selectedGroup) return;
		

		// Crear una copia profunda del layout actual
		const updatedLayout = layout.map(group => {
			if (group.i === selectedGroup.i) {
				// Preservar las propiedades existentes de las celdas
				const updatedCells = newLayout.map((newCell: any) => {
					const existingCell = group.gridCells?.find((cell: any) => cell.i === newCell.i);
					return { ...existingCell, ...newCell, groupI: selectedGroup.i, static: existingCell?.static ?? true, id_category: selectedGroup.id_category };
				});

				return { ...group, gridCells: updatedCells };
			}
			return group;
		});

		setLayout(updatedLayout);
		
		// Actualizar el grupo seleccionado con la nueva referencia
		const newSelectedGroup = updatedLayout.find(group => group.i === selectedGroup.i);
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
		const numbers = layout.map(item => parseInt(item.i)).sort((a, b) => a - b);
		
		if (numbers.length === 0) return 1;
		
		for (let i = 1; i <= numbers.length; i++) {
			if (numbers[i - 1] !== i) return i;
		}
		
		return numbers[numbers.length - 1] + 1;
	}

	const addGroup = () => {
		
		if (!newGroup.canAddAnother) return;

		const newItem = { i: `${findNextAvailableNumber(layout)}`, x: newGroup.x, y: newGroup.y, w: elementWidth, h: elementHeight, moved: false, static: true, id_category: null };
		
		setLayout((prevLayout: any) =>{
			return [...prevLayout, {...newItem}]
		});
	
		calculateNextPosition();
	};

	const remove = (type: 'group' | 'cell') => {
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
			setLayout((prevLayout: any) => {
				return prevLayout.map((group: any) => {
					if (group.i === selectedGroup?.i) {
						return {
							...group,
							gridCells: group.gridCells?.filter((cell: any) => cell.i !== selectedCell?.i)
						};
					}
					return group;
				});
			});
			setSelectedCell(null);
		}
		
		calculateNextPosition();
	};

	const updateSelectedGroup = (group: PartialGridLayoutTypes) => {
		const newLayout = [...layout]
		const selectedIndex = newLayout.findIndex((item: any) => item.i === group.i);

		if (selectedIndex !== -1) {  
			newLayout[selectedIndex] = { ...newLayout[selectedIndex], ...group };
			setSelectedGroup(newLayout[selectedIndex]);
		}

		setLayout(newLayout);
	}

	const handleCategoryChange = (e: any) => {
		if (!selectedGroup) return;
		
		const idCategory = e.target.value
		if (idCategory) updateSelectedGroup({ i: selectedGroup.i, id_category: idCategory });
	}
		
	const getCustomReference = (group: gridLayoutTypes): gridLayoutTypes | null => {
		const existingItemIndex = customLayout.findIndex((item: any) => item.i === group.i);
		return customLayout[existingItemIndex] || null;
	}

	
	const handleGroupGridSelection = (data: any) => {
		setGroupGridCells(data);
	}
	

	const generateGridCells = (num_rows: number, num_cols: number) => {
		if (!selectedGroup) return;
		
		const cells: gridLayoutTypes[] = [];
		let cellCounter = 1;
	  
		// Espaciado entre las celdas
		const spacing = 0.4; 
		const totalXSpacing = (num_cols - 1) * spacing; // Total espacio horizontal ocupado por separaciones
		const totalYSpacing = (num_rows - 1) * spacing; // Total espacio vertical ocupado por separaciones
	  
		// Calcular dimensiones efectivas
		const effectiveWidth = (100 - totalXSpacing) / num_cols;
		const totalHeight =
		  elementDimensions[`group-${selectedGroup?.i}`]?.height || 0;
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
			  id_category: selectedGroup.id_category,
			  groupI: selectedGroup.i
			});
	  
			currentX += effectiveWidth + spacing;
			cellCounter++;
		  }
		}
	  
		return cells;
	  };
	  

	const applyGroupGridCells = () => {
		if (!selectedGroup) return;
		if (!groupGridCells) return;

		const { rows, cols } = groupGridCells;
		const generatedCells = generateGridCells(rows, cols);
		const newLayout = makeAllGroupAndCellsStatic(customLayout);

		const updatedLayout = newLayout.map(group => {
			if (group.i === selectedGroup.i) {
				setSelectedGroup({...group, gridCells: generatedCells});
				return { ...group, gridCells: generatedCells };
			}
			return group;
		});

		setLayout(updatedLayout);
	};
	
	if (isLoadingCategories) {
		return  <Skeleton width="100%" height="100%" borderRadius="0"> </Skeleton>
	}

	return (        
		<div className="w-full h-full grid grid-cols-[min-content_1fr] overflow-hidden">
			<div className="bg-gray-300 w-[300px] h-full p-2 pt-4">
				<form ref={formRef} onSubmit={handleSubmit(onSubmit)} >
					<h2 className="text-green-800 font-bold text-xl mb-1">Background </h2>
					<div className="bg-gray-400 bg-opacity-[0.4] p-2 rounded-md">
						<input {...register("image")} className="hidden" type="file" accept="image/*" id="backgroundInput" />
						<h2 className="text-black text-lg mb-0">Image </h2>
						<div className="flex items-center justify-center gap-3">
							<button type="button" className="w-[120px] bg-[#7cc304] text-white p-1 rounded-md hover:bg-green-600 transition-colors flex-1" onClick={() => document.getElementById("backgroundInput")?.click() } >
								<span className="text-sm">{ "Browse files" }</span> 
							</button>

							{ backgroundUrl && (
								<div className="flex items-center justify-center">
									<Tooltip target="#remove-background-btn" content="Remove background image" position="right" autoHide={true} />
									<button id="remove-background-btn" type="button" className="w-[30px] bg-red-500 text-white p-1 rounded-md hover:bg-red-700 transition-colors" onClick={() => setBackgroundUrl(null) } >
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
								<input type="number" {...register("bg_height", { required: true })} className="bg-white text-gray-700 p-1 rounded w-full" placeholder="Height" />
							</div>

							<div className="flex items-center justify-center gap-2">
								<span className="text-gray-500 text-lg">Width</span>
								<input type="number" {...register("bg_width", { required: true })} className="bg-white text-gray-700 p-1 rounded w-full" placeholder="Width" />
							</div>
						</div>
					</div>

					<h2 className="text-green-800 font-bold text-xl mb-1 mt-4">Group </h2>
					<div className="bg-gray-400 bg-opacity-[0.4] p-2 rounded-md">

						<div className="flex items-center justify-end  gap-2">
							<span className="text-gray-500 text-lg">Add Group</span>
							<button disabled={!newGroup.canAddAnother} type="button" className="p-2 rounded-md bg-[#7cc304] hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { addGroup() }} >
								<PlusIcon  color="#fff"/>
							</button>
						</div>


						{ selectedGroup && (
							<div className="flex flex-col gap-2 bg-gray-200 p-2 rounded-md mt-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<h2 className="text-black text-md font-bold text-green-700 mb-0">Selected Group </h2>
										<span className="text-black text-md font-bold text-green-700 mb-0">{selectedGroup.i}</span>
									</div>
		
									<div className="flex gap-2 items-center">
										<div className="flex items-center justify-end gap-2">
											<Tooltip target="#move-group-btn" content={`${ selectedGroup.static ? 'Move group' : 'Make group static' }`} position="top"  />
											<button id="move-group-btn" type="button" className={`w-[30px] text-white p-1 rounded-md ${ selectedGroup.static ? 'bg-gray-300 hover:bg-gray-400' : 'bg-[#7cc304] hover:bg-green-600' } transition-colors`} onClick={() => toggleStatic('group') } >
												<div className="flex items-center justify-center">
													<MoveIcon color={`${ selectedGroup.static ? '#9e9c9c' : '#fff' }`} />
												</div>
											</button>
										</div>

										<div className="flex items-center justify-end gap-2">
											<Tooltip target="#remove-group-btn" content="Remove group" position="top"  />
											<button id="remove-group-btn" type="button" className="w-[30px] text-white p-1 rounded-md bg-red-500 hover:bg-red-700 transition-colors" onClick={() => remove('group') } >
												<div className="flex items-center justify-center">
													<TrashIcon color="#fff" />
												</div>
											</button>
										</div>
									</div>
								</div>


								<div className="flex flex-col gap-1">
									<h2 className="text-black text-lg mb-0">Category </h2>

									<select className="text-black w-36 font-bold px-1 py-2 rounded-md" value={selectedGroup?.id_category || ''} onChange={handleCategoryChange} >
										<option value="" disabled>Select category</option>
										{categoriesData.map((cat) => (
											<option key={cat.id_category} value={cat.id_category}> {cat.name_category} </option>
										))}
									</select>
								</div>

								<div className="flex flex-col gap-1">
									<h2 className="text-black text-lg mb-0">Select the cells of the group. </h2>

									<HoverGrid key={selectedGroup?.i} rows={11} cols={8} onSelection={handleGroupGridSelection} />

									<div className="flex items-center justify-end">
										<button disabled={!groupGridCells} type="button" className="w-[120px] bg-[#7cc304] text-white p-1 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { applyGroupGridCells() }} >	Apply </button>
									</div>
								</div>
							</div>

						)}


					</div>
					
					<button
						type="submit"
						disabled={isSubmitting}
						className="h-10 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center mt-5"
						>
						{isSubmitting ? (
							<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						) : (
							'Submit'
						)}
					</button>
				</form>
			</div>

			<div className="relative h-full overflow-y-auto" onClick={() => { handleSelection(null) }}>
				<div className="p-4">
					<div className="w-full flex justify-center">
						{	
							!bg_width|| !bg_height ? (
								<div className="flex items-center justify-center">
									<Message style={{ borderLeft: "6px solid #b91c1c", color: "#b91c1c" }} severity="error" text="You must specify the width and height of the background" className="mb-4" />
								</div>
							) :
							<div className="flex items-center justify-center relative">
								{ backgroundUrl ? (
									<img src={backgroundUrl} alt="Vista previa" className="object-fill" draggable={false} style={{ width: `${bg_width}px`, height: `${bg_height}px` }}/>
								) : (
									<div className={`bg-white rounded-md flex items-center justify-center`}  style={{ width: `${bg_width}px`, height: `${bg_height}px` }}>
										{/* <span className="text-gray-500 text-lg">No image selected</span> */}
									</div>
								)}
								<div className="w-full h-full absolute top-0 left-0 z-10 overflow-hidden">
									<GridLayout
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
										// resizeHandles={['se', 'ne', 'nw', 'sw', 'e', 'n', 'w', 's']}
										resizeHandles={['se']}
										compactType={null}
										>
											{
												layout.map((group: gridLayoutTypes) => (
													<div key={group.i} onClick={(e) => { e.stopPropagation(); handleSelection(group); }}>
														<Tooltip target={"#group-" + group.i} position="top" disabled={(getCustomReference(group)?.gridCells || [])?.length > 0 ?? false} > 	
															<div className="flex flex-col gap-3">
																<div className="flex items-center gap-1">
																	<span className="text-white text-md font-bold">Grupo</span>
																	<span className="text-white text-sm">{group.i}</span>	
																</div>
																{ getCustomReference(group)?.id_category && (
																	<div className="flex items-center gap-1">
																		<span className="text-white text-md font-bold">Category: </span>
																		<span className="text-white text-sm">{getCategoryById(getCustomReference(group)?.id_category || 0)?.name_category}</span>	
																	</div>
																)}
															</div>
														</Tooltip>

														<div id={"group-" + group.i} className={`w-full h-full border-[1px] border-[#7cc304] box-border cursor-pointer ${selectedGroup && selectedGroup?.i === group.i ? 'border-2 border-green-600 hover:bg-green-600 hover:bg-opacity-[0.3] bg-green-600 bg-opacity-[0.2]' : 'hover:bg-black hover:bg-opacity-[0.2]'}`} >
															{
																elementDimensions && getCustomReference(group)?.gridCells && (
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
																		// resizeHandles={['se', 'ne', 'nw', 'sw', 'e', 'n', 'w', 's']}
																		resizeHandles={['se']}
																		compactType={null}
																	>
																		{ getCustomReference(group)?.gridCells?.map((cell: gridLayoutTypes) => (
																			<div id={ 'cell-' + cell.i } key={cell.i} onClick={(e) => { e.stopPropagation(); handleSelection(cell); }}>
																				<Tooltip target={"#cell-" + cell.i} position="top" > 	
																					<div className="flex flex-col gap-3">
																						<div className="flex items-center gap-1">
																							<span className="text-white text-md font-bold">Grupo</span>
																							<span className="text-white text-sm">{group.i}</span>	
																						</div>
																						<div className="flex items-center gap-1">
																							<span className="text-white text-md font-bold">Cell</span>
																							<span className="text-white text-sm">{cell.i.replace(`cell-${group.i}-`, '')}</span>	
																						</div>
																						{ getCustomReference(group)?.id_category && (
																							<div className="flex items-center gap-1">
																								<span className="text-white text-md font-bold">Category: </span>
																								<span className="text-white text-sm">{getCategoryById(getCustomReference(group)?.id_category || 0)?.name_category}</span>	
																							</div>
																						)}
																					</div>
																				</Tooltip>
																				<div className={`w-full h-full border-[1px] border-gray-500 rounded text-black ${selectedCell && selectedCell?.i === cell.i ? 'border-2 border-green-600 hover:bg-green-600 hover:bg-opacity-[0.3] bg-green-600 bg-opacity-[0.2]' : 'hover:bg-black hover:bg-opacity-[0.2]'}`} >
																				</div>
																			</div>
																		))}
																	</GridLayout>
																)
															}
															</div>
													</div>
												))
											}
										</GridLayout>
								</div>
							</div>
						}
					</div>
				</div>
				
				<AnimatePresence>
					{ selectedCell && (
						<motion.div
							initial={{opacity: 0, y: 20}}
							exit={{opacity: 0, y: 20}}
							animate={{opacity: 1, y: 0}}
							transition={{duration: 0.5}}
							className="fixed top-[calc(100vh-50%)] right-3"
						>
							<CellToolBox selectedCell={selectedCell} toggleStatic={toggleStatic} remove={remove} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			

		</div>
	);
};

export default BuilderPage;

interface cellToolBoxProps {
	selectedCell: gridLayoutTypes;
	toggleStatic: (type: 'group' | 'cell') => void;
	remove: (type: 'group' | 'cell') => void;
}

const CellToolBox: React.FC<cellToolBoxProps> = ({selectedCell, toggleStatic, remove}) => {
	return (
		<div className="flex flex-col gap-2 bg-gray-200 p-2 rounded-md mt-3">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<h2 className="text-black text-md font-bold text-green-700 mb-0">Selected Cell </h2>

				</div>

				<div className="flex gap-2 items-center">
					<div className="flex items-center justify-end gap-2">
						<Tooltip target="#move-cell-btn" content={`${ selectedCell.static ? 'Move cell' : 'Make cell static' }`} position="top" />
						<button id="move-cell-btn" type="button" className={`w-[30px] text-white p-1 rounded-md ${ selectedCell.static ? 'bg-gray-300 hover:bg-gray-400' : 'bg-[#7cc304] hover:bg-green-600' } transition-colors`} onClick={(e) => { e.stopPropagation(); toggleStatic('cell') } } >
							<div className="flex items-center justify-center">
								<MoveIcon color={`${ selectedCell.static ? '#9e9c9c' : '#fff' }`} />
							</div>
						</button>
					</div>

					<div className="flex items-center justify-end gap-2">
						<Tooltip target="#remove-cell-btn" content="Remove cell" position="top" />
						<button id="remove-cell-btn" type="button" className="w-[30px] text-white p-1 rounded-md bg-red-500 hover:bg-red-700 transition-colors" onClick={(e) => { e.stopPropagation(); remove('cell') } } >
							<div className="flex items-center justify-center">
								<TrashIcon color="#fff" />
							</div>
						</button>
					</div>
				</div>
			</div>


			{/* <div className="flex flex-col gap-1">
				<h2 className="text-black text-lg mb-0">Category </h2>

				<select className="text-black w-36 font-bold px-1 py-2 rounded-md" value={selectedGroup?.id_category || ''} onChange={handleCategoryChange} >
					<option value="" disabled>Select category</option>
					{categoriesData.map((cat) => (
						<option key={cat.id_category} value={cat.id_category}> {cat.name_category} </option>
					))}
				</select>
			</div> */}

			{/* <div className="flex flex-col gap-1">
				<h2 className="text-black text-lg mb-0">Select the cells of the group. </h2>

				<HoverGrid key={selectedGroup?.i} rows={11} cols={8} onSelection={handleGroupGridSelection} />

				<div className="flex items-center justify-end">
					<button disabled={!groupGridCells} type="button" className="w-[120px] bg-[#7cc304] text-white p-1 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { applyGroupGridCells() }} >	Apply </button>
				</div>
			</div> */}
		</div>
	)
}