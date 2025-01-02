import React, { useEffect, useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ProductTypes } from '@/types/product';
import { categoriesInterface } from '@/types/category';
import { toast, ToastContainer } from 'react-toastify';
import { updateProduct } from '@/pages/api/apiMongo/updateProduct';
import ImageFullScreenPreview from '@/app/components/imageFullScreenPreview';
import { UnverifiedIcon, VerifiedIcon } from '../icons';
import ModalSmallProduct from '../modalSmallProduct';
import { calculateTotalProduct } from '@/helpers/calculateTotalPage';
import { useAuth } from '../provider/authprovider';


declare module '@tanstack/react-table' {
    interface TableMeta<TData extends unknown> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}
type ColumnsSelectorKeys = keyof typeof initialColumnsSelector;

const initialColumnsSelector = {
    verify: false,
    upc: false,
    master_brand: false,
    brand: false,
    desc: false,
    variety: false,
    pack: false,
    count: false,
    size: false,
    w_simbol: false,
    embase: false,
    id_category: false,
    type_of_meat: false,
};

interface EditableProductTableInterface {
    products: ProductTypes[];
    categories: categoriesInterface[]
    openModal: boolean;
    closeModal: (status: boolean) => void;
    reloadData: (status: boolean) => void;
}
const DEFAULT_FILTER = { id_category: "", upc: "", brand: "", master_brand: "", desc: "", variety: "", date: "",pack:"",size:"",verify:"" }

const EditableProductTable = ({
    products,
    openModal,
    closeModal,
    categories,
    reloadData
}: EditableProductTableInterface) => {
    const [LocalProducts, setLocalProducts] = useState<ProductTypes[]>(products?.filter((item) => item.status_active === true).sort((a, b) => new Date(String(a.createdAt)).getTime() - new Date(String(b.createdAt)).getTime()));
    const [modifiedData, setModifiedData] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductTypes[]>(products?.filter((item) => item.status_active === true).sort((a, b) => new Date(String(a.createdAt)).getTime() - new Date(String(b.createdAt)).getTime()).slice(0, 100));
    const [filters, setFilters] = useState(DEFAULT_FILTER);
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [reload, setReload] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [selectedRowId, setSelectedRowId] = useState<any>(null);

    //column
    const [columnsSelector, setColumnsSelector] = useState({verify:true,upc:true,master_brand:true,brand:true,desc:true,variety:true,pack:true,count:true,size:true,w_simbol:true,embase:true,id_category:true,type_of_meat:false});
    //settings Open
    const [openModalSettings, setOpenModalSettings] = useState(false);


    //pagination
    const [TotalPage, setTotalPage] = useState(calculateTotalProduct(products.filter((item) => item.status_active === true).length));
    const [step, setStep] = useState<number>(1);
    const [cantProduct, setCantProduct] = useState(products?.filter((item) => item.status_active === true).length);
    const [cantFilteredProduct, setCantFilteredProduct] = useState(products?.filter((item) => item.status_active === true).length);


    const [imageUpdateModal, setImageUpdateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductTypes|null>(null);
    const [newImage, setNewImage] = useState<File|null>(null);
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);
    const [value, setValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<{[key: string]: string[]}>({});
    const [showSuggestions, setShowSuggestions] = useState<{[key: string]: boolean}>({});
    const { user } = useAuth();




    //preview image ulr
    const [previewUrl, setPreviewUrl] = useState<string|null>(null);

    const getUniqueValues = (fieldName: keyof ProductTypes) => {
        const values = products
            .map(p => p[fieldName])
            .filter((value): value is string =>
                typeof value === 'string' && value.length > 0
            );
        return Array.from(new Set(values));
    };

    const handleInputChangeMain = (fieldName: keyof ProductTypes, value: string) => {
        setValue(value);

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
        setValue(value);
        setShowSuggestions({ ...showSuggestions, [fieldName]: false });
    };

    const [tempColumns, setTempColumns] = useState<any>();
    const [columns,setColumns] = useState([
        {
            accessorKey: 'verify',
            header: 'Certificated',
            cell: ({ getValue}: any) => {
                const verify = getValue();
                return (
                    <div className="flex justify-center">
                        {verify ? (
                            <VerifiedIcon />
                        ) : (
                            <UnverifiedIcon />
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'upc',
            header: 'UPC',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 w-32 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'master_brand',
            header: 'Master Brand',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />

            ),
        },
        {
            accessorKey: 'brand',
            header: 'Brand',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'desc',
            header: 'Description',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'variety',
            header: 'Variety',
            cell: ({ getValue, row, column }: any) => {
                const value = getValue();
                const displayValue = (value?.[0] || '').replace(/['"]+/g, '');

                return (
                    <input
                        className="border border-gray-300 w-24 rounded p-1 text-black bg-gray-200 "
                        value={getValue() || ''}
                        onChange={(e) =>
                            table.options.meta?.updateData(row.index, column.id, e.target.value)
                        }
                    />
                );
            },
        },
        {
            accessorKey: 'pack',
            header: 'Pack',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 w-24 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'count',
            header: 'Count',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 w-24 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'size',
            header: 'Size',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 w-24 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'w_simbol',
            header: 'Weight Symbol',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 w-24 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'embase',
            header: 'Embase',
            cell: ({ getValue, row, column }: any) => (
                <input
                    className="border border-gray-300 w-28 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                />
            ),
        },
        {
            accessorKey: 'id_category',
            header: 'Category',
            cell: ({ getValue, row, column }: any) => (
                <select
                    className="border border-gray-300 rounded p-1 text-black bg-gray-200 "
                    value={getValue() || ''}
                    onChange={(e) =>
                        table.options.meta?.updateData(row.index, column.id, e.target.value)
                    }
                >
                    <option value=""> Select category</option>
                    {categories?.length > 0 && categories?.map((category: categoriesInterface) => (
                        <option key={category?.id_category} value={category?.id_category}>
                            {category?.name_category}
                        </option>
                    ))}
                    <option value="create">+ Add new category</option>
                </select>
            ),
        },
        {
            accessorKey: 'type_of_meat',
            header: 'Type of Meat',
            cell:
                ({ getValue, row, column }: any) => (
                    <input
                        className="border border-gray-300 rounded p-1 text-black"
                        value={getValue() || ''}
                        onChange={(e) =>
                            table.options.meta?.updateData(row.index, column.id, e.target.value)
                        }
                    />
                ),
        },
    ]);

    useEffect(() => {
        const filteredColumns = columns.filter((column) => columnsSelector[column.accessorKey as keyof typeof columnsSelector]);
        console.log("columnas",filteredColumns)
        setTempColumns(filteredColumns);
    }, [columns, columnsSelector]);

    useEffect(() => {
        if ((filters.id_category === '5' || filters.id_category === '16') && columnsSelector?.type_of_meat === false ) {
            setColumnsSelector({...columnsSelector, type_of_meat: true });
        }
    }, [filters,]);



    const table = useReactTable({
        data: filteredProducts,
        columns:tempColumns ? tempColumns : columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
                setFilteredProducts((old: any) =>
                    old.map((row: any, index: number) => {
                        if (index === rowIndex) {
                            const updatedRow = { ...row, [columnId]: value };

                            if (row[columnId] !== value) {
                                setModifiedData((prevModified) => {
                                    const exists = prevModified.some(
                                        (item) => item.index === rowIndex
                                    );

                                    if (exists) {
                                        return prevModified.map((item) =>
                                            item.index === rowIndex
                                                ? { ...updatedRow, index: rowIndex }
                                                : item
                                        );
                                    }

                                    return [...prevModified, { ...updatedRow, index: rowIndex }];
                                });
                            }

                            return updatedRow;
                        }
                        return row;
                    })
                );
            },
        },
    });

    useEffect(() => {
        if (!LocalProducts?.length) return;

        const filterMap = {
            id_category: (item: ProductTypes, value: string) =>
                value === "" || item.id_category === Number(value),
            upc: (item: ProductTypes, value: string) =>
                value.length < 3 || item.upc?.toLowerCase().includes(value.toLowerCase()),
            brand: (item: ProductTypes, value: string) =>
                value.length < 3 || item.brand?.toLowerCase().includes(value.toLowerCase()),
            master_brand: (item: ProductTypes, value: string) =>
                value.length < 3 || item.master_brand?.toLowerCase().includes(value.toLowerCase()),
            desc: (item: ProductTypes, value: string) =>
                value.length < 3 || item.desc?.toLowerCase().includes(value.toLowerCase()),
            pack: (item: ProductTypes, value: string) =>
                value.length < 1 || String(item.pack)?.toLowerCase().includes(value.toLowerCase()),
            size: (item: ProductTypes, value: string) =>
                value.length < 1 || String(item.size)?.toLowerCase().includes(value.toLowerCase()),
            verify: (item: ProductTypes, value: string) =>
                value === "" || item.verify === (value === "true"),
            variety: (item: ProductTypes, value: string) =>
                value.length < 3 || item.variety?.includes(value.toLowerCase()),
            date: (item: ProductTypes, value: string) => {
                if (value === "") return true; // No filtrar si el valor está vacío
                const itemDate = new Date(String(item.createdAt).split("T")[0]).toString(); // Asegúrate de obtener solo la fecha
                const filterDate = new Date(value).toString();
                return itemDate === filterDate;
            },
        };


        let newProduct = LocalProducts;

        newProduct = LocalProducts?.filter(item =>
            Object.entries(filterMap).every(([key, filterFn]) =>
                filterFn(item, debouncedFilters[key as keyof typeof debouncedFilters])
            )
        );

        // newProduct.sort((a, b) => {
        //     const comparison = new Date(String(a?.createdAt)).getTime() - new Date(String(b?.createdAt)).getTime();
        //     return debouncedFilters.orden === "true" ? comparison : -comparison;
        // });

        if (newProduct?.length < 100) {
            setStep(1);
            setFilteredProducts(newProduct);
            setCantProduct(newProduct.length)
            setCantFilteredProduct(newProduct.length)
        } else {
            const start = (step - 1) * 100;
            const end = start + 100;
            setFilteredProducts(newProduct.slice(start, end));
            setCantProduct(newProduct.slice(start, end).length)
            setCantFilteredProduct(newProduct.length)
        }

        setTimeout(() => setLoadingScreen(false), 1000);
    }, [step, debouncedFilters, LocalProducts, reload]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    const isEdited = (targetItem: any) => {
        const isItemInList = modifiedData.some(
            (item) => item._id === targetItem._id && item.upc === targetItem.upc
        );
        return isItemInList;
    };

    const handleUpdateProducts = async (items: ProductTypes | ProductTypes[]) => {
        const productsToUpdate = Array.isArray(items) ? items : [items];
        const results = await Promise.all(productsToUpdate.map(async (product) => {
            try {
                const formData = new FormData();
                if (product.image?.[0]) {
                    formData.append('image', product.image[0]);
                }

                const basicFields = {
                    id_product: String(product.id_product || ''),
                    upc: product.upc || '',
                    desc: product.desc || '',
                    brand: product.brand || '',
                    variety: Array.isArray(product.variety) ? product.variety[0] : '',
                    master_brand: product.master_brand || '',
                    size: String(product.size || ''),
                    type_of_meat: product.type_of_meat || '',
                    type_of_cut: product.type_of_cut || '',
                    quality_cf: product.quality_cf || '',
                    id_category: String(product.id_category || ''),
                    pack: String(product.pack || 0),
                    count: String(product.count || 0),
                    w_simbol: product.w_simbol || "",
                    embase: product.embase || "",
                    verify: product.verify ? 'true' : 'false'
                };

                Object.entries(basicFields).forEach(([key, value]) => {
                    formData.append(key, value);
                });

                const response = await fetch('https://hiresprintcanvas.dreamhosters.com/updateProduct', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status}`);
                }

                const data = await response.json();

                const updatedProduct = { ...product };
                if (data.result?.url_image) {
                    updatedProduct.url_image = data.result.url_image;
                }

                toast.success(`Producto ${product.upc} actualizado exitosamente`);
                return { success: true, product: updatedProduct };

            } catch (error) {
                console.error('Error al actualizar producto:', error);
                toast.error(`Error al actualizar producto ${product.upc}`);
                return { success: false, product };
            }
        }));

        const successfulUpdates = results.filter(r => r.success).map(r => r.product);
        if (successfulUpdates.length > 0) {
            const updatedLocalProducts = LocalProducts.map(item => {
                const updated = successfulUpdates.find(u => u.id_product === item.id_product);
                return updated || item;
            });

            const updatedFilteredProducts = filteredProducts.map(item => {
                const updated = successfulUpdates.find(u => u.id_product === item.id_product);
                return updated || item;
            });

            setLocalProducts(updatedLocalProducts);
            setFilteredProducts(updatedFilteredProducts);

            const updatedIds = successfulUpdates.map(p => p.id_product);
            setModifiedData(modifiedData.filter(item => !updatedIds.includes(item.id_product)));
        }

        setSelectedProduct(null);
        setNewImage(null);
        setImageUpdateModal(false);
        setIsUpdatingImage(false);

        return results.every(r => r.success);
    };

    const handleCheckboxChange = (key: ColumnsSelectorKeys) => {
        setColumnsSelector((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const handleClear = () => {
        setFilters(DEFAULT_FILTER)
        return setLoadingScreen(true)
    };


    return openModal ? (
        <React.Fragment>
            <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-100 p-5">
                <div className="relative w-full h-[85vh] ">
                    <div className="absolute -right-5 -top-5 ">
                        <button onClick={() => (closeModal(false), reloadData(true))}
                                className=" bg-gray-500 p-4 rounded-full border-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28"
                                 viewBox="0 0 384 512">
                                <path fill="#ffffff"
                                      d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                        </button>
                    </div>
                    <div className="w-full flex p-4 bg-gray-900 gap-5 sm:flex-wrap ">
                        <div className="flex flex-col justify-start">
                            <label className={'text-start text-white uppercase '}>UPC</label>
                            <input className="w-32 bg-gray-500 text-white p-2 rounded-md"
                                   value={filters.upc}
                                   onChange={(e) => (setFilters({
                                       ...filters,
                                       upc: e.target.value,
                                   }), setLoadingScreen(true))} />
                        </div>
                        <div className="flex flex-col justify-start">
                            <label
                                className="text-start text-white uppercase "
                            >
                                Date Circular
                            </label>
                            <input
                                value={filters.date}
                                onChange={(e) => (setFilters({
                                    ...filters,
                                    date: e.target.value,
                                }), setLoadingScreen(true))}
                                type="date"
                                className="w-32 bg-gray-500 text-white p-2 rounded-md"
                            />
                        </div>
                        <div className="justify-start flex flex-col">
                            <label className={'text-start text-white uppercase '}>Certificated</label>
                            <select
                                value={filters.verify === '' ? '' : filters.verify}
                                onChange={(e) => (setFilters({
                                    ...filters,
                                    verify: e.target.value,
                                }), setLoadingScreen(true))}
                                className={'w-32 bg-gray-500 text-white p-2 rounded-md'}
                                defaultValue=""
                            >
                                <option value="">
                                    Selecciona Certificated o Uncertificated
                                </option>
                                <option value="true">
                                    Certificated
                                </option>
                                <option value="false">
                                    Uncertificated
                                </option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-start">
                        <label className={'text-start text-white uppercase '}>Master Brand</label>
                            <input className="w-32 bg-gray-500 text-white p-2 rounded-md"
                                   value={filters.master_brand}
                                   onChange={(e) => (setFilters({
                                       ...filters,
                                       master_brand: e.target.value,
                                   }), setLoadingScreen(true))} />
                        </div>
                        <div className="justify-start flex flex-col">
                            <label className={'text-start text-white uppercase '}>Brand</label>
                            <input className="w-32 bg-gray-500 text-white p-2 rounded-md"
                                   value={filters.brand}
                                   onChange={(e) => (setFilters({
                                       ...filters,
                                       brand: e.target.value,
                                   }), setLoadingScreen(true))} />
                        </div>
                        <div className="justify-start flex flex-col">
                            <label className={'text-start text-white uppercase '}>Description </label>
                            <input className="w-32 bg-gray-500 text-white p-2 rounded-md"
                                   value={filters.desc}
                                   onChange={(e) => (setFilters({
                                       ...filters,
                                       desc: e.target.value,
                                   }), setLoadingScreen(true))} />
                        </div>
                        <div className="justify-start flex flex-col">
                            <label className={'text-start text-white uppercase '}>Variety</label>
                            <input className="w-32 bg-gray-500 text-white p-2 rounded-md"
                                   value={filters.variety}
                                   onChange={(e) => (setFilters({
                                       ...filters,
                                       variety: e.target.value,
                                   }), setLoadingScreen(true))} />
                        </div>
                        <div className="justify-start flex flex-col">
                            <label className={'text-start text-white uppercase '}>Pack</label>
                            <input className="w-32 bg-gray-500 text-white p-2 rounded-md"
                                   value={filters.pack}
                                   onChange={(e) => (setFilters({
                                       ...filters,
                                       pack: e.target.value,
                                   }), setLoadingScreen(true))} />
                        </div>
                        <div className="justify-start flex flex-col">
                            <label className={'text-start text-white uppercase '}>Size</label>
                            <input className="w-32 bg-gray-500 text-white p-2 rounded-md"
                                   value={filters.size}
                                   onChange={(e) => (setFilters({
                                       ...filters,
                                       size: e.target.value,
                                   }), setLoadingScreen(true))} />
                        </div>
                        <div className="justify-start flex flex-col">
                            <label className={'text-start text-white uppercase '}>Category</label>
                            <select
                                value={filters.id_category === '' ? '' : filters.id_category}
                                onChange={(e) => (setFilters({
                                    ...filters,
                                    id_category: e.target.value,
                                }), setLoadingScreen(true))}
                                className={'w-32 bg-gray-500 text-white p-2 rounded-md'}
                                defaultValue=""
                            >
                                <option value="">
                                    Seleccionar una Categoría
                                </option>
                                {categories.map((client: categoriesInterface) => (
                                    <option key={client.id_category} value={client.id_category}>
                                        {client.name_category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="justify-start mt-6">
                            <button
                                disabled={filters === DEFAULT_FILTER}
                                onClick={() => handleClear()}
                                className="w-full px-2 py-2 text-sm font-bold text-white rounded  active:scale-110 disabled:text-gray-700"
                            >
                                Clear filter
                            </button>
                        </div>
                        <div className="justify-start mx-10">
                            <label className={'text-start text-white uppercase '}>save</label>
                            <button
                                disabled={!(modifiedData.length > 0)}
                                onClick={() => handleUpdateProducts(modifiedData)}
                                className="w-full px-4 py-2 text-sm font-bold text-white rounded bg-lime-600 hover:scale-110 disabled:bg-gray-500"
                            >
                                Update All
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-900 w-full min-h-[65vh] shadow-md p-4">
                        <div className="flex flex-col sm:flex-row w-full p-2 justify-between items-center">
                            <h1 className="text-white p-2 text-center sm:text-left">{'PRODUCTS: ' + cantProduct}</h1>
                            <h1 className="text-white p-2 text-center sm:text-left">{'TOTAL PRODUCTS: ' + cantFilteredProduct}</h1>
                            <button
                                className="text-white p-2 uppercase border-2 rounded-md hover:bg-gray-700 transition-colors"
                                onClick={() => setOpenModalSettings(true)}
                            >
                                settings
                            </button>
                        </div>
                        {loadingScreen ? (
                            <div className="space-y-4">
                                {/* Header Skeleton */}
                                <div
                                    className="bg-gray-800 text-white table-auto border-collapse rounded-lg overflow-hidden">
                                    <div className="bg-gray-900">
                                        <div
                                            className="px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider h-8 bg-gray-700 animate-pulse"></div>
                                        <div
                                            className="px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider h-8 bg-gray-700 animate-pulse"></div>
                                    </div>
                                </div>
                                {/* Rows Skeleton */}
                                <div className="space-y-2">
                                    {Array(5)
                                        .fill(0)
                                        .map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-2 px-4 bg-gray-800 border-t border-gray-700 animate-pulse"
                                            >
                                                <div className="w-1/3 h-6 bg-gray-700 rounded"></div>
                                                <div className="w-1/3 h-6 bg-gray-700 rounded"></div>
                                                <div className="w-1/3 h-6 bg-gray-700 rounded"></div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto relative max-h-[55vh]">
                                <table className="bg-gray-800 text-white table-auto border-collapse rounded-lg w-full">
                                    <thead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id} className="bg-gray-900">
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    className="sticky top-0 z-8 bg-gray-950 px-2 sm:px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider"
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </th>
                                            ))}
                                            <th className="sticky top-0 z-8 bg-gray-950 px-2 sm:px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider">
                                                Preview
                                            </th>
                                            <th className="sticky top-0 z-8 bg-gray-950 px-2 sm:px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider">
                                                Certificate
                                            </th>
                                            <th className="sticky top-0 z-8 bg-gray-950 px-2 sm:px-6 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700 uppercase tracking-wider">
                                                Load
                                            </th>
                                        </tr>
                                    ))}
                                    </thead>
                                    <tbody>
                                    {table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className={`hover:bg-gray-700 border-t border-gray-600 ${
                                                selectedRowId === row.id ? 'bg-gray-700 border-2 border-lime-600' : ''
                                            }`}
                                            onClick={() => setSelectedRowId(row.id)} // Establecer la fila seleccionada
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-2 sm:px-6 py-2 text-md text-black">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                            <td className="px-2 sm:px-6 py-2 text-md text-black items-center uppercase">
                                                {row.original.url_image && (
                                                    <img
                                                        src={row.original.url_image}
                                                        onClick={() => setPreviewUrl(String(row.original.url_image))}
                                                        alt="Preview"
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-2 sm:px-6 py-2 text-md text-black items-center">
                                                <button
                                                    onClick={() => {
                                                        const filteredProduct = filteredProducts.filter(
                                                            (_, index) => index === row.index,
                                                        );
                                                        setSelectedProduct(filteredProduct[0]);
                                                        setImageUpdateModal(true);
                                                    }}
                                                    className={`px-4 sm:px-6 py-1 text-sm font-bold text-white rounded ${row.original.verify ? "bg-[#47ba09] " : "bg-blue-700"} hover:scale-110 disabled:bg-gray-500`}
                                                >
                                                    Verify
                                                </button>
                                            </td>
                                            <td className="px-2 sm:px-6 py-2 text-md text-black items-center ">
                                                <button
                                                    disabled={!isEdited(row.original)}
                                                    onClick={() => handleUpdateProducts(row.original)}
                                                    className="px-4 sm:px-6 py-1 text-sm font-bold text-white rounded bg-lime-600 hover:scale-110 disabled:bg-gray-500 uppercase"
                                                >
                                                    Save
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="w-full flex flex-col items-center p-4 bg-gray-900">
                        <div className="flex w-full justify-between">
                            <button
                                className={'py-2 px-4 text-white bg-lime-600 rounded-md uppercase'}
                                onClick={() => {
                                    step > 1 && (setStep(step - 1), setLoadingScreen(true));
                                }}
                                disabled={step === 1}
                            >
                                Back
                            </button>
                            <div className={'flex flex-wrap justify-center space-x-2'}>
                                <button
                                    className={`py-2 px-4 text-white uppercase text-xl font-bold rounded-md ${
                                        step === 1 ? 'bg-lime-600' : 'bg-gray-700 hover:bg-lime-500'
                                    }`}
                                    onClick={() => {
                                        setStep(1);
                                        setLoadingScreen(true);
                                    }}
                                >
                                    {1}
                                </button>
                                {
                                    Array.from({ length: TotalPage }, (_, index) => index + 1)
                                        .slice(
                                            Math.max(1, step - 6), // Asegúrate de que no sea menor que 0
                                            Math.min(TotalPage - 1, step + 5), // Asegúrate de que no exceda el límite total
                                        )
                                        .map((page) => (
                                            <button
                                                key={page}
                                                className={`py-2 px-4 text-white uppercase text-xl font-bold rounded-md ${
                                                    step === page ? 'bg-lime-600' : 'bg-gray-700 hover:bg-lime-500'
                                                }`}
                                                onClick={() => {
                                                    setStep(page);
                                                    setLoadingScreen(true);
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))
                                }
                                <button
                                    className={`py-2 px-4 text-white uppercase text-xl font-bold rounded-md ${
                                        step === TotalPage ? 'bg-lime-600' : 'bg-gray-700 hover:bg-lime-500'
                                    }`}
                                    onClick={() => {
                                        setStep(TotalPage);
                                        setLoadingScreen(true);
                                    }}
                                >
                                    {TotalPage}
                                </button>
                            </div>
                            <button
                                className={'py-2 px-4 text-white bg-lime-600 rounded-md uppercase'}
                                onClick={() => {
                                    step < TotalPage && (setStep(step + 1), setLoadingScreen(true));
                                }}
                                disabled={step === TotalPage}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    theme="light"
                />
                {imageUpdateModal && selectedProduct && (
                    <ModalSmallProduct
                        product={selectedProduct}
                        onClose={() => {
                            setImageUpdateModal(false);
                            setSelectedProduct(null);
                        }}
                        onUpdate={handleUpdateProducts}
                        categories={categories}
                        matchCategory={(categories: categoriesInterface[], id_category: number): categoriesInterface =>
                            categories.find(cat => cat.id_category === id_category) || categories[0]
                        }
                        isUpdating={isUpdatingImage}
                    />
                )}

                {
                    previewUrl !== null && <ImageFullScreenPreview urlImage={previewUrl} setUrlImage={setPreviewUrl} />
                }
                {openModalSettings && (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-110 p-5">
                        <div className="flex flex-col w-1/4 bg-gray-100 p-5 rounded shadow-lg ">
                            <h3 className="text-lg font-semibold mb-3">Select Columns</h3>
                            {Object.entries(columnsSelector).map(([key, value]) => (
                                <label
                                    key={key}
                                    className="flex items-center mb-2 text-md text-gray-700"
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={value}
                                        onChange={() => handleCheckboxChange(key as keyof typeof columnsSelector)}
                                    />
                                    {key.replace(/_/g, ' ').toUpperCase()}
                                </label>
                            ))}
                            <div className="justify-start mx-5 mt-10">
                                <button
                                    onClick={() => setOpenModalSettings(false)}
                                    className="w-full px-4 py-2 text-sm font-bold text-white rounded bg-lime-600 hover:scale-110"
                                >
                                    ok
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    ) : null;
};

export default EditableProductTable;
