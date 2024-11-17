'use client'
import { useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { ProductTypes } from "@/types/product"
import { categoriesInterface } from "@/types/category"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ProductAddedModal } from "../components/card"

const AddProductPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch, 
        reset
    } = useForm<ProductTypes>({
        defaultValues: {
            id_category: 0,
        }
    })

    const imageFile = watch("image");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [categories, setCategories] = useState<categoriesInterface[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const selectedCategory = watch("id_category");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [addProduct, setAddProduct] = useState<ProductTypes[]>([]);
    const [newCategory, setNewCategory] = useState<string>("");
    const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);

 const categoryFields: Record<string, {name: string, placeholder: string}[]> = {
    "5": [
        {name: "type_of_meat", placeholder: "Type of meat"},
        {name: "type_of_cut", placeholder: "Type OF cut"},
        {name: "quality_cf", placeholder: "Quality CF"},
        {name: "size", placeholder: "Size / Pack"},
        {name: "sku", placeholder: "SKU"},
    ],
    "16": [
        {name: "type_of_meat", placeholder: "Type of meat"},
        {name: "type_of_cut", placeholder: "Type OF cut"},
        {name: "quality_cf", placeholder: "Quality CF"},
        {name: "size", placeholder: "Size / Pack"},
        {name: "sku", placeholder: "SKU"},
    ]
 };

    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getCategories");
                const data = await resp.json();
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
            formData.append('name', data.name || "");
            formData.append('brand', data.brand || "");
            formData.append('upc', String(data.upc));
            formData.append('sku', data.sku || "");
            formData.append('price', '0');
            formData.append('sale_price', "0");
            formData.append('reg_price', '0');
            formData.append('unit_price', "0");
            formData.append('size', String(data.size) || "");
            formData.append('variety', data.variety ? JSON.stringify(data.variety) : "");
            formData.append('color', String(data.color) || "");
            formData.append('conditions', String(data.conditions) || "");
            formData.append('id_category',String(data.id_category));

            // Campos adicionales
            formData.append('desc', data.desc || "");
            formData.append('main', data.main || "");
            formData.append('addl', data.addl || "");
            formData.append('burst', data.burst || "");
            formData.append('price_text', data.price_text || "");
            formData.append('save_up_to', data.save_up_to || "");
            formData.append('item_code', '0');
            formData.append('group_code', '0');
            formData.append('burst2', data.burst2 || "");
            formData.append('burst3', data.burst3 || "");
            formData.append('burst4', data.burst4 || "");
            formData.append('notes', data.notes || "");
            formData.append('buyer_notes', data.buyer_notes || "");
            formData.append('effective', data.effective || "");
            formData.append('type_of_meat', data.type_of_meat || "");
            formData.append('quantity', data.quantity || "");
            formData.append('master_brand', data.master_brand || "");
            formData.append('type_of_cut', data.type_of_cut || "");
            formData.append('quality_cf', data.quality_cf || "");
            // Agregar la imagen
            if (data.image) formData.append('image', data.image[0]);


            const response = await fetch(`https://hiresprintcanvas.dreamhosters.com/createProduct`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setAddProduct([...addProduct, data]);
                setShowModal(true);
                toast.success("¡Producto creado exitosamente!");
                setPreviewUrl(null);
                reset();
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                toast.error(errorData?.message || `Error del servidor: ${response.status}`);
                throw new Error(errorData?.message || `Error del servidor: ${response.status}`);
            }

            const result = await response.json();

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

    const handleCreateCategory = async () => {
        if (!newCategory.trim()) {
            toast.error("El nombre de la categoría no puede estar vacío");
            return;
        }

        setIsCreatingCategory(true);
        try {
            const response = await fetch("https://hiresprintcanvas.dreamhosters.com/createCategory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name_category: newCategory
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCategories([...categories, data.result]);
                toast.success("Categoría creada exitosamente");
                setNewCategory("");
                setIsCreatingCategory(false);
            } else {
                throw new Error("Error al crear la categoría");
            }
        } catch (error) {
            toast.error("Error al crear la categoría");
            console.log(error)
            setIsCreatingCategory(false);
        }
    };

    return (
        <div className="flex p-2 bg-[#121212] h-screen">
            {showModal && addProduct && (
                <ProductAddedModal product={addProduct[addProduct.length - 1]} onClose={()=>setShowModal(false)} categories={categories}/>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl mx-auto">
                {/* Información básica del producto */}
                <div className="col-span-2 md:col-span-3 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                            <select
                                {...register("id_category", { required: true })}
                                className="w-full bg-gray-500 text-white p-2 rounded-md mb-2"
                            >
                                <option value=""> Select category</option>
                                {categories?.length > 0 && categories?.map((category: categoriesInterface) => (
                                    <option key={category?.id_category} value={category?.id_category}>
                                        {category?.name_category}
                                    </option>
                                ))}
                                <option value="create">+ Add new category</option>
                            </select>
                            {String(watch("id_category")) === "create" && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        placeholder="New category name"
                                        className="flex-1 bg-gray-500 text-white p-2 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        disabled={isCreatingCategory}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-800"
                                    >
                                        {isCreatingCategory ? (
                                            <span>Creating...</span>
                                        ) : (
                                            <span>Create</span>
                                        )}
                                    </button>
                                </div>
                            )}
                            {errors.id_category && <span className="text-red-500">This field is required</span>}
                        </div>
                        <input {...register("upc", { required: true })} placeholder="UPC" className="bg-gray-500 text-white p-2 rounded-md" />
                        {errors.upc && <span className="text-red-500">This field is required</span>}
                        <input {...register("master_brand")} placeholder="Master Brand" className="bg-gray-500 text-white p-2 rounded-md"/>

                        <input {...register("brand")} placeholder="Brand" className="bg-gray-500 text-white p-2 rounded-md"/>
                        {errors.brand && <span className="text-red-500">This field is required</span>}

                        <input {...register("desc", { required: true })} placeholder="Description" className="bg-gray-500 text-white p-2 rounded-md"/>
                        {errors.desc && <span className="text-red-500">This field is required </span>}

                    </div>
                </div>

                {/* Detalles del producto */}
                <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Details</h2>
                    <div className="space-y-4">
                    {(String(selectedCategory) === "5" || String(selectedCategory) === "16")
                            ? categoryFields[selectedCategory]?.map((field) => (
                                  <input
                                      key={field.name}
                                      {...register(field.name as keyof ProductTypes)}
                                      placeholder={field.placeholder}
                                      className="w-full bg-gray-500 text-white p-2 rounded-md"
                                  />
                              ))
                            : <>

                              <input {...register("size")} placeholder="Size" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
                              <input {...register("variety")} placeholder="Variety" className="w-full bg-gray-500 text-white p-2 rounded-md"/>
                              </>
                    }
                    </div>

                </div>

                {/* Imagen y categoría */}
                <div className="col-span-2 md:col-span-3 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Image </h2>
                    <div className="grid grid-cols-2 gap-4">

                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    {...register("image")}
                                    className="w-full bg-gray-500 text-white p-2 rounded-md"
                                    type="file"
                                    accept="image/*"
                                />
                                <ToastContainer 
                                    position="top-right"
                                    autoClose={3000}
                                    hideProgressBar={false}
                                    closeOnClick
                                    pauseOnHover
                                    theme="light"
                                />


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
