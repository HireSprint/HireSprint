'use client'
import { useEffect, useState } from "react"
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import imageCompression from 'browser-image-compression';

// Actualiza este array de categorías
const categories = [
    { id: 1, name: "Frozen" },
    { id: 3, name: "Bakery" },
    { id: 4, name: "Grocery" },
    { id: 5, name: "Meat" },
    { id: 6, name: "Dairy" },
    { id: 7, name: "Deli" },
    { id: 9, name: "DSD" },
    { id: 10, name: "Floral" },
    { id: 11, name: "H&B-GM" },
    { id: 12, name: "Hot Foods - (pizza-Sandwich)" },
    { id: 13, name: "Liquor-Beer" },
    { id: 14, name: "Misc" },
    { id: 15, name: "Produce" },
    { id: 16, name: "SeaFood" },
    { id: 17, name: "Specialty" },
    { id: 18, name: "Breakfast" },
    { id: 19, name: "Snack" },
    { id: 20, name: "International" },
    { id: 21, name: "Fish" },
    { id: 22, name: "Beverage" },
    { id: 23, name: "Extra" },
    { id: 24, name: "Special" },
    { id: 25, name: "Better For You" }
];

const compressImage = async (file: File) => {
    const options = {
        maxSizeMB: 15,
        maxWidthOrHeight: 1024
    };

    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error('Error al comprimir imagen:', error);
        return file;
    }
};

const AddProductPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm()

    const imageFile = watch("image");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Agregar este useEffect para monitorear los cambios
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name) {
                console.log(`Campo ${name}:`, value[name]);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setIsSubmitting(true);
            setApiError(null);

            let compressedImage = null;
            if (data.image?.[0] instanceof File) {
                compressedImage = await compressImage(data.image[0]);
                console.log("Tamaño de imagen comprimida:", compressedImage.size);
            }

            const formData = new FormData();
            if (compressedImage) {
                formData.append('image', compressedImage);
            }

            // Crear el objeto personalizado con los datos
            const productData = {
                name: data.name,
                brand: data.brand,
                description: data.desc,
                upc: data.upc,
                size: data.size,
                variety: data.variety,
                color: data.color,
                conditions: data.conditions,
                id_category: data.id_category
            };

            // Agregar el resto de datos al FormData
            Object.entries(productData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            // Log de los datos antes de enviar
            console.log("Datos a enviar:", Object.fromEntries(formData));

            const response = await fetch('/api/apiMongo/addProduct', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                setApiError(errorData.error || 'Error al guardar el producto');
                return;
            }

            const result = await response.json();
            console.log("Respuesta exitosa:", result);

        } catch (error) {
            setApiError(error instanceof Error ? error.message : 'Error inesperado');
            console.error('Error completo:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (imageFile && imageFile[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(imageFile[0] as unknown as Blob);
        }
    }, [imageFile]);

    return (
        <div className="flex p-2 bg-[#121212] h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl mx-auto">
                {/* Información básica del producto */}
                <div className="col-span-2 md:col-span-3 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input {...register("name", { required: true })} placeholder="Name" className="bg-gray-500 text-white p-2 rounded-md" />
                        {errors.name && <span className="text-red-500">Este campo es requerido</span>}

                        <input {...register("brand")} placeholder="Brand" className="bg-gray-500 text-white p-2 rounded-md" />

                        <input {...register("upc", { required: true })} placeholder="UPC" className="bg-gray-500 text-white p-2 rounded-md" maxLength={12} minLength={12} />
                        {errors.upc && <span className="text-red-500">Este campo es requerido</span>}

                        <input {...register("desc")} placeholder="Description" className="bg-gray-500 text-white p-2 rounded-md" />
                    </div>
                </div>

                {/* Precios y códigos */}
                {/*  <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Prices</h2>
                    <div className="space-y-4">
                        <input type="number" {...register("price", { required: true })} placeholder="Price" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
                        {errors.price && <span className="text-red-500">Este campo es requerido</span>}
                        
                        <input type="number" {...register("sale_price")} placeholder="Sale Price" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
                        <input type="number" {...register("reg_price")} placeholder="Regular Price" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
                        <input {...register("unit_price")} placeholder="Unit Price" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
                    </div>
                </div>*/}

                {/* Detalles del producto */}
                <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Details</h2>
                    <div className="space-y-4">
                        <input {...register("size")} placeholder="Size" className="w-full bg-gray-500 text-white p-2 rounded-md" />
                        <input {...register("variety")} placeholder="Variety" className="w-full bg-gray-500 text-white p-2 rounded-md" />
                        <input {...register("color")} placeholder="Color" className="w-full bg-gray-500 text-white p-2 rounded-md" />
                        <input {...register("conditions")} placeholder="Conditions" className="w-full bg-gray-500 text-white p-2 rounded-md" />
                    </div>
                </div>

                {/* Imagen y categoría */}
                <div className="col-span-2 md:col-span-3 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Image and Category</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <select
                                {...register("id_category", { required: true })}
                                className="w-full bg-gray-500 text-white p-2 rounded-md"
                                defaultValue=""
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.id_category && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    {...register("image")}
                                    className="w-full bg-gray-500 text-white p-2 rounded-md"
                                    type="file"
                                    accept="image/*"

                                />
                                {errors.image && <span className="text-red-500">This field is required</span>}
                            </div>
                            {previewUrl && (
                                <div className="flex-shrink-0">
                                    <img
                                        src={previewUrl}
                                        alt="Vista previa"
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {apiError && (
                    <div className="col-span-2 md:col-span-3 bg-red-500 text-white p-4 rounded-lg">
                        {apiError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 col-span-2 md:col-span-3 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center"
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
    )
}

export default AddProductPage;
