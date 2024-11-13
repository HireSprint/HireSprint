'use client'
import { useEffect, useState } from "react"
import { useForm, SubmitHandler, FieldValues, UseFormRegister, UseFormSetValue, FieldValues } from "react-hook-form"
import { ProductTypes } from "@/types/product"
import { categoriesInterface } from "@/types/category"

const AddProductPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<ProductTypes>()

    const imageFile = watch("image");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [categories, setCategories] = useState<categoriesInterface[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name) {
                console.log(`Campo ${name}:`, value[name]);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getCategories");
                const data = await resp.json();
                console.log("descarga categorias en form", data);
                if (resp.status === 200) {
                    setCategories(data.result);
                }
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        };

        getProductView();
    }, []);

    const onSubmit: SubmitHandler<ProductTypes> = async (data: ProductTypes) => {
        try {

            const formData = new FormData();

            // Campos básicos
            formData.append('name', data.name);
            formData.append('brand', data.brand);
            formData.append('upc', data.upc);
            formData.append('sku', data.sku);
            formData.append('price', '0');
            formData.append('sale_price', "0");
            formData.append('reg_price', '0');
            formData.append('unit_price', "0");
            formData.append('size', data.size);
            formData.append('variety', JSON.stringify(["Fruits", "test"]));
            formData.append('color', data.color);
            formData.append('conditions', data.conditions);
            formData.append('id_category', data.id_category);

            // Campos adicionales
            formData.append('desc', "test");
            formData.append('main', "test");
            formData.append('addl', "test");
            formData.append('burst', "test");
            formData.append('price_text', "test");
            formData.append('save_up_to', "test");
            formData.append('item_code', '0');
            formData.append('group_code', '0');
            formData.append('burst2', "test");
            formData.append('burst3', "test");
            formData.append('burst4', "test");
            formData.append('with_cart', 'true');
            formData.append('notes', "test");
            formData.append('buyer_notes', "test");
            formData.append('effective', "test");

            // Agregar la imagen
            if (data.image) formData.append('image', data.image[0]);

            console.log("datos enviados", Object.fromEntries(formData));

            const response = await fetch(`http://173.236.219.227:3003/createProduct`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            console.log("Producto creado exitosamente:", result);

        } catch (error) {
            console.error('Error al crear producto:', error);
        }
    };

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
                                {categories?.length > 0 && categories?.map((category: categoriesInterface) => (
                                    <option key={category.id_category} value={category.id_category}>
                                        {category.name_category}
                                    </option>
                                ))}
                            </select>
                            {errors.id_category && <span className="text-red-500">Este campo es requerido</span>}
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    {...register("image")}
                                    className="w-full bg-gray-500 text-white p-2 rounded-md"
                                    type="file"
                                    accept="image/*"
                                />
                                {errors.image && <span className="text-red-500">Este campo es requerido</span>}
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

export default AddProductPage
