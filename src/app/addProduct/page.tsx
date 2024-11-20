'use client'
import { useEffect, useState, useRef } from "react"
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
    const [productsData, setProductsData] = useState<ProductTypes[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<ProductTypes[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const categoryFields: Record<string, { name: string, placeholder: string }[]> = {
        "5": [
            { name: "type_of_meat", placeholder: "Type of meat" },
            { name: "type_of_cut", placeholder: "Type OF cut" },
            { name: "quality_cf", placeholder: "Quality CF" },
            { name: "size", placeholder: "Size / Pack" },
            { name: "sku", placeholder: "SKU" },
        ],
        "16": [
            { name: "type_of_meat", placeholder: "Type of meat" },
            { name: "type_of_cut", placeholder: "Type OF cut" },
            { name: "quality_cf", placeholder: "Quality CF" },
            { name: "size", placeholder: "Size / Pack" },
            { name: "sku", placeholder: "SKU" },
        ]
    };
    const [selectedProduct, setSelectedProduct] = useState<ProductTypes | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getProduct");
                const data = await resp.json();
                setProductsData(data.result);
            } catch (error) {
                console.error("Error in get products:", error);
            }
        };
        getProductView();
    }, []);

    useEffect(() => {
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getCategories");
                const data = await resp.json();
                if (resp.status === 200) {
                    setCategories(data.result);
                }
            } catch (error) {
                console.error("Error in get categories:", error);
            }
        };

        getProductView();
    }, []);

    const onSubmit: SubmitHandler<ProductTypes> = async (data: ProductTypes) => {
        try {
            const existingProduct = productsData.find(
                product => product.upc === data.upc || product.sku === data.sku
            );
            console.log(existingProduct, "existingProduct");

            if (existingProduct) {
                toast.error("Ya existe un producto con el mismo UPC o SKU");
                return;
            }

            const formData = new FormData();

            // Campos básicos
            formData.append('name', data.name || "");
            formData.append('brand', data.brand || "");
            formData.append('upc', data.upc);
            formData.append('sku', data.sku || "");
            formData.append('price', '0');
            formData.append('sale_price', "0");
            formData.append('reg_price', '0');
            formData.append('unit_price', "0");
            formData.append('size', String(data.size) || "");
            formData.append('variety', data.variety ? JSON.stringify(data.variety) : "");
            formData.append('color', data.color || "");
            formData.append('conditions', data.conditions || "");
            formData.append('id_category', String(data.id_category));

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
                toast.success("¡Product created successfully!");
                setPreviewUrl(null);
                reset();
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                toast.error(errorData?.message || `Server error: ${response.status}`);
                throw new Error(errorData?.message || `Server error: ${response.status}`);
            }

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
            toast.error("The category name cannot be empty");
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
                toast.success("Category created successfully");
                setNewCategory("");
                setIsCreatingCategory(false);
            } else {
                throw new Error("Error in create category");
            }
        } catch (error) {
            toast.error("Error in create category");
            console.log(error)
            setIsCreatingCategory(false);
        }
    };



    const handleUpdateProduct = async (dataUpdate: ProductTypes) => {
        setIsUpdating(true);
        try {
            const formData = new FormData();

            // Verificar y agregar la imagen solo si existe
            if (dataUpdate?.image && dataUpdate.image.length > 0) {
                formData.append('image', dataUpdate.image[0]);
            } else {
                console.log(dataUpdate?.image, "no image",);
            }

            // Campos básicos con validación estricta
            formData.append('id_product', String(dataUpdate?.id_product || ''));
            formData.append('upc', dataUpdate?.upc || '');
            formData.append('desc', dataUpdate?.desc || '');
            formData.append('brand', dataUpdate?.brand || '');
            formData.append('variety', Array.isArray(dataUpdate?.variety) ? dataUpdate?.variety[0] : '');
            formData.append('master_brand', dataUpdate?.master_brand || '');
            formData.append('size', String(dataUpdate?.size || ''));
            formData.append('type_of_meat', dataUpdate?.type_of_meat || '');
            formData.append('type_of_cut', dataUpdate?.type_of_cut || '');
            formData.append('quality_cf', dataUpdate?.quality_cf || '');

            // Agregar logs para depuración
            console.log('FormData a enviar:', Object.fromEntries(formData.entries()));

            const response = await fetch(`https://hiresprintcanvas.dreamhosters.com/updateProduct`, {
                method: "POST",
                body: formData
            });

            // Verificar la respuesta del servidor
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error del servidor:', errorData);
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();

            // Actualizar UI solo si la respuesta es exitosa
            setProductsData(prevData =>
                prevData.map(prod =>
                    prod.id_product === dataUpdate.id_product ? { ...prod, ...dataUpdate } : prod
                )
            );

            toast.success("¡Producto actualizado exitosamente!");
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            setOpenSearch(false);
            formRef.current?.reset();
            setPreviewUrl(null);
            setEditPreviewUrl(null);

        } catch (error) {
            console.error('Error al actualizar producto:', error);
            toast.error("Error al actualizar el producto");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            toast.error("Please enter a search term");
            return;
        }

        setIsSearching(true);
        reset()
        try {
            // Filtra los productos que coincidan con el término de búsqueda
            const filtered = productsData.filter((product: ProductTypes) => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (product.desc?.toLowerCase().includes(searchLower)) ||
                    (product.master_brand?.toLowerCase().includes(searchLower)) ||
                    (product.brand?.toLowerCase().includes(searchLower)) ||
                    (String(product.upc).includes(searchTerm)) ||
                    (String(product.sku).includes(searchTerm))
                );
            });

            setSearchResults(filtered);
            setOpenSearch(true);

            if (filtered.length === 0) {
                toast.info("No se encontraron productos");
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            toast.error("Error al buscar productos");
        } finally {
            setIsSearching(false);
        }
    };

    const handleEditClick = (product: ProductTypes) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };


    // Componente Modal de Edición
    const EditProductModal = ({ product, onClose, onUpdate }: {
        product: ProductTypes,
        onClose: () => void,
        onUpdate: (product: ProductTypes) => void
    }) => {
        const [editedProduct, setEditedProduct] = useState(product);
        const [imageFileEdit, setImageFileEdit] = useState<File | null>(null);
        const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);


        useEffect(() => {
            if (imageFileEdit instanceof File) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setEditPreviewUrl(e.target?.result as string);
                    setEditedProduct(prev => ({ ...prev, image: [imageFileEdit] }));
                };
                reader.readAsDataURL(imageFileEdit);
            }
        }, [imageFileEdit]);

        console.log(imageFileEdit, "imageFileEdit");

        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setImageFileEdit(file);

                const reader = new FileReader();
                reader.onload = (e) => {
                    setEditPreviewUrl(e.target?.result as string);
                    setEditedProduct(prev => ({ ...prev, image: [file] }));
                };
                reader.readAsDataURL(file);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl text-white font-bold">Edit Product</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    <div className="col-span-2 flex justify-center">
                        {editedProduct.url_image && (
                            <img
                                src={editedProduct.url_image}
                                alt={editedProduct.desc}
                                className="h-48 object-contain"
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Solo mostrar campos con datos */}
                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.upc || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, upc: e.target.value })}
                            placeholder="UPC"
                        />
                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.sku || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, sku: e.target.value })}
                            placeholder="SKU"
                        />

                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.desc || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, desc: e.target.value })}
                            placeholder="Description"
                        />
                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.brand || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, brand: e.target.value })}
                            placeholder="Brand"
                        />
                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.variety || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, variety: [e.target.value] })}
                            placeholder="Variety"
                        />
                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.master_brand || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, master_brand: e.target.value })}
                            placeholder="Master Brand"
                        />
                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.type_of_cut || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, type_of_cut: e.target.value })}
                            placeholder="Type of cut"
                        />
                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.quality_cf || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, quality_cf: e.target.value })}
                            placeholder="Quality CF"
                        />
                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.type_of_meat || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, type_of_meat: e.target.value })}
                            placeholder="Type of meat"
                        />
                        <input
                            className="bg-gray-700 text-white p-2 rounded"
                            value={editedProduct.size || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, size: e.target.value })}
                            placeholder="Size"
                        />

                        {/* Mantener la sección de imagen */}
                        <div className="flex-1">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                id="imageInputUpdate"
                                onChange={handleImageChange}
                            />
                            {editPreviewUrl ? (
                                <div className="cursor-pointer" onClick={() => document.getElementById('imageInputUpdate')?.click()}>
                                    <img
                                        src={editPreviewUrl}
                                        alt="Vista previa"
                                        className="w-full h-64 object-contain rounded-md hover:opacity-80 transition-opacity"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
                                    onClick={() => document.getElementById('imageInputUpdate')?.click()}
                                >
                                    <span className="text-gray-400 p-4">Agregar nueva imagen</span>
                                </div>
                            )}
                        </div>

                        <div className="col-span-2 flex justify-end gap-2 mt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onUpdate(editedProduct)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex p-2 bg-[#121212] h-screen">
            {showModal && addProduct && (
                <ProductAddedModal product={addProduct[addProduct.length - 1]} onClose={() => setShowModal(false)} categories={categories} />
            )}

            <form
                ref={formRef}
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl mx-auto"
            >
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
                        <input {...register("master_brand")} placeholder="Master Brand" className="bg-gray-500 text-white p-2 rounded-md" />

                        <input {...register("brand")} placeholder="Brand" className="bg-gray-500 text-white p-2 rounded-md" />
                        {errors.brand && <span className="text-red-500">This field is required</span>}

                        <input {...register("desc", { required: true })} placeholder="Description" className="bg-gray-500 text-white p-2 rounded-md" />
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
                                <input {...register("size")} placeholder="Size" className="w-full bg-gray-500 text-white p-2 rounded-md" />
                                <input {...register("variety")} placeholder="Variety" className="w-full bg-gray-500 text-white p-2 rounded-md" />

                            </>
                        }
                    </div>
                </div>

                <div className="col-span-2 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Search Products</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border rounded text-black flex-1"
                        />
                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isSearching ? "Searching..." : "Search"}
                        </button>
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
                                    className="hidden"
                                    type="file"
                                    accept="image/*"
                                    id="imageInput"
                                />
                                {previewUrl ? (
                                    <div className="cursor-pointer" onClick={() => document.getElementById('imageInput')?.click()}>
                                        <img
                                            src={previewUrl}
                                            alt="Vista previa"
                                            className="w-full h-64 object-contain rounded-md hover:opacity-80 transition-opacity"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="w-full h-64 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
                                        onClick={() => document.getElementById('imageInput')?.click()}
                                    >
                                        <span className="text-gray-400">Click to add an image</span>
                                    </div>
                                )}
                            </div>
                            <ToastContainer
                                position="top-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                closeOnClick
                                pauseOnHover
                                theme="light"
                            />
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

            {/* Resultados de búsqueda */}
            {openSearch && (
                <div className="col-span-1 md:col-span-1 bg-gray-800 p-4 rounded-lg mt-4">
                    <h2 className="text-white text-xl mb-4">Resultados de Búsqueda</h2>

                    {searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {searchResults.map((product) => (
                                <div key={product.id_product} className="bg-gray-700 p-4 rounded-lg">
                                    <div className="relative">
                                        {product.url_image && (
                                            <img
                                                src={product.url_image}
                                                alt={product.desc || ""}
                                                className="w-full h-48 object-contain rounded"
                                            />
                                        )}
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                        >
                                            Editar Producto
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-300 text-center">
                            No se encontraron productos que coincidan con la búsqueda
                        </p>
                    )}
                </div>
            )}

            {isEditModalOpen && selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    onUpdate={handleUpdateProduct}
                />
            )}
        </div>
    )
}

export default AddProductPage
