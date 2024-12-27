import React, { useContext, useEffect, useState, useRef } from "react";
import { ProductTypes } from "@/types/product";
import Image from "next/image";
import { Burst1, Burst2, Burst3, ChangeIcon, DeleteIcon, SaveIcon, CopyIcon } from "../icons";
import { useProductContext } from "@/app/context/productContext";
interface ModalEditProductInterface {
    product: ProductTypes;
    GridID?: number
    CopyFC: (product: ProductTypes) => void,
    ChangeFC: (idGrid: number | undefined) => void,
    DeleteFC: (idGrid: number | undefined) => void,
    SaveFC?: (
        idGrid: number | undefined,
        priceValue: string,
        noteUser: string,
        burst: number,
        addl: string,
        limit: string,
        mustBuy: string,
        withCard: boolean,
        limit_type: string,
        per: string,
        variety: string[],
        size: string[],
    ) => void,
    setIsOpen: (isOpen: boolean) => void
}

interface burstType {
    value: number,
    text: string,
}
const ModalEditProduct = ({ product, GridID, ChangeFC, DeleteFC, SaveFC, CopyFC, setIsOpen }: ModalEditProductInterface) => {

    const { groupedProducts, isLoadingGridProducts } = useProductContext();
   // const [categories, setCategories] = useState<[]>()
   // const [categoria, setCategoria] = useState<categoriesInterface>()
    const per = ["Ea", "Lb", "POUND", "HEAD", "BUNCH", "BAG", "PKG", "PK"]
    const [price, setPrice] = useState<string>(product?.price);
    const [burst, setBurst] = useState<number | 0>(product?.burst ?? 0)
    const [addl, setAddl] = useState(product?.addl ?? "")
    const [limit, setLimit] = useState(product?.limit ?? "")
    const [mustBuy, setMustBuy] = useState(product?.must_buy ?? "")
    const [withCard, setWithCard] = useState(product?.with_card ?? false)
    const [limit_type, setLimitType] = useState(product?.limit_type || '')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [notes, setNotes] = useState(product?.notes && product.notes !== 'undefined' ? product.notes : "")
    const [showVarietyList, setShowVarietyList] = useState(false);
    //dropdown burst
    const [openDropdown, setOpenDropdown] = useState(false)
    const [burstOption, setBurstOption] = useState<burstType[] | []>([])
    const [selectedBurst, setSelectedBurst] = useState<burstType | null>(null)
    const [selectedPer, setSelectedPer] = useState<string>(per[0]);
    const [varietyType, setVarietyType] = useState<'Selected' | 'Assorted' | null>(() => {
        if (product.variety_set?.includes('Selected Varieties')) {
            return 'Selected';
        } else if (product.variety_set?.includes('Assorted Varieties')) {
            return 'Assorted';
        }
        return null;
    });
    const [size, setSize] = useState<string[]>(Array.isArray(product.size) ? product.size : [product.size || '']);
    const [variety, setVariety] = useState<string[]>(Array.isArray(product.variety_set) && product.variety_set[0] ? product.variety_set : product.variety || []);
    const varietyListRef = useRef<HTMLDivElement>(null);
    const burstDropdownRef = useRef<HTMLDivElement>(null);

 console.log(product.id_grid,'aaaaaaa')

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (varietyListRef.current &&
                !varietyListRef.current.contains(event.target as Node) &&
                showVarietyList) {
                setShowVarietyList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showVarietyList]);

    useEffect(() => {
        setBurstOption([{ value: 1, text: "Mix & Match" }, { value: 2, text: "1/2 Price" }, { value: 3, text: "Your Choice" }])
    }, []);


    useEffect(() => {
        if (GridID && groupedProducts[GridID]) {
            console.log(product.variety_set.length, 'tamaño de variety', product.variety_set);
            if (varietyType) {
                setVariety([varietyType === 'Selected' ? 'Selected Varieties' : 'Assorted Varieties']);
            } else if (product.variety_set && product.variety_set.length > 0 && product.variety_set[0]) {
                setVariety(product.variety_set);
            } else {
                if (variety.length === 0 && groupedProducts[GridID][0]) {
                    const mainVariety =
                        groupedProducts[GridID][0]?.variety?.[0]?.trim().replace(/['"]+/g, '') || '';
                    setVariety([mainVariety]);
                } else {
                    const allVarieties = groupedProducts[GridID]
                        .map(
                            (item: ProductTypes) =>
                                item?.variety?.[0]?.trim().replace(/['"]+/g, '') || ''
                        )
                        .filter(Boolean);
                    setVariety(allVarieties);
                }
            }
        }
    }, [GridID, groupedProducts, varietyType, product.variety_set]);

    useEffect(() => {
        if (varietyType) {
            // Si hay un tipo de variedad, mantenemos "Selected" o "Assorted"
            setVariety([varietyType === 'Selected' ? 'Selected Varieties' : 'Assorted Varieties']);
        } else if (
            product.variety_set &&
            product.variety_set.length > 0 &&
            !product.variety_set.includes("Assorted Varieties") &&
            !product.variety_set.includes("Selected Varieties")
        ) {
            // Si variety_set tiene datos válidos pero no es ni "Assorted" ni "Selected"
            setVariety(product.variety_set);
        } else if (GridID && groupedProducts[GridID]) {
            // Restaurar todas las variedades desde groupedProducts
            const allVarieties = groupedProducts[GridID]
                .map(
                    (item: ProductTypes) =>
                        item?.variety?.[0]?.trim().replace(/['"]+/g, '') || ''
                )
                .filter(Boolean);

            const uniqueVarieties = Array.from(new Set([...allVarieties])); // Asegurar que no haya duplicados
            setVariety(uniqueVarieties);
        }
    }, [varietyType,product.variety_set]);
    
    useEffect(() => {
        if (GridID && groupedProducts[GridID]) {
            if (variety.length === 0 || variety.length === 1) {
                const mainProduct = groupedProducts[GridID][0];
                const mainSize = Array.isArray(mainProduct?.size) 
                    ? mainProduct.size[0]?.trim() 
                    : mainProduct?.size?.trim() || '';
                setSize([mainSize]);
            } else {
                const selectedSizes = groupedProducts[GridID]
                    .filter(item => {
                        const itemVariety = item?.variety?.[0]?.trim().replace(/['"]+/g, '') || '';
                        return variety.includes(itemVariety);
                    })
                    .map((item: ProductTypes) => {
                        const itemSize = Array.isArray(item?.size) 
                            ? item.size[0]?.trim() 
                            : item?.size?.trim() || '';
                        return itemSize;
                    })
                    .filter(Boolean);

                const numericSizes = selectedSizes
                    .map(size => parseFloat(size.replace(/[^\d.]/g, '')))
                    .filter(size => !isNaN(size));

                const uniqueSortedSizes = Array.from(new Set(numericSizes))
                    .sort((a, b) => a - b)
                    .map(String);

                setSize(uniqueSortedSizes);
            }
        }
    }, [GridID, groupedProducts, variety, varietyType ]);

    const updateSizeRange = (sizes: string[] | string | undefined) => {
        if (!sizes) return [];
        
        // Convertir a array si es string
        const sizesArray = Array.isArray(sizes) ? sizes : [sizes];
        if (sizesArray.length === 0) return [];
        if (sizesArray.length === 1) return sizesArray;

        const numericSizes = sizesArray
            .map(size => ({
                original: size,
                numeric: parseFloat(size.replace(/[^\d.]/g, ''))
            }))
            .filter(size => !isNaN(size.numeric));

        if (numericSizes.length === 0) return sizesArray;
        if (numericSizes.length === 1) return [numericSizes[0].original];

        numericSizes.sort((a, b) => a.numeric - b.numeric);
        return [numericSizes[0].original, numericSizes[numericSizes.length - 1].original];
    };


    const handledSelectedBurst = (item: burstType) => {
        setSelectedBurst(item);
        setBurst(item.value)
        setOpenDropdown(false)
    }

    
    const onVarietyTypeChange = (type: 'Selected' | 'Assorted' | null) => {
        setVarietyType(type);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (burstDropdownRef.current && 
                !burstDropdownRef.current.contains(event.target as Node) && 
                openDropdown) {
                setOpenDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    return (
        <React.Fragment>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-100" >
                <div className="relative max-w-[95%]" >
                    {/* Contenido del Modal */}
                    <div className="absolute -right-5 -top-5 ">
                        <button onClick={() => setIsOpen(false)}
                            className=" bg-gray-500 p-4 rounded-full border-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28"
                                viewBox="0 0 384 512">
                                <path fill="#ffffff"
                                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                        </button>
                    </div>
                    <div className="bg-gray-300 p-4 rounded-lg shadow-lg flex justify-between " >
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="w-full h-64 bg-white rounded-lg p-2">
                                    {product?.url_image ? (
                                        <Image
                                            src={product?.url_image}
                                            className="w-full h-full object-contain"
                                            alt={product?.desc || "No hay descripción"}
                                            width={300}
                                            height={300}
                                            draggable={false}
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                            <h1 className="text-gray-500">No image available</h1>
                                        </div>
                                    )}
                                </div>

                                {/* Imágenes Pequeñas */}
                                <div className="grid grid-cols-3 gap-1">
                                    {[1, 2, 3].map((_, index) => (
                                        <div key={index} className="h-24 bg-white rounded-lg p-1">
                                            {product?.url_image ? (
                                                <Image
                                                    src={product?.url_image}
                                                    className="w-full h-full object-contain"
                                                    alt={`${product?.desc || "No hay descripción"}-${index}`}
                                                    width={100}
                                                    height={100}
                                                    draggable={false}
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">No image</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="rounded-lg align-baseline grid p-2 grid-cols-2 gap-4 space-x-2">
                                <div className="space-y-2">
                                    {product?.master_brand && product.master_brand !== "undefined" && (
                                        <div className="flex items-center">
                                            <h1 className="text-black font-bold w-32">Master Brand:</h1>
                                            <h1 className="text-black uppercase">{product?.master_brand}</h1>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <h1 className="text-black font-bold w-32">Brand:</h1>
                                        <h1 className="text-black uppercase">{product?.brand}</h1>
                                    </div>

                                    <div className="flex items-center">
                                        <h1 className="text-black font-bold w-32">Description:</h1>
                                        <h1 className="text-black uppercase">{product?.desc || "No hay descripción"}</h1>
                                    </div>

                                    {product.id_category === 5 && (
                                        <>
                                            <div className="flex items-center">
                                                <h1 className="text-black font-bold w-32">Type of Cut:</h1>
                                                <h1 className="text-black uppercase">{product?.type_of_cut}</h1>
                                            </div>
                                            <div className="flex items-center">
                                                <h1 className="text-black font-bold w-32">Type of Meat:</h1>
                                                <h1 className="text-black uppercase">{product?.type_of_meat}</h1>
                                            </div>
                                            <div className="flex items-center">
                                                <h1 className="text-black font-bold w-32">Quality CF:</h1>
                                                <h1 className="text-black uppercase">{product?.quality_cf}</h1>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex items-center">
                                        <h1 className="text-black font-bold w-32">Variety:</h1>
                                        <h1 className="text-black uppercase text-balance w-48">
                                            {varietyType 
                                                ? varietyType === 'Selected' 
                                                    ? 'Selected Varieties' 
                                                    : 'Assorted Varieties'
                                                : variety.includes('Selected Varieties') 
                                                    ? 'Selected Varieties'
                                                    : variety.includes('Assorted Varieties')
                                                        ? 'Assorted Varieties'
                                                        : Array.from(new Set(variety)).join(', ')}
                                        </h1>
                                    </div>


                                    <div className="flex items-center gap-1">
                                        <h1 className="text-black font-bold w-32">Size:</h1>
                                        <h1 className="text-black uppercase">
                                            {GridID && groupedProducts[GridID]
                                                ? updateSizeRange(size).join(' - ')
                                                : updateSizeRange(Array.isArray(product?.size) ? product.size : [product?.size || '']).join(' - ')}
                                        </h1>
                                        <h1 className="text-black uppercase">{product?.w_simbol}</h1>
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center gap-5">
                                            {/* Título y Campo de Precio */}
                                            <div className="flex items-center gap-1">
                                                <h3 className="font-bold text-black">Price:</h3>
                                                <input
                                                    type="text"
                                                    value={price}
                                                    onChange={(event) => {
                                                        const newValue = event.target.value
                                                        setPrice(newValue);
                                                    }}
                                                    className="w-20 p-1 border border-gray-950 rounded font-bold text-black"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full flex-row justify-start gap-5">
                                        <div className="flex items-center gap-1">
                                            <h3 className="font-bold text-black w-10">Per:</h3>
                                            <select
                                                className="w-20 p-1 border border-gray-950 rounded font-bold text-black"
                                                defaultValue=""
                                                onChange={(e) => setSelectedPer(e.target.value)}
                                            >
                                                <option value="" disabled></option>
                                                {per.map((item: string, index: number) => (
                                                    <option key={index} value={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <h1 className="text-black font-bold pr-2">Comment:</h1>
                                        <input
                                            type="text"
                                            value={notes}
                                            onChange={(event) => {
                                                const newValue = event.target.value
                                                setNotes(newValue);
                                            }}
                                            className="w-full  p-1 border border-gray-950 rounded font-bold text-black"
                                        />
                                    </div>
                                    {/* Contenedor del campo Brust */}
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-bold text-black">Burst:</h3>
                                        <div className="flex flex-col items-center gap-1" ref={burstDropdownRef}>
                                            <button onClick={() => setOpenDropdown(!openDropdown)}
                                                className="p-1 border border-gray-950 rounded font-bold text-black w-36 bg-white">
                                                {!selectedBurst ? "Select Burst" : "Change burst"}
                                            </button>

                                            {openDropdown && (
                                                <div className="flex absolute m-10 bg-white rounded-md shadow-lg z-50 space-x-2">
                                                    {burstOption.map((item, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handledSelectedBurst(item)}
                                                            className="text-left py-1 shadow gap-2 hover:bg-gray-100"
                                                        >
                                                            {item?.value === 1 ? <Burst1 /> : item?.value === 2 ?
                                                                <Burst2 /> :
                                                                <Burst3 />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {
                                            selectedBurst !== null && (
                                                selectedBurst?.value === 1 ? <Burst1 /> : selectedBurst?.value === 2 ?
                                                    <Burst2 /> : <Burst3 />)
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className="flex pb-4">
                                        <h1 className="text-black font-bold w-24">Conditions</h1>
                                    </div>
                                    <div className="flex">
                                        <h1 className="text-black font-bold pr-2">Add'l $: </h1>
                                        <input
                                            type="text"
                                            value={addl}
                                            onChange={(event) => {
                                                const newValue = event.target.value
                                                setAddl(newValue);
                                            }}
                                            className="w-20 p-1 border border-gray-950 rounded font-bold text-black"
                                        />
                                    </div>
                                    <div className="flex pt-2 items-center">
                                        <h1 className="text-black font-bold pr-2 w-16">Limit: </h1>
                                        <input
                                            type="text"
                                            value={limit}
                                            onChange={(event) => {
                                                const newValue = event.target.value
                                                setLimit(newValue);
                                            }}
                                            className="w-12 p-1 border border-gray-950 rounded font-bold text-black"
                                        />

                                        <div className="flex items-center gap-2 ml-2">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={limit_type === 'Per Family'}
                                                    onChange={() => setLimitType(limit_type === 'Per Family' ? '' : 'Per Family')}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-black">Per Family</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={limit_type === 'Per Offer'}
                                                    onChange={() => setLimitType(limit_type === 'Per Offer' ? '' : 'Per Offer')}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-black">Per Offer</span>
                                            </label>
                                        </div>

                                    </div>
                                    <div className=" flex items-center pt-2">
                                        <h1 className="text-black font-bold pr-2">Must Buy: </h1>
                                        <input
                                            type="text"
                                            value={mustBuy}
                                            onChange={(event) => {
                                                const newValue = event.target.value
                                                setMustBuy(newValue);
                                            }}
                                            className="w-16 p-1 border border-gray-950 rounded font-bold text-black"
                                        />
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <h1 className="text-black font-bold pr-2">With Card: </h1>
                                        <input type="checkbox" checked={withCard} onChange={() => setWithCard(!withCard)} className="w-6 h-6" />
                                    </div>
                                    {GridID && groupedProducts[GridID]?.length > 0 && (
                                        <div className="relative">
                                            <div
                                                className="flex items-center gap-2 cursor-pointer pt-2 rounded"
                                                onClick={() => setShowVarietyList(!showVarietyList)}
                                            >
                                                <h1 className="text-black font-bold hover:underline">+Add Variety</h1>
                                            </div>

                                            {showVarietyList && (
                                                <div ref={varietyListRef} className="absolute z-50 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg">
                                                    {/* Header con opciones Selected/Assorted */}
                                                    <div className="sticky top-0 bg-gray-50 p-3 border-b flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <label className="flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={varietyType === 'Selected'}
                                                                    onChange={() => onVarietyTypeChange(varietyType === 'Selected' ? null : 'Selected')}
                                                                    className="w-4 h-4"
                                                                />
                                                                <span>Selected Variety</span>
                                                            </label>
                                                            <label className="flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={varietyType === 'Assorted'}
                                                                    onChange={() => onVarietyTypeChange(varietyType === 'Assorted' ? null : 'Assorted')}
                                                                    className="w-4 h-4 cursor-pointer"
                                                                />
                                                                <span>Assorted Variety</span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Lista de variedades */}
                                                    <div className="max-h-64 overflow-y-auto">
                                                        {groupedProducts[GridID].slice(0).map((item: ProductTypes, index: number) => (
                                                            <div
                                                                key={index}
                                                                className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <div className="flex items-center p-3 gap-3">
                                                                    <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                                                        {item.url_image && (
                                                                            <Image
                                                                                src={item.url_image}
                                                                                alt={item.desc || "No hay descripción"}
                                                                                width={48}
                                                                                height={48}
                                                                                className="object-cover w-full h-full"
                                                                                draggable={false}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center gap-3">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={variety.includes(item.variety?.[0]?.trim().replace(/['"]+/g, '') || '')}
                                                                                onChange={(e) => {
                                                                                    e.stopPropagation();
                                                                                    const varietyValue = item.variety?.[0]?.trim().replace(/['"]+/g, '') || '';
                                                                                    const updatedVarieties = e.target.checked
                                                                                        ? [...variety, varietyValue] // Agregar al estado si está marcado
                                                                                        : variety.filter(v => v !== varietyValue); // Eliminar si está desmarcado

                                                                                    setVariety(updatedVarieties); // Actualiza el estado
                                                                                }}
                                                                                className="w-4 h-4 cursor-pointer"
                                                                                disabled={!!varietyType}
                                                                            />
                                                                            {isLoadingGridProducts ? <span
                                                                                    className="font-medium">Loading...</span> :
                                                                                <span
                                                                                    className="font-medium">{item?.variety?.[0]?.trim().replace(/['"]+/g, '')}</span>}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500 mt-1">
                                                                            {item?.size} {item?.w_simbol}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-10 items-center justify-center pt-4">
                            <button
                                    className="bg-yellow-500 p-2 text-black rounded-md "
                                    onClick={() => CopyFC(product)}>
                                    <div className="flex gap-2">
                                        <CopyIcon />
                                        Copy Item
                                    </div>
                                </button>

                                <button
                                    className="bg-gray-500 p-2 text-black rounded-md "
                                    onClick={() => ChangeFC(GridID)}>
                                    <div className="flex gap-2">
                                        <ChangeIcon />
                                        Swap Item
                                    </div>
                                </button>
                                <button
                                    className="bg-red-500 p-2 text-black rounded-md "
                                    onClick={() => DeleteFC(GridID)}>
                                    <div className="flex gap-2">
                                        <DeleteIcon />
                                        Delete Item
                                    </div>
                                </button>
                                <button
                                    className="p-2 text-black  bg-lime-500 rounded-md "
                                    onClick={() => {
                                        let finalVariety = variety;
                                        if (varietyType) {
                                            finalVariety = [varietyType === 'Selected' ? 'Selected Varieties' : 'Assorted Varieties'];
                                        } else {
                                            finalVariety = variety.filter(v => v !== 'Selected Varieties' && v !== 'Assorted Varieties');
                                        }
                                        
                                        
                                        SaveFC?.(
                                            GridID,
                                            price,
                                            notes,
                                            burst,
                                            addl,
                                            limit,
                                            mustBuy,
                                            withCard,
                                            limit_type,
                                            selectedPer,
                                            finalVariety,
                                            size,
                                        );
                                         
                                    }}>
                                    <div className="flex gap-2">
                                        <SaveIcon />
                                        Save Changes
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default ModalEditProduct;


