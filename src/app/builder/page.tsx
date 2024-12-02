"use client";

import { watch } from "fs";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { PlusIcon, TrashIcon } from "../components/icons";
import { Tooltip } from 'primereact/tooltip';
import { Message } from "primereact/message";
import GridLayout from "react-grid-layout";

const BuilderPage = () => {
	const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<any>({ defaultValues: { id_category: 0, bg_width: '430', bg_height: '820' } })

	const cols = 50; // Número de columnas del grid
	const rowHeight = 1; // Altura de una fila
	const elementWidth = 5; // Ancho del nuevo elemento
	const elementHeight = 40; // Altura del nuevo elemento

	const formRef = useRef<HTMLFormElement>(null);
	const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [layout, setLayout] = useState<any>([]);
	const [newGroup, setNewGroup] = useState({ canAddAnother: true, x: 0, y: 0, });
	
	useEffect(() => {
		setLayout(
			[
				// { "w": 36, "h": 51, "x": 0, "y": 344, "i": "1", "moved": false, "static": false },
				// { "w": 36, "h": 168, "x": 0, "y": 171, "i": "2", "moved": false, "static": false },
				// { "w": 36, "h": 52, "x": 0, "y": 403, "i": "3", "moved": false, "static": false }
			  ]
		);
		calculateNextPosition()
	}, []);

	const imageFile = watch("image");
	const bg_width = watch('bg_width');
	const bg_height = watch('bg_height');

	useEffect(() => {
			if (imageFile && imageFile[0]) {
					const reader = new FileReader();
					reader.onload = (e) => {
							setBackgroundUrl(e.target?.result as string);
					};
					reader.readAsDataURL(imageFile[0] as Blob);
			}
	}, [imageFile]);

	const onSubmit: SubmitHandler<any> = async (data: any) => {
		setIsSubmitting(true);
		console.log( "data", data);	
		
		setTimeout(() => {
			setIsSubmitting(false);
		}, 2000);
	}

	const layoutChangeHandler = (layout: any) => {
		console.log("layout", layout);
		console.log("layout", JSON.stringify(layout));
		
		setLayout(layout);
		calculateNextPosition()
	}


	  // Función para calcular si cabe un nuevo elemento
	  const calculateNextPosition = () => {
		const totalRows = Math.floor(bg_height / rowHeight);
		const grid = Array.from({ length: totalRows }, () => Array(cols).fill(false));

	
		// Mark occupied positions in the grid more efficiently
		for (const item of layout) {
			const maxY = Math.min(item.y + item.h, totalRows);
			const maxX = Math.min(item.x + item.w, cols);
	
			for (let y = item.y; y < maxY; y++) {
				for (let x = item.x; x < maxX; x++) {
					grid[y][x] = 1;
				}
			}
		}
	
		// Find the first free space that can contain the element
		for (let y = 0; y < totalRows - elementHeight + 1; y++) {
			for (let x = 0; x <= cols - elementWidth; x++) {
				let spaceAvailable = true;
	
				// Check if the space is completely free using nested loop break
				outer: for (let dy = 0; dy < elementHeight; dy++) {
					for (let dx = 0; dx < elementWidth; dx++) {
						if (grid[y + dy][x + dx]) {
							spaceAvailable = false;
							break outer;
						}
					}
				}
	
				// If a free space is found, set the new group
				if (spaceAvailable) {
					setNewGroup({ canAddAnother: true, x, y });
					return;
				}
			}
		}
	
		// If no space is found in any row
		setNewGroup({ canAddAnother: false, x: 0, y: 0 });
	  };

	const addGroup = () => {
		if (!newGroup.canAddAnother) return;

		const newItem = {
		  i: `item-${layout.length + 1}`,
		  x: newGroup.x,
		  y: newGroup.y,
		  w: elementWidth,
		  h: elementHeight,
		};
	
		setLayout((prevLayout: any) => [...prevLayout, newItem]);
	
		// Recalcular posición del próximo elemento
		calculateNextPosition();
	};
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
							<button id="remove-background-btn" type="button" className="w-[30px] bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition-colors" onClick={() => setBackgroundUrl(null) } >
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

				<div className="flex items-center  gap-2">
					<span className="text-gray-500 text-lg">Add Group</span>
					<button disabled={!newGroup.canAddAnother} type="button" className="p-2 rounded-md bg-[#7cc304] hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { addGroup() }} >
						<PlusIcon  color="#fff"/>
					</button>
				</div>
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

      <div className="h-full overflow-y-auto">
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
										layout.map((group: any) => (
											<div key={group.i} className="w-full h-full border-[1px] border-gray-500" >{group.i}</div>
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
