import React, { useContext, useEffect, useState, useRef } from "react";
import { ProductTypes } from "@/types/product";
import { categoriesInterface } from "@/types/category";
import Image from "next/image";
import { Burst1, Burst2, Burst3, ChangeIcon, DeleteIcon, SaveIcon } from "../icons";
import { useProductContext } from "@/app/context/productContext";




interface ModalEditProductInterface {
    product: ProductTypes;
    GridID?: number
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
        varieties: string[],
        size: string[]
    ) => void,
    setIsOpen: (isOpen: boolean) => void
}

interface burstType {
    value: number,
    text: string,
}

const updateSizeRange = (sizes: string[]) => {
    const numericSizes = sizes
        .map(size => parseFloat(size.replace(/[^\d.]/g, '')))
        .filter(size => !isNaN(size));
    
    if (numericSizes.length === 0) return [];
    if (numericSizes.length === 1) return [sizes[0]];
    
    const min = Math.min(...numericSizes);
    const max = Math.max(...numericSizes);
    
    const minString = sizes.find(size => 
        parseFloat(size.replace(/[^\d.]/g, '')) === min
    );
    const maxString = sizes.find(size => 
        parseFloat(size.replace(/[^\d.]/g, '')) === max
    );
    
    return [minString, maxString].filter(Boolean) as string[];
};

const ModalEditProduct = ({ product, GridID, ChangeFC, DeleteFC, SaveFC, setIsOpen }: ModalEditProductInterface) => {

    const [categories, setCategories] = useState<[]>()
    const { groupedProducts } = useProductContext();
    const [categoria, setCategoria] = useState<categoriesInterface>()
    const per = ["Ea", "Lb", "POUND", "HEAD", "BUNCH", "BAG", "PKG", "PK"]
    const [price, setPrice] = useState<string>(product?.price);
    const [burst, setBurst] = useState<number | 0>(product?.burst ?? 0)
    const [addl, setAddl] = useState(product?.addl ?? "")
    const [limit, setLimit] = useState(product?.limit ?? "")
    const [mustBuy, setMustBuy] = useState(product?.must_buy ?? "")
    const [withCard, setWithCard] = useState(product?.with_card ?? false)
    const [limit_type, setLimitType] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [notes, setNotes] = useState(product?.notes && product.notes !== 'undefined' ? product.notes : "")
    const [showVarietyList, setShowVarietyList] = useState(false);

    //dropdown burst
    const [openDropdown, setOpenDropdown] = useState(false)
    const [burstOption, setBurstOption] = useState<burstType[] | []>([])
    const [selectedBurst, setSelectedBurst] = useState<burstType | null>(null)
    const [selectedPer, setSelectedPer] = useState<string>(per[0]);


    const [selectedVarieties, setSelectedVarieties] = useState<ProductTypes[]>([]);
    const [selectedDesc, setSelectedDesc] = useState<string[]>(() => {
        const cleanVarieties = product?.variety
            ? product.variety.map(v => v.trim().replace(/['"]+/g, ''))
            : [];
        console.log(cleanVarieties, ' productos variedades')
        return cleanVarieties;
    });
    const [selectedSizes, setSelectedSizes] = useState<string[]>(() => {
        if (typeof product?.size === 'string') {
            return [product.size];
        }
        if (Array.isArray(product?.size)) {
            return product.size;
        }
        return [];
    });

    const [varietyType, setVarietyType] = useState<'Selected' | 'Assorted' | null>(null);

    const onVarietyTypeChange = (type: 'Selected' | 'Assorted' | null) => {
        setVarietyType(type);

        setSelectedDesc((prev) => {
            let newVarieties = [...prev];

            if (type === 'Selected') {
                if (!newVarieties.includes('Selected Varieties')) {
                    newVarieties = [...newVarieties, 'Selected Varieties'];
                }
                newVarieties = newVarieties.filter(v => v !== 'Assorted Varieties');
            } else if (type === 'Assorted') {
                if (!newVarieties.includes('Assorted Varieties')) {
                    newVarieties = [...newVarieties, 'Assorted Varieties'];
                }
                newVarieties = newVarieties.filter(v => v !== 'Selected Varieties');
            } else {
                newVarieties = newVarieties.filter(v => v !== 'Selected Varieties' && v !== 'Assorted Varieties');
            }

            return newVarieties;
        });
    };

    const varietyListRef = useRef<HTMLDivElement>(null);
    
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
        const getProductView = async () => {
            try {
                const resp = await fetch("/api/apiMongo/getCategories");
                const data = await resp.json();
                if (resp.status === 200) {
                    setCategories(data.result);
                }
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        getProductView();
    }, []);

    useEffect(() => {
        if (Array.isArray(categories) && categories.length > 0 && product?.id_category) {
            const categoryMatch = categories.find((item: categoriesInterface) => item.id_category === product.id_category);

            if (categoryMatch) {
                setCategoria(categoryMatch);


            }
        }


    }, [categories, product]);


    const handledSelectedBurst = (item: burstType) => {
        setSelectedBurst(item);
        setBurst(item.value)
        setOpenDropdown(false)
    }


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
                                            {selectedDesc.includes("Selected Varieties")
                                                ? "Selected Varieties"
                                                : selectedDesc.includes("Assorted Varieties")
                                                    ? "Assorted Varieties"
                                                    : selectedDesc.map((variety, index) => (
                                                     <span key={index}>
                                                     {variety.trim().replace(/['"]+/g, '')}
                                                     {index < selectedDesc.length - 1 ? ', ' : ''}
                                                      </span>
                                                    ))
                                            }
                                        </h1>
                                    </div>


                                    <div className="flex items-center gap-1">
                                        <h1 className="text-black font-bold w-32">Size:</h1>
                                        <h1 className="text-black uppercase">
                                            {selectedSizes.length > 0
                                                ? selectedSizes.length === 1
                                                    ? selectedSizes[0]
                                                    : `${selectedSizes[0]} - ${selectedSizes[selectedSizes.length - 1]}`
                                                : 'No size'}
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
                                        <div className="flex flex-col items-center gap-1">
                                            <button onClick={() => setOpenDropdown(!openDropdown)}
                                                    className="p-1 border border-gray-950 rounded font-bold text-black w-36 bg-white">
                                                {!selectedBurst ? "Select Burst" : "Change burst"}
                                            </button>

                                            {openDropdown && (
                                                <div
                                                    className="flex absolute m-10 bg-white rounded-md shadow-lg z-50 space-x-2">
                                                    {burstOption.map((item, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handledSelectedBurst(item)}
                                                            className="text-left py-1 shadow gap-2 hover:bg-gray-100"
                                                        >
                                                            {item?.value === 1 ? <Burst1/> : item?.value === 2 ?
                                                                <Burst2/> :
                                                                <Burst3/>}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {
                                            selectedBurst !== null && (
                                                selectedBurst?.value === 1 ? <Burst1/> : selectedBurst?.value === 2 ?
                                                    <Burst2/> : <Burst3/>)
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

                                        <div className="relative ml-2">
                                            <button
                                                className={`flex items-center justify-center p-2 border rounded ${limit_type !== '' ? 'bg-blue-500 text-white' : 'border-gray-950'}`}
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            >
                                                <svg
                                                    className="w-4 h-4 text-black"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {isDropdownOpen && (
                                                <div className="absolute top-full mt-1 w-32 bg-white border border-gray-300 rounded shadow-lg">
                                                    <div
                                                        className={`px-4 py-2 cursor-pointer text-black ${limit_type === 'Per Family' ? 'bg-blue-500 text-white ' : 'hover:bg-gray-100 '}`}
                                                        onClick={() => {
                                                            setLimitType(limit_type === 'Per Family' ? '' : 'Per Family');
                                                            setIsDropdownOpen(false);
                                                        }}
                                                    >
                                                        Per Family
                                                    </div>
                                                    <div
                                                        className={`px-4 py-2  cursor-pointer text-black ${limit_type === 'Per Offer' ? 'bg-blue-500 text-white no-hover' : 'hover:bg-gray-100 '}`}
                                                        onClick={() => {
                                                            setLimitType(limit_type === 'Per Offer' ? '' : 'Per Offer');
                                                            setIsDropdownOpen(false);
                                                        }}
                                                    >
                                                        Per Offer
                                                    </div>
                                                </div>
                                            )}
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
                                                <div ref={varietyListRef} className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg text-black">
                                                    <div className="h-48  overflow-y-auto">
                                                        <div className="flex gap-2 mb-2 items-end justify-end w-full p-2 text-wrap">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={varietyType === 'Selected'}
                                                                    onChange={() => onVarietyTypeChange(varietyType === 'Selected' ? null : 'Selected')}
                                                                    className="w-3 h-3"
                                                                />
                                                                <span className="text-sm text-black whitespace-nowrap">Selected Varieties</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={varietyType === 'Assorted'}
                                                                    onChange={() => onVarietyTypeChange(varietyType === 'Assorted' ? null : 'Assorted')}
                                                                    className="w-3 h-3"
                                                                />
                                                                <span className="text-sm text-black whitespace-nowrap">Assorted Varieties</span>
                                                            </div>
                                                        </div>

                                                        {groupedProducts[GridID].map((item: ProductTypes, index: number) => (
                                                            <div
                                                                key={index}
                                                                className="cursor-pointer hover:bg-red-100 gap-2 overflow-hidden"
                                                                onClick={() => {
                                                                    const variety = (item.variety?.[0] || "Sin variedad")
                                                                        .trim().replace(/['"]+/g, '');

                                                                    if (!selectedDesc.includes(variety)) {
                                                                        setSelectedVarieties(prev => [...prev, item]);
                                                                        setSelectedDesc(prev => {
                                                                            const newVarieties = [...prev, variety];
                                                                            return newVarieties;
                                                                        });

                                                                        if (item.size) {
                                                                            const sizeToAdd = Array.isArray(item.size) ? item.size[0] : item.size;
                                                                            if (typeof sizeToAdd === 'string' && !selectedSizes.includes(sizeToAdd)) {
                                                                                setSelectedSizes(prevSizes => [...prevSizes, sizeToAdd]);
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-4 p-2 hover:bg-red-100">
                                                                    {item.url_image && (
                                                                        <Image
                                                                            src={item.url_image}
                                                                            alt={item.desc || "No hay descripción"}
                                                                            width={50}
                                                                            height={50}
                                                                            className="rounded-sm"
                                                                            draggable={false}
                                                                        />
                                                                    )}
                                                                    <div className="flex flex-col">
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedDesc.includes(item.variety?.[0]?.trim().replace(/['"]+/g, '') || '')}
                                                                                onChange={(e) => {
                                                                                    e.stopPropagation();
                                                                                    const variety = (item.variety?.[0] || "Sin variedad").trim().replace(/['"]+/g, '');
                                                                                    if (selectedDesc.includes(variety)) {
                                                                                        setSelectedDesc(prev => prev.filter(v => v !== variety));
                                                                                        setSelectedVarieties(prev => prev.filter(v => v.variety?.[0] !== item.variety?.[0]));
                                                                                        
                                                                                        setSelectedSizes(prevSizes => {
                                                                                            const remainingVarieties = selectedVarieties.filter(v => v.variety?.[0] !== item.variety?.[0]);
                                                                                            const remainingSizes = remainingVarieties.map(v => 
                                                                                                Array.isArray(v.size) ? v.size[0] : v.size
                                                                                            ).filter((size): size is string => typeof size === 'string');
                                                                                            
                                                                                            return Array.from(new Set(remainingSizes));
                                                                                        });
                                                                                    } else {
                                                                                        setSelectedDesc(prev => {
                                                                                            const newVarieties = Array.from(new Set([...prev, variety]));
                                                                                            return newVarieties;
                                                                                        });
                                                                                        
                                                                                        setSelectedVarieties(prev => {
                                                                                            const newSelected = Array.from(new Set([...prev, item]));
                                                                                            return newSelected;
                                                                                        });
                                                                                    }
                                                                                    if (item.size) {
                                                                                        const sizeToAdd = Array.isArray(item.size) ? item.size[0] : item.size;
                                                                                        if (typeof sizeToAdd === 'string') {
                                                                                            setSelectedSizes(prevSizes => {
                                                                                                const newSizesArray = selectedDesc.includes(variety)
                                                                                                    ? prevSizes.filter(s => s !== sizeToAdd)
                                                                                                    : [...prevSizes, sizeToAdd];
                                                                                                
                                                                                                return updateSizeRange(newSizesArray);
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                className="w-4 h-4"
                                                                                disabled={!!varietyType}
                                                                            />
                                                                            <span className="text-sm font-medium text-black">{item?.variety}</span>
                                                                        </div>
                                                                        <div className="flex gap-1 items-center ml-6">
                                                                            <span className="text-xs text-gray-600">{item?.size || "0"}</span>
                                                                            <span className="text-xs text-gray-600">{item?.w_simbol || "0"}</span>
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
                                            selectedDesc,
                                            selectedSizes
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


