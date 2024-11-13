'use client'
import { useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { ProductTypes } from "@/types/product"

// Añade este array de categorías (puedes moverlo a un archivo separado)
const categories = [
  { id: 1, name: "Frozen" },
  { id: 2, name: "Dairy" },
  { id: 3, name: "Beverages" },
  { id: 4, name: "Snacks" },
  // Añade más categorías según necesites
];

const AddProductPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<ProductTypes>()
      
    const imageFile = watch("url_image");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Agregar este useEffect para monitorear los cambios
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name) {
                console.log(`Campo ${name}:`, value[name]);
            }
        });
        
        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmit: SubmitHandler<ProductTypes> = async (data) => {
        try {
            setIsSubmitting(true);
            
            // Crear el objeto personalizado con los datos
            const productData = {
                name: data.name,
                brand: data.brand,
                upc: data.upc,
                sku: data.sku,
                price: data.price,
                sale_price: data.sale_price,
                reg_price: data.reg_price,
                unit_price: data.unit_price,
                size: data.size,
                variety: data.variety,
                color: data.color,
                conditions: data.conditions,
                id_category: data.id_category
            };

            // Crear FormData
            const formData = new FormData();
            if (data.url_image && data.url_image[0]) {
                formData.append('url_image', data.url_image[0]);
            }

            // Agregar el resto de datos al FormData
            Object.entries(productData).forEach(([key, value]) => {
                if (value) formData.append(key, value.toString());
            });

            // Log para ver qué datos se están enviando
            console.log("Datos a enviar:", Object.fromEntries(formData));

            const response = await fetch('/api/apiMongo/addProduct', {
                method: 'POST',
                body: formData
            });

            // Log para ver la respuesta completa
            console.log("Respuesta completa:", response);

            if (!response.ok) {
                // Intentar obtener el mensaje de error del servidor
                const errorData = await response.json().catch(() => null);
                console.log("Datos del error:", errorData);
                throw new Error(errorData?.message || `Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            console.log("Respuesta exitosa:", result);
            
        } catch (error) {
            console.error('Error detallado:', error);
            throw error; // Re-lanzar el error para que pueda ser manejado por el componente
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
            reader.readAsDataURL(imageFile[0] as Blob);
        }
    }, [imageFile]);

    return (
        <div className="flex p-2 bg-[#121212] h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl mx-auto">
                {/* Información básica del producto */}
                <div className="col-span-2 md:col-span-3 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input {...register("name", { required: true })} placeholder="Name" className="bg-gray-500 text-white p-2 rounded-md"/>
                        {errors.name && <span className="text-red-500">Este campo es requerido</span>}
                        
                        <input {...register("brand")} placeholder="Brand" className="bg-gray-500 text-white p-2 rounded-md"/>
                        
                        <input {...register("upc", { required: true })} placeholder="UPC" className="bg-gray-500 text-white p-2 rounded-md" maxLength={12} minLength={12}/>
                        {errors.upc && <span className="text-red-500">Este campo es requerido</span>}
                        
                        <input {...register("sku")} placeholder="SKU" className="bg-gray-500 text-white p-2 rounded-md"/>
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
                        <input {...register("size")} placeholder="Size" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
                        <input {...register("variety")} placeholder="Variety" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
                        <input {...register("color")} placeholder="Color" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
                        <input {...register("conditions")} placeholder="Conditions" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
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
                            >
                                <option value="">Select a category</option>
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
                                    {...register("url_image")} 
                                    className="w-full bg-gray-500 text-white p-2 rounded-md" 
                                    type="file" 
                                    accept="image/*"
                                    
                                />
                                {errors.url_image && <span className="text-red-500">This field is required</span>}
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
