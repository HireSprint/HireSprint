"use client";

import { watch } from "fs";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { PlusIcon, TrashIcon } from "../components/icons";
import { Tooltip } from 'primereact/tooltip';
import { Message } from "primereact/message";
import GridLayout from "react-grid-layout";
import { useCategoryContext } from "../context/categoryContext";
import { gridLayoutTypes, PartialGridLayoutTypes } from "@/types/gridLayout";
import { Skeleton } from 'primereact/skeleton';
import HoverGrid from "../components/hoverGrid";

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
	const [groupGridCells, setGroupGridCells] = useState<any>(null);
	const {categoriesData, getCategoryById, isLoadingCategories} = useCategoryContext();

	const imageFile = watch("image");
	const bg_width = watch('bg_width');
	const bg_height = watch('bg_height');

	useEffect(() => {
		const layoutStructure: gridLayoutTypes[] = []
		// const layoutStructure = [
		// 	{ w: 72,  h: 168,   x: 0,     y: 170,    moved: false,  i: "1",  static: true,  id_category: 5  },
		// 	{ w: 72,  h: 50,    x: 0,     y: 345,    moved: false,  i: "2",  static: true,  id_category: 16 },
		// 	{ w: 72,  h: 53,    x: 0,     y: 403,    moved: false,  i: "3",  static: true,  id_category: 7  },
		// 	{ w: 72,  h: 229,   x: 0,     y: 463,    moved: false,  i: "4",  static: true,  id_category: 4  },
		// 	{ w: 72,  h: 51,    x: 0,     y: 699,    moved: false,  i: "5",  static: true,  id_category: 6  },
		// 	{ w: 28,  h: 651,   x: 72,    y: 169,    moved: false,  i: "6",  static: false, id_category: 15 },
		// 	{ w: 72,  h: 64,    x: 0,     y: 756,    moved: false,  i: "7",  static: true,  id_category: 1  }
		// ]

		setLayout(layoutStructure);
		calculateNextPosition()
	}, []);
	
	
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


	const handleSelectedGroup = (group: any) => {
		const newLayout = customLayout.map((item: any) => ({ ...item, static: true }))
		
		let selectedGroup = null
		
		if (group) {			 
			 const selectedIndex = newLayout.findIndex((item: any) => item.i === group.i);

			 if (selectedIndex !== -1) {  
			   newLayout[selectedIndex].static = false;
			   selectedGroup = newLayout[selectedIndex];
			 }
		}

		setLayout(newLayout);
		setSelectedGroup(selectedGroup);
	}

	const onSubmit: SubmitHandler<any> = async (data: any) => {
		setIsSubmitting(true);
		
		setTimeout(() => {
			setIsSubmitting(false);
		}, 2000);
	}

	const layoutChangeHandler = (newLayout: any) => {
		setLayout(newLayout);
		calculateNextPosition()
	}


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

	const removeGroup = () => {
		if (!selectedGroup) return;

		setLayout((prevLayout: any) =>{
			const newLayout = prevLayout.filter((item: any) => item.i !== selectedGroup.i);
			return newLayout
		});
	
		setSelectedGroup(null);
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
		if (!selectedGroup){
			console.error("selectedGroup not found");
			return;
		} 
		
		const idCategory = e.target.value
		if (idCategory) {
			updateSelectedGroup({ i: selectedGroup.i, id_category: idCategory });
		}else{
			console.error("selectedCategory not found");
		}
	}
		
	const getCustomReference = (group: gridLayoutTypes): gridLayoutTypes => {
		const existingItemIndex = customLayout.findIndex((item: any) => item.i === group.i);
		return customLayout[existingItemIndex] || null
	}

	
	const handleGroupGridSelection = (data: any) => {
		setGroupGridCells(data);
	}
	
	const applyGroupGridCells = () => {
		if (!selectedGroup){
			console.error("selectedGroup not found");
			return;
		} 
		
		if (!groupGridCells){
			console.error("groupGridCells not found");
			return;
		} 
		
		console.log("groupGridCells", groupGridCells);
	}
	
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
	
								<div className="flex items-center justify-end gap-2">
									<Tooltip target="#remove-group-btn" content="Remove group" position="right" autoHide={true} />
									<button id="remove-group-btn" type="button" className="w-[30px] bg-red-500 text-white p-1 rounded-md hover:bg-red-700 transition-colors" onClick={() => removeGroup() } >
										<div className="flex items-center justify-center">
											<TrashIcon color="#fff" />
										</div>
									</button>
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

		<div className="h-full overflow-y-auto" onClick={() => handleSelectedGroup(null)}>
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
									<span className="text-gray-500 text-lg">No image selected</span>
								</div>
							)}
							<div className="w-full h-full absolute top-0 left-0 z-10 overflow-hidden">
								<GridLayout
									onLayoutChange={layoutChangeHandler}
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
												<div key={group.i} onClick={(e) => {
													e.stopPropagation(); // Prevenir la propagación del evento
													handleSelectedGroup(group);
												}}>
													<Tooltip target={"#div-" + group.i} position="top" > 
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

													<div id={"div-" + group.i} className={`w-full h-full border-[1px] border-[#7cc304] ${selectedGroup && selectedGroup?.i === group.i ? 'border-2 border-green-600 bg-green-100 bg-opacity-50' : ''}`} >
														
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
		</div>
		</div>
	);
};

export default BuilderPage;