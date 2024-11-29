"use client";

import { watch } from "fs";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TrashIcon } from "../components/icons";
import { Tooltip } from 'primereact/tooltip';
        
const BuilderPage = () => {
	const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<any>({ defaultValues: { id_category: 0, } })

	const formRef = useRef<HTMLFormElement>(null);
	const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
	const imageFile = watch("image");
	

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
		console.log( "data", data);
		
	}

  return (
    <div className="w-full h-full grid grid-cols-[min-content_1fr]">
      <div className="bg-gray-300 w-[300px] h-full p-3">
					<form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 gap-2 w-full max-w-6xl mx-auto" >
						<input {...register("image")} className="hidden" type="file" accept="image/*" id="backgroundInput" />
						<h2 className="text-black text-xl mb-1">Background Image </h2>

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
					</form>
      </div>

      <div className="p-4">
        {
            backgroundUrl && (
                <img src={backgroundUrl} alt="Vista previa" className="w-full h-64 object-contain rounded-md hover:opacity-80 transition-opacity" />
            )
        }
      </div>
    </div>
  );
};

export default BuilderPage;
