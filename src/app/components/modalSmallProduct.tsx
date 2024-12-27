import Image from "next/image";
import { categoriesInterface } from "@/types/category";
import { ProductTypes } from "@/types/product";
import { useEffect, useState, useCallback } from "react";
import { disableProduct } from "@/pages/api/apiMongo/disableProduct";

interface ModalSmallProductProps {
    product: ProductTypes;
    onClose: () => void;
    onUpdate: (product: ProductTypes) => void;
    categories: categoriesInterface[];
    matchCategory: (categories: categoriesInterface[], idCategory: number) => categoriesInterface;
    isUpdating: boolean;
}

const ModalSmallProduct = ({product, onClose, onUpdate, categories, matchCategory, isUpdating}: ModalSmallProductProps) => {

    const [editedProduct, setEditedProduct] = useState(product);
    const [imageFileEdit, setImageFileEdit] = useState<File | null>(null);
    const [activeField, setActiveField] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<{[key: string]: string[]}>({});
    const [showSuggestions, setShowSuggestions] = useState<{[key: string]: boolean}>({});
    const [productsData, setProductsData] = useState<ProductTypes[]>([]);
    const [reloadFlag, setReloadFlag] = useState(true);
    const [openProductModalTable, setOpenProductModalTable] = useState<boolean>(false);
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);


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
        if (imageFileEdit instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditPreviewUrl(e.target?.result as string);
                setEditedProduct(prev => ({ ...prev, image: [imageFileEdit] }));
            };
            reader.readAsDataURL(imageFileEdit);
        }
    }, [imageFileEdit]);


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

    const getUniqueValues = (fieldName: keyof ProductTypes) => {
        const values = productsData
            .map(p => p[fieldName])
            .filter((value): value is string => 
                typeof value === 'string' && value.length > 0
            );
        return Array.from(new Set(values));
    };

    const handleInputChange = (fieldName: keyof ProductTypes, value: string) => {
        setEditedProduct({ ...editedProduct, [fieldName]: value });
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

    const handleSuggestionClick = (fieldName: keyof ProductTypes, value: string) => {
        setEditedProduct({ ...editedProduct, [fieldName]: value });
        setShowSuggestions({ ...showSuggestions, [fieldName]: false });
    };

    const handleDisable = async (idProduct: number) => {
        const body = {
            "id_product": idProduct
        }
        const resp = await disableProduct(body)
        onClose()
    }

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFileEdit(file);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="sticky -top-6 bg-gray-800 z-10 pb-4 border-b border-gray-700 h-16 ">
                <div className="flex items-center justify-between py-4">
                    <div className={"flex flex-row"}>
                        <h2 className="text-xl text-white font-bold text-center">Edit Product</h2>
                        <div className={`px-4 py-2 bg-gray-600 text-white rounded`}>{product?.status_active ? "Active" : "Disable"}</div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>
            </div>

            {/* Nueva estructura con grid */}
            <div className="grid grid-cols-[1fr,1fr] ">
                {/* Columna izquierda para la imagen */}
                <div className="relative group">
                    {product?.url_image && (
                        <div className="sticky top-32">
                            <Image
                                src={product?.url_image || ''}
                                alt={product?.desc || ''}
                                className=" object-contain cursor-zoom-in transition-transform hover:scale-105 flex justify-center items-center"
                                width={600}
                                height={600}
                                onClick={() => window.open(product?.url_image, '_blank')}
                            />

                        </div>
                    )}
                </div>

                {/* Columna derecha para los campos */}
                <div className="grid grid-cols-2 gap-1 content-start mt-4 space-x-2">
                    {/* Campos existentes */}
                    <div style={inputContainerStyle}>
                        <label htmlFor="upc" style={labelStyle}>UPC</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.upc || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, upc: e.target.value })}
                            placeholder="UPC"
                        />
                    </div>
                    <div style={inputContainerStyle} className="relative">
                        <label htmlFor="master_brand" style={labelStyle}>Master Brand</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.master_brand || ''}
                            onChange={e => handleInputChange('master_brand', e.target.value)}
                            onFocus={() => setActiveField('master_brand')}
                            onBlur={() => setTimeout(() => setActiveField(null), 100)}
                            placeholder="Master Brand"
                        />
                        {showSuggestions['master_brand'] && suggestions['master_brand']?.length > 0 && activeField === 'master_brand' && (
                            <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                {suggestions['master_brand'].map((suggestion, index) => (
                                    <div 
                                        key={index}
                                        className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                        onClick={() => handleSuggestionClick('master_brand', suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={inputContainerStyle} className="relative">
                        <label htmlFor="brand" style={labelStyle}>Brand</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.brand || ''}
                            onChange={e => handleInputChange('brand', e.target.value)}
                            onFocus={() => setActiveField('brand')}
                            onBlur={() => setTimeout(() => setActiveField(null), 100)}
                            placeholder="Brand"
                        />
                        {showSuggestions['brand'] && suggestions['brand']?.length > 0 && activeField === 'brand' && (
                            <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                {suggestions['brand'].map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                        onClick={() => handleSuggestionClick('brand', suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="desc" style={labelStyle}>Description</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.desc || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, desc: e.target.value })}
                            onFocus={() => setActiveField('desc')}
                            onBlur={() => setTimeout(() => setActiveField(null), 100)}
                            placeholder="Description"
                        />
                        {showSuggestions['desc'] && suggestions['desc']?.length > 0 && activeField === 'desc' && (
                            <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                {suggestions['desc'].map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                        onClick={() => handleSuggestionClick('desc', suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="variety" style={labelStyle}>Variety</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.variety || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, variety: [e.target.value] })}
                            onFocus={() => setActiveField('variety')}
                            onBlur={() => setTimeout(() => setActiveField(null), 100)}
                            placeholder="Variety"
                        />
                        {showSuggestions['variety'] && suggestions['variety']?.length > 0 && activeField === 'variety' && (
                            <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                {suggestions['variety'].map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                        onClick={() => handleSuggestionClick('variety', suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="size" style={labelStyle}>Size</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.size || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, size: [e.target.value] })}
                            placeholder="Size"
                        />
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="pack" style={labelStyle}>Pack</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.pack || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, pack: Number(e.target.value) })}
                            placeholder="Pack"
                        />
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="count" style={labelStyle}>Count</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.count || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, count: Number(e.target.value) })}
                            placeholder="Count"
                        />
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="w_simbol" style={labelStyle}>Weight Simbol</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.w_simbol || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, w_simbol: e.target.value })}
                            onFocus={() => setActiveField('w_simbol')}
                            onBlur={() => setTimeout(() => setActiveField(null), 100)}
                            placeholder="Weight Simbol"
                        />
                        {showSuggestions['w_simbol'] && suggestions['w_simbol']?.length > 0 && activeField === 'w_simbol' && (
                            <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                {suggestions['w_simbol'].map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                        onClick={() => handleSuggestionClick('w_simbol', suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="embase" style={labelStyle}>Embase</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.embase || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, embase: e.target.value })}
                            onFocus={() => setActiveField('embase')}
                            onBlur={() => setTimeout(() => setActiveField(null), 100)}
                            placeholder="Embase"
                        />
                        {showSuggestions['embase'] && suggestions['embase']?.length > 0 && activeField === 'embase' && (
                            <div className="absolute top-20 z-50 w-full bg-gray-700 border border-gray-600 rounded-b max-h-40 overflow-y-auto">
                                {suggestions['embase'].map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                        onClick={() => handleSuggestionClick('embase', suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="id_category" style={labelStyle}>Category</label>
                        <select
                            name="selectCategory"
                            id="selectCategory"
                            className=" bg-gray-700 text-gray-200 rounded-lg w-full h-10 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={e => setEditedProduct({ ...product, id_category: Number(e.target.value) })}
                        >
                            <option value="" disabled selected>
                                {matchCategory(categories, product?.id_category)?.name_category}
                            </option>
                            {categories.map((cat: categoriesInterface) => (
                                <option key={cat.id_category} value={cat.id_category}>
                                    {cat.name_category}
                                </option>
                            ))}
                        </select>
                    </div>
                    {product?.id_category === 5 || product?.id_category === 16
                    ? (
                        <>
                            <div style={inputContainerStyle}>
                                <label htmlFor="type_of_meat" style={labelStyle}>Type of Meat</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.type_of_meat || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, type_of_meat: e.target.value })}
                            placeholder="Type of Meat"
                        />
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="type_of_cut" style={labelStyle}>Type of Cut</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.type_of_cut || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, type_of_cut: e.target.value })}
                            placeholder="Type of Cut"
                        />
                    </div>
                    <div style={inputContainerStyle}>
                        <label htmlFor="quality_cf" style={labelStyle}>Quality Certified</label>
                        <input
                            className="bg-gray-700 text-white p-2 rounded w-full"
                            value={editedProduct?.quality_cf || ''}
                            onChange={e => setEditedProduct({ ...editedProduct, quality_cf: e.target.value })}
                            placeholder="Quality CF"
                        />
                            </div>
                        </>
                    ) : (
                        <></>
                    )}

                    <div className="col-span-2">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            id="imageInputUpdate"
                            onChange={handleImageChange}
                        />
                        {editPreviewUrl ? (
                            <div 
                                className="cursor-pointer" 
                                onClick={() => document.getElementById('imageInputUpdate')?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <img
                                    src={editPreviewUrl}
                                    alt="Vista previa"
                                    className="w-full h-32 object-contain rounded-md hover:opacity-80 transition-opacity"
                                />
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors h-32"
                                onClick={() => document.getElementById('imageInputUpdate')?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <div className="text-center">
                                    <span className="text-gray-400 block">Drag and drop or</span>
                                    <span className="text-blue-500">click to select</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="col-span-2 flex justify-end gap-2 mt-4">
                    <div className="flex space-x-2 ">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="verified"
                                className="w-5 h-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                                checked={editedProduct?.verify || false}
                                onChange={e => {
                                    const newValue = e.target.checked;
                                    setEditedProduct(prev => ({ ...prev, verify: newValue }));
                                }}
                            />
                        <label htmlFor="verified" style={labelStyle}>Verified</label>
                        </div>
                    </div>
                        <button
                            onClick={() => handleDisable(Number(product?.id_product))}
                            className="px-4 text-bold text-red-500 border border-gray-800 hover:border-red-500 rounded-lg"
                        >
                            Disable
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => onUpdate(editedProduct)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Actualizando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default ModalSmallProduct;