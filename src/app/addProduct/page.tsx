'use client'
import { useEffect, useState, useRef, use } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { ProductTypes } from "@/types/product"
import { categoriesInterface } from "@/types/category"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ProductAddedModal } from "../components/card"
import { useAuth } from "../components/provider/authprovider"
import EditableProductTable from '@/app/components/EditableProductTable';
import ModalSmallProduct from "../components/modalSmallProduct"

const matchCategory = (categories: categoriesInterface[], id_category: number): categoriesInterface => {
    return categories.find(cat => cat.id_category === id_category) || categories[0];
};

const AddProductPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue
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
    const [reloadFlag, setReloadFlag] = useState(true);
    const { user } = useAuth();
    const [generatedSKU, setGeneratedSKU] = useState<string>("");
    const categoryFields: Record<string, { name: string, placeholder: string }[]> = {
        "5": [
            { name: "type_of_meat", placeholder: "Type of meat" },
            { name: "type_of_cut", placeholder: "Type OF cut" },
            { name: "quality_cf", placeholder: "Quality CF" },
            { name: "size", placeholder: "Size" },
            { name: "pack", placeholder: "Pack" },
            { name: "count", placeholder: "Count" },
            { name: "w_simbol", placeholder: "Weight Simbol" },
            { name: "emabase", placeholder: "Emabase" },
        ],
        "16": [
            { name: "type_of_meat", placeholder: "Type of meat" },
            { name: "type_of_cut", placeholder: "Type OF cut" },
            { name: "quality_cf", placeholder: "Quality CF" },
            { name: "size", placeholder: "Size" },
            { name: "pack", placeholder: "Pack" },
            { name: "count", placeholder: "Count" },
            { name: "w_simbol", placeholder: "Weight Simbol" },
            { name: "emabase", placeholder: "Emabase" },
        ]
    };
    const [selectedProduct, setSelectedProduct] = useState<ProductTypes | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

    const [openProductModalTable, setOpenProductModalTable] = useState<boolean>(false);

    const [suggestions, setSuggestions] = useState<{[key: string]: string[]}>({});
    const [showSuggestions, setShowSuggestions] = useState<{[key: string]: boolean}>({});
    const [activeField, setActiveField] = useState<string | null>(null);
    
    const getUniqueValues = (fieldName: keyof ProductTypes) => {
        const values = productsData
            .map(p => p[fieldName])
            .filter((value): value is string => 
                typeof value === 'string' && value.length > 0
            );
        return Array.from(new Set(values));
    };

    const handleInputChangeMain = (fieldName: keyof ProductTypes, value: string) => {
        setValue(fieldName, value);
        setActiveField(fieldName);
        if (value.length > 0) {
            const uniqueValues = getUniqueValues(fieldName);
            const filtered = uniqueValues.filter(item => 
                item.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions({ ...suggestions, [fieldName]: filtered });
            setShowSuggestions({ ...showSuggestions, [fieldName]: true });
        } else {
            setShowSuggestions({ ...showSuggestions, [fieldName]: false });
        }
    };

    // Seleccionar una sugerencia
    const handleSugestionMain = (fieldName: keyof ProductTypes, value: string) => {
        setValue(fieldName, value);
        setShowSuggestions({ ...showSuggestions, [fieldName]: false });
    };

    useEffect(() => {
        if (reloadFlag || !openProductModalTable) {
            const getProductView = async () => {
                try {
                    const resp = await fetch("/api/apiMongo/getProduct");
                    const data = await resp.json();
                    setProductsData(data.result);
                } catch (error) {
                    console.error("Error in get [id_circular]:", error);
                }
            };
            getProductView().finally(()=>setReloadFlag(false));
        }
    }, [reloadFlag,openProductModalTable]);

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
                product => product.upc === data.upc
            );

            if (existingProduct) {
                toast.error("Ya existe un producto con el mismo UPC");
                return;
            }


            const formData = new FormData();

            // Campos básicos
            formData.append('name', data.desc || "");
            formData.append('brand', data.brand || "");
            formData.append('upc', data.upc);
            formData.append('price', '0');
            formData.append('size', String(data.size) || "");
            formData.append('variety', data.variety ? JSON.stringify(data.variety) : "");
            formData.append('id_category', String(data.id_category));
            formData.append('pack', String(data.pack) || "");
            formData.append('count', String(data.count) || "");
            formData.append('w_simbol', data.w_simbol || "");
            formData.append('embase', data.embase || "");

            // Campos adicionales
            formData.append('desc', data.desc || "");
            formData.append('addl', data.addl || "");
            formData.append('burst', (data.burst || 0).toString());
            formData.append('notes', data.notes || "");
            formData.append('type_of_meat', data.type_of_meat || "");
            formData.append('quantity', data.quantity || "");
            formData.append('master_brand', data.master_brand || "");
            formData.append('type_of_cut', data.type_of_cut || "");
            formData.append('quality_cf', data.quality_cf || "");
            formData.append('createdById', user?.userData?.id_client || 0);
            formData.append('plu', data.plu || "");
            // Agregar la imagen
            if (data.image) formData.append('image', data.image[0]);

            const response = await fetch(`https://hiresprintcanvas.dreamhosters.com/createProduct`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const dataResponse = await response.json();
                setProductsData(prevData => [...prevData, { ...data, id_product: dataResponse.id_product }]);
                setAddProduct([...addProduct, data]);
                setShowModal(true);
                toast.success("¡Product created successfully!");
                setPreviewUrl(null);
                setReloadFlag(true)
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
            formData.append('id_category', String(dataUpdate?.id_category || ''));
            formData.append('pack', String(dataUpdate?.pack || 0));
            formData.append('count', String(dataUpdate?.count || 0));
            formData.append('w_simbol', dataUpdate?.w_simbol || "");
            formData.append('embase', dataUpdate?.embase || "");
            formData.append('verify', dataUpdate?.verify ? 'true' : 'false');
            // Agregar logs para depuración

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

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            return;
        }
        
        if (!productsData?.length) {
            return;
        }

        setIsSearching(true);
        reset();
        try {
            const filteredProducts = productsData.filter((product: ProductTypes) =>
                Object.values(product).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setSearchResults(filteredProducts);
            setOpenSearch(true);
        } catch (error) {
            console.error("Error searching products:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleEditClick = (product: ProductTypes) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    // Agregar esta nueva función para generar SKU
    const generateSKU = () => {
        const generateRandomDigits = () => {
            // Generar 8 dígitos aleatorios
            let digits = '';
            for (let i = 0; i < 8; i++) {
                digits += Math.floor(Math.random() * 10);
            }
            return digits;
        };

        // Verificar si el SKU ya existe
        const newSKU = `SKU${generateRandomDigits()}`;
        const skuExists = productsData.some(product => product.upc === newSKU);

        // Si existe, generar otro
        if (skuExists) {
            return generateSKU();
        }

        return newSKU;
    };

    

    const inputContainerStyle = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '0.5rem',
        marginBottom: '1rem'
    };

    const labelStyle = {
        color: 'white',
        fontSize: '0.875rem'
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchTerm, productsData]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('border-blue-500');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('border-blue-500');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('border-blue-500');

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const input = document.getElementById('imageInput') as HTMLInputElement;
                if (input) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    input.files = dataTransfer.files;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else {
                toast.error("Por favor, arrastra solo archivos de imagen");
            }
        }
    };

    return (
        <div className="flex p-2 bg-[#121212] h-screen overflow-y-auto no-scrollbar ">
            {showModal && addProduct && (
                <ProductAddedModal product={addProduct[addProduct.length - 1]} onClose={() => setShowModal(false)} categories={categories} />
            )}

            <form
                ref={formRef}
                onSubmit={handleSubmit(onSubmit)}
                className={`grid grid-cols-1 md:grid-cols-1 gap-2 w-full max-w-4xl  ${openSearch ? "ml-28" : "mx-auto"}`}
            >
                {/* Información básica del producto */}
                <div className="col-span-2 md:col-span-3 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div style={inputContainerStyle}>
                                <label htmlFor="id_category" style={labelStyle}>Category</label>
                                <select
                                    {...register("id_category", { required: true })}
                                    className="w-full bg-gray-500 text-white p-2 rounded-md"
                                >
                                    <option value=""> Select category</option>
                                    {categories?.length > 0 && categories?.map((category: categoriesInterface) => (
                                        <option key={category?.id_category} value={category?.id_category}>
                                            {category?.name_category}
                                        </option>
                                    ))}
                                    <option value="create">+ Add new category</option>
                                </select>
                            </div>
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

                        <div style={inputContainerStyle}>
                            <label htmlFor="upc" style={labelStyle}>UPC</label>
                            <input {...register("upc", { required: true })}
                                className="bg-gray-500 text-white p-2 rounded-md" />
                        </div>
                        

                        <div style={inputContainerStyle} className="relative">
                            <label htmlFor="master_brand" style={labelStyle}>Master Brand</label>
                            <input {...register("master_brand")}
                                className="bg-gray-500 text-white p-2 rounded-md" 
                                onChange={(e) => handleInputChangeMain('master_brand', e.target.value)}
                                onFocus={() => setActiveField('master_brand')}
                                onBlur={() => setTimeout(() => setActiveField(null), 100)}
                                />
                                      {showSuggestions['master_brand'] && suggestions['master_brand']?.length > 0 && 
                                      activeField === 'master_brand' && (
                                    <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                        {suggestions['master_brand'].map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                                onClick={() => handleSugestionMain('master_brand', suggestion)}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>

                        <div style={inputContainerStyle} className="relative">
                            <label htmlFor="brand" style={labelStyle}>Brand</label>
                            <input {...register("brand")}
                                className="bg-gray-500 text-white p-2 rounded-md" 
                                onChange={(e) => handleInputChangeMain('brand', e.target.value)}
                                onFocus={() => setActiveField('brand')}
                                onBlur={() => setTimeout(() => setActiveField(null), 100)}
                                />
                                    {showSuggestions['brand'] && suggestions['brand']?.length > 0 && 
                                    activeField === 'brand' && (
                                    <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                        {suggestions['brand'].map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                                onClick={() => handleSugestionMain('brand', suggestion)}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}


                        </div>

                        <div style={inputContainerStyle} className="relative">
                            <label htmlFor="desc" style={labelStyle}>Description</label>
                            <input {...register("desc", { required: true })}
                                className="bg-gray-500 text-white p-2 rounded-md" 
                                onChange={(e) => handleInputChangeMain('desc', e.target.value)}
                                onFocus={() => setActiveField('desc')}
                                onBlur={() => setTimeout(() => setActiveField(null), 100)}
                                />
                                    {showSuggestions['desc'] && suggestions['desc']?.length > 0 && 
                                    activeField === 'desc' && (
                                    <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                        {suggestions['desc'].map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                                onClick={() => handleSugestionMain('desc', suggestion)}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                        <div style={inputContainerStyle}>
                            <label htmlFor="plu" style={labelStyle}>PLU</label>
                            <input {...register("plu")}
                                className="bg-gray-500 text-white p-2 rounded-md" />
                        </div>
                    </div>
                </div>

                {/* Detalles del producto */}
                <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Details</h2>
                    <div className="space-y-4 ">
                        {(String(selectedCategory) === "5" || String(selectedCategory) === "16")
                            ? (
                                <div className="grid grid-cols-2 gap-4">
                                {categoryFields[selectedCategory]?.map((field) => (
                                    <div key={field.name}>
                                        <input
                                            {...register(field.name as keyof ProductTypes)}
                                            placeholder={field.placeholder}
                                            className="w-full bg-gray-500 text-white p-2 rounded-md"
                                        />
                                    </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div style={inputContainerStyle}>
                                            <label htmlFor="size" style={labelStyle}>Size</label>
                                            <input {...register("size")} className="w-full bg-gray-500 text-white p-2 rounded-md" />
                                        </div>
                                        <div style={inputContainerStyle} className="relative">
                                            <label htmlFor="variety" style={labelStyle}>Variety</label>
                                            <input {...register("variety")} className="w-full bg-gray-500 text-white p-2 rounded-md" 
                                            onChange={(e) => handleInputChangeMain('variety', e.target.value)}
                                            onFocus={() => setActiveField('variety')}
                                            onBlur={() => setTimeout(() => setActiveField(null), 100)}
                                            />
                                            {showSuggestions['variety'] && suggestions['variety']?.length > 0 && 
                                            activeField === 'variety' && (
                                                <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                                    {suggestions['variety'].map((suggestion, index) => (
                                                        <div key={index} className="p-2 hover:bg-gray-600 cursor-pointer text-white" onClick={() => handleSugestionMain('variety', suggestion)}>{suggestion}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div style={inputContainerStyle}>
                                            <label htmlFor="pack" style={labelStyle}>Pack</label>
                                            <input {...register("pack")} className="w-full bg-gray-500 text-white p-2 rounded-md" />
                                        </div>
                                        <div style={inputContainerStyle}>
                                            <label htmlFor="count" style={labelStyle}>Count</label>
                                            <input {...register("count")} className="w-full bg-gray-500 text-white p-2 rounded-md" />
                                        </div>
                                        <div style={inputContainerStyle} className="relative">
                                            <label htmlFor="w_simbol" style={labelStyle}>Weight Simbol</label>
                                            <input {...register("w_simbol")} className="w-full bg-gray-500 text-white p-2 rounded-md" 
                                            onChange={(e) => handleInputChangeMain('w_simbol', e.target.value)}
                                            onFocus={() => setActiveField('w_simbol')}
                                            onBlur={() => setTimeout(() => setActiveField(null), 100)}
                                            />
                                            {showSuggestions['w_simbol'] && suggestions['w_simbol']?.length > 0 && 
                                            activeField === 'w_simbol' && (
                                                <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                                    {suggestions['w_simbol'].map((suggestion, index) => (
                                                        <div key={index} className="p-2 hover:bg-gray-600 cursor-pointer text-white" onClick={() => handleSugestionMain('w_simbol', suggestion)}>{suggestion}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div style={inputContainerStyle} className="relative">
                                            <label htmlFor="embase" style={labelStyle}>Embase</label>
                                            <input {...register("embase")} className="w-full bg-gray-500 text-white p-2 rounded-md" 
                                            onChange={(e) => handleInputChangeMain('embase', e.target.value)}
                                            onFocus={() => setActiveField('embase')}
                                            onBlur={() => setTimeout(() => setActiveField(null), 100)}
                                            />
                                            {showSuggestions['embase'] && suggestions['embase']?.length > 0 && 
                                            activeField === 'embase' && (
                                                <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                                    {suggestions['embase'].map((suggestion, index) => (
                                                        <div key={index} className="p-2 hover:bg-gray-600 cursor-pointer text-white" onClick={() => handleSugestionMain('embase', suggestion)}>{suggestion}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
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
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                    <div className=" bg-gray-800  rounded-lg mt-4">
                        <h2 className="text-white text-xl mb-4">SKU Generator</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={generatedSKU}
                                readOnly
                                placeholder="SKU generado"
                                className="p-2 border rounded text-black flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newSKU = generateSKU();
                                    setGeneratedSKU(newSKU);
                                    setValue('upc', newSKU);
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Generate SKU
                            </button>
                        </div>
                    </div>
                    <div className=" w-full bg-gray-800  rounded-lg mt-4  ">
                        <h2 className="text-white text-xl text-center mb-4">Edit All Product</h2>
                        <div className="flex w-full justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => setOpenProductModalTable(true)}
                                className="bg-green-500 text-white px-8 py-2 rounded-md hover:bg-green-600"
                            >
                                Open Modal
                            </button>
                        </div>
                    </div>
                </div>
                {/* Imagen y categoría */}
                <div className="col-span-2 md:col-span-3 bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white text-xl mb-4">Image </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    {...register('image')}
                                    className="hidden"
                                    type="file"
                                    accept="image/*"
                                    id="imageInput"
                                />
                                {previewUrl ? (
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => document.getElementById('imageInput')?.click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <img
                                            src={previewUrl}
                                            alt="Vista previa"
                                            className="w-full h-64 object-contain rounded-md hover:opacity-80 transition-opacity"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="w-full h-64 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
                                        onClick={() => document.getElementById('imageInput')?.click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <svg
                                            className="w-8 h-8 mb-2 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        <span className="text-gray-400">Drag an image here or click to select</span>
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
                <div className="h-32 mb-10">
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
                </div>
            </form>

            {/* Resultados de búsqueda */}
            {openSearch  && (
                <div className="fixed col-span-1 md:col-span-1 bg-gray-800 p-4 rounded-lg mt-4 overflow-y-scroll no-scrollbar h-screen right-0 pb-28 w-80">
                    <h2 className=" text-white text-xl mb-4">{"Search Results " + searchResults.length + " products"}</h2>
                    <button onClick={() => setOpenSearch(false)} className="fixed right-4 top-[15vh]  bg-red-500 text-white p-2 rounded-md z-50">Close</button>

                    {searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {searchResults.map((product) => (
                                <div key={product.id_product} className="bg-gray-700 p-4 rounded-lg">
                                    <div className="relative">
                                        {product.url_image && (
                                            <div className="flex flex-col justify-center items-center">
                                                <p className="text-white text-center">{product.desc}</p>
                                                <img
                                                    src={product.url_image}
                                                    alt={product.desc || ""}
                                                    className="w-full h-32 object-contain rounded"
                                                />
                                            </div>
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
                            No products found that match the search
                        </p>
                    )}
                </div>
            )}

            {isEditModalOpen && selectedProduct && (
                <ModalSmallProduct
                    product={selectedProduct}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    onUpdate={handleUpdateProduct}
                    categories={categories}
                    matchCategory={matchCategory}
                    isUpdating={isUpdating}
                />
            )}
            {openProductModalTable && Array.isArray(productsData) && productsData.length > 0 && (
                <EditableProductTable 
                    products={productsData} 
                    openModal={openProductModalTable} 
                    categories={categories} 
                    closeModal={setOpenProductModalTable} 
                    reloadData={setReloadFlag} 
                />
            )}
            {
                openProductModalTable === true && productsData.length <= 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-100 p-5">
                        <div className="flex items-center justify-center h-screen">
                            <div
                                className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    </div>
                )
            }
            {
                openProductModalTable === false && reloadFlag === true && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-100 p-5">
                        <div className="flex items-center justify-center h-screen">
                            <div
                                className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default AddProductPage
