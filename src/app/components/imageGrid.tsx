import Image from "next/image";
import {useState, useEffect} from "react";
import {getTableName} from "../api/productos/prductosRF";
import RightClick from "./rightClick";
import { CardProduct, GridCardProduct} from "./card";
import { useProductContext } from "../context/productContext";
import {categoriesInterface} from "@/app/interfaces/categoryInterface";
import { ProductTypes } from "@/types/product";
import {getCategories} from "@/app/api/apiMongo/getCategories";
import {meta} from "eslint-plugin-react/lib/rules/jsx-props-no-spread-multi";
import category = meta.docs.category;
import {Simulate} from "react-dom/test-utils";
import contextMenu = Simulate.contextMenu;

interface Product {
    id: string;
    name: string;
    image: string;
    gridId?: number;
    descriptions?: string[] | undefined;
    key?: string;
}

interface ImageGridProps {
    onProductSelect: (gridId: number,categoryGridSelected:categoriesInterface, event: React.MouseEvent) => void;
    selectedProducts: ProductTypes[];
    onRemoveProduct: (productId: string) => void;
    onEditProduct: (productId: string) => void;
    onChangeProduct: (productId: string) => void;
    isMoveModeActive: boolean;
}
export let productTempDeleted: string;
export const deletedProducts: ProductTypes[] = [];
export let productsgrid2: ProductTypes[] = [];
export let productoA: ProductTypes = {
    id: "",
    name: "",
    image: "",
    gridId: undefined,
    descriptions: [],
    key: undefined
};

export const resetProductoA = (): void => {
    productoA = {
        id: "",
        name: "",
        image: "",
        gridId: undefined,
        descriptions: [],
        key: undefined
    };
};
export let productoB: ProductTypes = {
    id: "",
    name: "",
    image: "",
    gridId: undefined,
    descriptions: [],
    key: undefined
};

export const resetProductoB = (): void => {
    productoB = {
        id: "",
        name: "",
        image: "",
        gridId: undefined,
        descriptions: [],
        key: undefined
    };
};
export const ImageGrid = ({
                              onProductSelect,
                              selectedProducts,
                              onRemoveProduct,
                              onEditProduct,
                              onChangeProduct,
                              isMoveModeActive
                          }: ImageGridProps) => {
    const gridCells = [
        //meats
        {id: 1, top: "top-[21%] ", left: "left-[0%]", width: "23.5%", height: "6.5%",category:"Meat"},
        {id: 2, top: "top-[21%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%",category:"Meat"},
        {id: 3, top: "top-[21%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%",category:"Meat"},
        {id: 4, top: "top-[27.3%]", left: "left-[0%]", width: "23.5%", height: "6.5%",category:"Meat"},
        {id: 5, top: "top-[27.3%]", left: "left-[23.2%]", width: "23.5%", height: "6.5%",category:"Meat"},
        {id: 6, top: "top-[27.3%]", left: "left-[46.4%]", width: "23.5%", height: "6.5%",category:"Meat"},
        {id: 7, top: "top-[33.6%] ", left: "left-[0%]", width: "23.5%", height: "6.5%",category:"Meat"},
        {id: 8, top: "top-[33.6%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%",category:"Meat"},
        {id: 9, top: "top-[33.6%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%",category:"Meat"},
        //seaFood
        {id: 10, top: "top-[42%]", left: "left-0%", width: "14.5%", height: "6.4%",category:"SeaFood"},
        {id: 11, top: "top-[42%]", left: "left-[14.2%] ", width: "14.5%", height: "6.4%",category:"SeaFood"},
        {id: 12, top: "top-[42%]", left: "left-[28.4%] ", width: "14.5%", height: "6.4%",category:"SeaFood"},
        {id: 13, top: "top-[42%]", left: "left-[42.7%] ", width: "14.5%", height: "6.4%",category:"SeaFood"},
        {id: 14, top: "top-[42%]", left: "left-[57%] ", width: "14.5%", height: "6.4%",category:"SeaFood"},
        //SeaFood
        {id: 15, top: "top-[49.2%]", left: "left-[0]", width: "23.5%", height: "6.4%",category:"Deli"},
        {id: 16, top: "top-[49.2%]", left: "left-[23.9%] ", width: "23.5%", height: "6.4%",category:"Deli"},
        {id: 17, top: "top-[49.2%]", left: "left-[47.8%] ", width: "23.5%", height: "6.4%",category:"Deli"},
        //Grocery
        {id: 18, top: "top-[56.4%]", left: "left-[0%] ", width: "23.5%", height: "8.2%",category:"Grocery"},
        {id: 19, top: "top-[56.4%]", left: "left-[23.8%]", width: "23.5%", height: "8.2%",category:"Grocery"},
        {id: 20, top: "top-[56.4%]", left: "left-[47.5%]", width: "23.5%", height: "8.2%",category:"Grocery"},
        {id: 21, top: "top-[64.7%]", left: "left-[0%] ", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 22, top: "top-[64.7%]", left: "left-[18%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 23, top: "top-[64.7%]", left: "left-[35.5%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 24, top: "top-[64.7%]", left: "left-[53%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 25, top: "top-[71.5%]", left: "left-[0%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 26, top: "top-[71.5%]", left: "left-[18%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 27, top: "top-[71.5%]", left: "left-[35.5%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 28, top: "top-[71.5%]", left: "left-[53%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 29, top: "top-[78%]", left: "left-[0%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 30, top: "top-[78%]", left: "left-[18%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 31, top: "top-[78%]", left: "left-[35.5%]", width: "18%", height: "6.8%",category:"Grocery"},
        {id: 32, top: "top-[78%]", left: "left-[53%]", width: "18%", height: "6.8%",category:"Grocery"},
        //Dairy
        {id: 33, top: "top-[85.2%]", left: "left-[0%]", width: "18%", height: "6.4%",category:"Dairy"},
        {id: 34, top: "top-[85.2%]", left: "left-[18%]", width: "18%", height: "6.4%",category:"Dairy"},
        {id: 35, top: "top-[85.2%]", left: "left-[35.5%]", width: "18%", height: "6.4%",category:"Dairy"},
        {id: 36, top: "top-[85.2%]", left: "left-[53%]", width: "18%", height: "6.4%",category:"Dairy"},
        //froze
        {id: 37, top: "top-[92.2%]", left: "left-[0%]", width: "18%", height: "7%",category:"Dairy"},
        {id: 38, top: "top-[92.2%]", left: "left-[18%]", width: "18%", height: "7%",category:"Dairy"},
        {id: 39, top: "top-[92.2%]", left: "left-[35.5%]", width: "18%", height: "7%",category:"Dairy"},
        {id: 40, top: "top-[92.2%]", left: "left-[53%]", width: "18%", height: "7%",category:"Dairy"},
        //Produce
        {id: 41, top: "top-[20.5%]", left: "left-[72%]", width: "27%", height: "7.5%",category:"Produce"},
        {id: 42, top: "top-[27.9%]", left: "left-[72%]", width: "27%", height: "7.5%",category:"Produce"},
        {id: 43, top: "top-[35.3%]", left: "left-[72%]", width: "27%", height: "7.5%",category:"Produce"},
        {id: 44, top: "top-[42.7%]", left: "left-[72%]", width: "27%", height: "7.5%",category:"Produce"},
        {id: 45, top: "top-[50.1%]", left: "left-[72%]", width: "27%", height: "7.5%",category:"Produce"},
        {id: 46, top: "top-[57.5%]", left: "left-[72%]", width: "27%", height: "7.5%",category:"Produce"},
        {id: 47, top: "top-[64.9%]", left: "left-[72%]", width: "27%", height: "7.5%",category:"Produce"},
        {id: 48, top: "top-[72.3%]", left: "left-[72%]", width: "27%", height: "7.5%",category:"Produce"},
        {id: 49, top: "top-[79.7%]", left: "left-[72%]", width: "27%", height: "9%",category:"Produce"},
        {id: 50, top: "top-[88.5%]", left: "left-[72%]", width: "27%", height: "9%",category:"Produce"},
    ];
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const {productArray, setProductArray} = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: string;
    } | null>(null);

    //categorieas
    const [categories, setCategories] = useState<[categoriesInterface]|[]>([])

    const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;
        const selectedProduct = selectedProducts.find(p => p.gridId === cellId);
        if (selectedProduct) {
            setContextMenu({
                visible: true,
                x: e.clientX,
                y: e.clientY,
                productId: selectedProduct.id
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const getCategoriesView = async () => {
            const resp = await getCategories();
            if (resp.status === 200) {
                setCategories(resp.result);
            }
        }
        getCategoriesView();
    }, []);



    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page01.jpg" alt="PDF" width={400} height={400} priority/>
            {gridCells.map((cell, index) => {
                const selectedProduct = products?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);
                const categoryItem = categories.find((cat:categoriesInterface, index:number) =>(cell.category === cat.name_category));

                return (
                <GridCardProduct
                    product={selectedProduct!}
                    cell={cell}
                    onProductGridSelect={onProductSelect}
                    onContextMenu={handleContextMenu}
                    setProductArray={setProductArray}

                    categoryCard={categoryItem as categoriesInterface}
                />

                );
            })}

            {contextMenu?.visible && !isMoveModeActive && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 1000
                    }}
                >
                    <RightClick
                        productId={contextMenu.productId}
                        handleRemoveProduct={onRemoveProduct}
                        handleEditProduct={onEditProduct}
                        handleChangeProduct={onChangeProduct}
                    />
                </div>
            )}
        </div>
    );
};


export const ImageGrid2 = ({
                               onProductSelect,
                               selectedProducts,
                               isMoveModeActive,
                               onEditProduct,
                               onRemoveProduct,
                               onChangeProduct
                           }: ImageGridProps) => {
    const gridCells = [
        // Grocery
        {id: 51, top: "top-[1%] ", left: "left-[0%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 52, top: "top-[1%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 53, top: "top-[1%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 54, top: "top-[1%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 55, top: "top-[1%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 56, top: "top-[6.8%]", left: "left-[0%] ", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 57, top: "top-[6.8%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 58, top: "top-[6.8%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 59, top: "top-[6.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 60, top: "top-[6.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 61, top: "top-[12.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 62, top: "top-[12.5%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 63, top: "top-[12.5%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 64, top: "top-[12.5%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 65, top: "top-[12.5%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 66, top: "top-[18.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 67, top: "top-[18.2%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 68, top: "top-[18.2%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 69, top: "top-[18.2%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 70, top: "top-[18.2%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 71, top: "top-[23.9%]", left: "left-[0%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 72, top: "top-[23.9%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 73, top: "top-[23.9%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 74, top: "top-[23.9%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 75, top: "top-[23.9%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 76, top: "top-[29.6%]", left: "left-[0%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 77, top: "top-[29.6%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 78, top: "top-[29.6%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 79, top: "top-[29.6%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        {id: 80, top: "top-[29.6%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%",category:"Grocery"},
        //International
        {id: 81, top: "top-[36.3%]", left: "left-[0%]", width: "20.2%", height: "11%",category:"International"},
        {id: 82, top: "top-[36.3%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 83, top: "top-[36.3%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 84, top: "top-[36.3%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 85, top: "top-[36.3%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 86, top: "top-[41.8%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 87, top: "top-[41.8%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 88, top: "top-[41.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 89, top: "top-[41.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 90, top: "top-[47.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 91, top: "top-[47.5%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 92, top: "top-[47.5%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 93, top: "top-[47.5%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 94, top: "top-[47.5%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 95, top: "top-[53.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 96, top: "top-[53.2%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 97, top: "top-[53.2%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 98, top: "top-[53.2%]", left: "left-[60%]", width: "40%", height: "11.2%",category:"International"},
        {id: 99, top: "top-[59%]", left: "left-[0%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 100, top: "top-[59%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%",category:"International"},
        {id: 101, top: "top-[59%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%",category:"International"},
        //Breakfast
        {id: 102, top: "top-[65.8%]", left: "left-[0%]", width: "25.2%", height: "8.5%",category:"Breakfast"},
        {id: 103, top: "top-[65.8%]", left: "left-[25.2%]", width: "25.2%", height: "8.5%",category:"Breakfast"},
        {id: 104, top: "top-[65.8%]", left: "left-[50.4%]", width: "25.2%", height: "8.5%",category:"Breakfast"},
        {id: 105, top: "top-[65.8%]", left: "left-[75.6%]", width: "25.2%", height: "8.5%",category:"Breakfast"},
        {id: 106, top: "top-[74.3%]", left: "left-[0%]", width: "25.2%", height: "6.5%",category:"Breakfast"},
        {id: 107, top: "top-[74.3%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%",category:"Breakfast"},
        {id: 108, top: "top-[74.3%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%",category:"Breakfast"},
        {id: 109, top: "top-[74.3%]", left: "left-[75.6%]", width: "25.2%", height: "13.5%",category:"Breakfast"},
        {id: 110, top: "top-[80.8%]", left: "left-[0%]", width: "25.2%", height: "6.5%",category:"Breakfast"},
        {id: 111, top: "top-[80.8%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%",category:"Breakfast"},
        {id: 112, top: "top-[80.8%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%",category:"Breakfast"},
        //Snack
        {id: 113, top: "top-[89.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%",category:"Snack"},
        {id: 114, top: "top-[89.5%]", left: "left-[20.2%]", width: "20%", height: "5.5%",category:"Snack"},
        {id: 115, top: "top-[89.5%]", left: "left-[40.5%]", width: "19%", height: "5.5%",category:"Snack"},
        {id: 116, top: "top-[89.5%]", left: "left-[58.7%]", width: "20.2%", height: "5.5%",category:"Snack"},
        {id: 117, top: "top-[89.5%]", left: "left-[79.2%]", width: "20.8%", height: "10.5%",category:"Snack"},
        {id: 118, top: "top-[95%]", left: "left-[0%]", width: "20.2%", height: "4.8%",category:"Snack"},
        {id: 119, top: "top-[95%]", left: "left-[20.2%]", width: "20.2%", height: "4.8%",category:"Snack"},
        {id: 120, top: "top-[95%]", left: "left-[40.5%]", width: "19%", height: "4.8%",category:"Snack"},
        {id: 121, top: "top-[95%]", left: "left-[59.7%]", width: "20.2%", height: "4.8%",category:"Snack"},


    ];
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: string;
    } | null>(null);

    //categorieas
    const [categories, setCategories] = useState<[categoriesInterface]|[]>([])


    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            try {
                const productsData: ProductTypes[] = await getTableName();

                // Verificar si el array está vacío para llenarlo
                if (productsgrid2.length === 0) {
                    productsData.forEach((product) => {
                        // Verificar si el producto ya está en `productsgrid2`
                        const exists = productsgrid2.some((p) => p.id === product.id);
                        if (!exists) {
                            productsgrid2.push(product);
                        } else {
                            console.warn(`El producto con id ${product.id} ya existe en productsgrid2.`);
                        }
                    });
                    setProducts([productsgrid2[0]]);
                }

            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const getCategoriesView = async () => {
            const resp = await getCategories();
            if (resp.status === 200) {
                setCategories(resp.result);
            }
        }
        getCategoriesView();
    }, []);


    const removeDeletedProducts = (products: ProductTypes[], deletedProducts: ProductTypes[]): void => {
        // Filtrar los productos que no están en deletedProducts
        for (const deletedProduct of deletedProducts) {
            const index = products.findIndex((product) => product.id === deletedProduct.id);
            if (index !== -1) {
                products.splice(index, 1);
            }
        }
    };

    removeDeletedProducts(productsgrid2, deletedProducts);


    const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;

        // Obtener las coordenadas del clic derecho
        const container = e.currentTarget.closest('.scroll-container') as HTMLElement;
        const containerRect = container?.getBoundingClientRect();

        let posX = e.clientX;
        let posY = e.clientY;

        if (containerRect) {
            posX = e.clientX - containerRect.left + container.scrollLeft;
            posY = e.clientY - containerRect.top + container.scrollTop;
        }

        // Ajustar las coordenadas para evitar que el menú se salga de la pantalla
        const menuWidth = 150; // Ancho estimado del menú contextual
        const menuHeight = 200; // Alto estimado del menú contextual

        if (posX + menuWidth > window.innerWidth) {
            posX -= menuWidth;
        }
        if (posY + menuHeight > window.innerHeight) {
            posY -= menuHeight;
        }

        // Establecer el estado del menú contextual con las coordenadas ajustadas
        setContextMenu({
            visible: true,
            x: posX-125,
            y: posY,
            productId: cellId.toString(),
        });
    };


    //Eliminar Producto
    const handleClearCell = (cellId: string): void => {
        const cellIdNumber: number = parseInt(cellId, 10);
        const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
        productTempDeleted = '';
        if (elementIndex !== -1) {
            // Guardar el elemento en el array de productos eliminados
            deletedProducts.push(productsgrid2[elementIndex]);
            selectedProducts.length = 0;

            // Eliminar el elemento del array

        } else {
            console.log("Elemento no encontrado.");
        }

    };

    const handleInitChangeProduct = (Cellid: string): void => {
        const cellIdNumber: number = parseInt(Cellid, 10);
        const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
        if (elementIndex !== -1) {
            productoA = productsgrid2[elementIndex];
        }

    }
    const handleChangeProducts = (cellId: string): void => {
        const cellIdNumber = parseInt(cellId, 10);
        if (productoA.gridId != undefined && productoA.gridId != cellIdNumber) {
            const elementIndex: number = productsgrid2.findIndex((p: Product | null): boolean => p?.gridId === cellIdNumber);

            // Si se encuentra la celda (puede ser vacía)
            if (elementIndex !== -1) {
                let productoB = productsgrid2[elementIndex];

                // Si la celda está vacía (es null o undefined), crear un objeto vacío para `productoB`
                if (!productoB) {
                    productoB = {id: "", image: "", name: "", gridId: cellIdNumber, descriptions: []};
                }

                // Intercambiar las posiciones (gridId) de `productoA` y `productoB`
                const tempGridId = productoA.gridId;
                productoA.gridId = productoB.gridId;
                productoB.gridId = tempGridId;

                // Actualizar el array `productsgrid2` con los cambios
                productsgrid2[elementIndex] = productoB;

                // Si `productoA` también pertenece a `productsgrid2`, actualizarlo también
                const indexA = productsgrid2.findIndex((p: Product): boolean => p?.id === productoA.id);
                if (indexA !== -1) {
                    productsgrid2[indexA] = productoA;
                }

                setProducts([productoB]);
            }
            resetProductoA();
            resetProductoB();
        }
        products.length = 0;
    };


    const addProductIfAbsent = (product: ProductTypes): void => {

        if (product.id !== productTempDeleted) {

            const existsInProductinArray = productsgrid2.some((p) => p.id === product.id);

            if (!existsInProductinArray) {
                productsgrid2.push(product);
                productTempDeleted = product.id;
                selectedProducts.length = 0;
            }

        }

    };
    useEffect(() => {

        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Función helper para verificar si una celda tiene producto
    const hasProductInCell = (cellId: number): boolean => {
        const hasProduct = productsgrid2.some(p => p.gridId === cellId) ||
                          selectedProducts.some(p => p.gridId === cellId);
        return hasProduct;
    }

    // Función para obtener el producto de una celda específica
    const getProductInCell = (cellId: number): ProductTypes | undefined => {
        return productsgrid2.find(p => p.gridId === cellId) ||
               selectedProducts.find(p => p.gridId === cellId);
    }

    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page02.jpg" alt="PDF" width={360} height={360} priority/>
            {gridCells.map((cell, index) => {


                const selectedProduct = productsgrid2?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);
                const categoryItem = categories.find((cat:categoriesInterface, index:number) =>(cell.category === cat.name_category));

                if (selectedProduct !== undefined && productTempDeleted !== selectedProduct.id) {
                    addProductIfAbsent(selectedProduct);
                }
                return (
                    <GridCardProduct
                        product={selectedProduct!}
                        cell={cell}
                        //@ts-ignore
                        onProductGridSelect={onProductSelect}
                        handleChangeProducts={handleChangeProducts}
                        onContextMenu={handleContextMenu}

                        categoryCard={categoryItem as categoriesInterface}
                    />

                );
            })}


            {contextMenu?.visible && (
                <div
                    style={{
                        position: 'fixed', // Se asegura de usar fixed para alinear con el viewport
                        top: `${contextMenu.y}px`, // Posicionamiento vertical basado en las coordenadas ajustadas del clic
                        left: `${contextMenu.x}px`, // Posicionamiento horizontal basado en las coordenadas ajustadas del clic
                        zIndex: 1000,
                    }}
                >
                    <RightClick
                        productId={contextMenu.productId}
                        handleRemoveProduct={handleClearCell}
                        handleEditProduct={onEditProduct}
                        handleChangeProduct={handleInitChangeProduct}
                    />
                </div>
            )}

        </div>
    );

};

export const ImageGrid3 = ({
                               onProductSelect,
                               selectedProducts,
                               isMoveModeActive,
                               onEditProduct,
                               onRemoveProduct,
                               onChangeProduct
                           }: ImageGridProps) => {
    const gridCells = [
        {id: 301, top: "top-[1.8%] ", left: "left-[0%]", width: "23.2%", height: "7.8%",category:"Dairy"},
        {id: 302, top: "top-[1.8%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%",category:"Dairy"},
        {id: 303, top: "top-[1.8%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%",category:"Dairy"},
        {id: 304, top: "top-[9.8%]", left: "left-[0%]", width: "23.2%", height: "7.8%",category:"Dairy"},
        {id: 305, top: "top-[9.8%]", left: "left-[23.2%]", width: "23.2%", height: "7.8%",category:"Dairy"},
        {id: 306, top: "top-[9.8%]", left: "left-[45.5%] ", width: "23.2%", height: "7.8%",category:"Dairy"},
        {id: 307, top: "top-[18%] ", left: "left-[0%]", width: "23.2%", height: "7.8%",category:"Dairy"},
        {id: 308, top: "top-[18%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%",category:"Dairy"},
        {id: 309, top: "top-[18%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%",category:"Dairy"},
        {id: 310, top: "top-[27.9%]", left: "left-[0%]", width: "14.5%", height: "8%",category:"Dairy"},
        {id: 311, top: "top-[27.9%]", left: "left-[14.4%] ", width: "14%", height: "8%",category:"Dairy"},
        {id: 312, top: "top-[27.9%]", left: "left-[28.6%] ", width: "14%", height: "8%",category:"Dairy"},
        {id: 313, top: "top-[27.9%]", left: "left-[42.8%] ", width: "14%", height: "8%",category:"Dairy"},
        {id: 314, top: "top-[27.9%]", left: "left-[57%] ", width: "14%", height: "8%",category:"Dairy"},
        {id: 315, top: "top-[36.8%]", left: "left-[0%]", width: "23.5%", height: "8%",category:"Dairy"},
        {id: 316, top: "top-[36.8%]", left: "left-[24.2%] ", width: "23%", height: "8%",category:"Dairy"},
        {id: 317, top: "top-[36.8%]", left: "left-[47.5%] ", width: "23%", height: "8%",category:"Dairy"},
        {id: 318, top: "top-[45.8%]", left: "left-[0%]", width: "23%", height: "9.8%",category:"Dairy"},
        {id: 319, top: "top-[45.8%]", left: "left-[23.2%]", width: "23%", height: "9.8%",category:"Dairy"},
        {id: 320, top: "top-[45.8%]", left: "left-[46.5%]", width: "23%", height: "9.8%",category:"Dairy"},
        {id: 321, top: "top-[55.8%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 322, top: "top-[55.8%]", left: "left-[17.4%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 323, top: "top-[55.8%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 324, top: "top-[55.8%]", left: "left-[53.2%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 325, top: "top-[64.5%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 326, top: "top-[64.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 327, top: "top-[64.5%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 328, top: "top-[64.5%]", left: "left-[53.2%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 329, top: "top-[72.6%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 330, top: "top-[72.6%]", left: "left-[17.4%] ", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 331, top: "top-[72.6%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 332, top: "top-[72.6%]", left: "left-[53%] ", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 333, top: "top-[81.5%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 334, top: "top-[81.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 335, top: "top-[81.5%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 336, top: "top-[81.5%]", left: "left-[53%] ", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 337, top: "top-[90.5%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 338, top: "top-[90.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 339, top: "top-[90.5%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 340, top: "top-[90.5%]", left: "left-[53%]", width: "18%", height: "8.2%",category:"Dairy"},
        {id: 341, top: "top-[1.1%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Dairy"},
        {id: 342, top: "top-[10.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Dairy"},
        {id: 343, top: "top-[19.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Dairy"},
        {id: 344, top: "top-[28.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Dairy"},
        {id: 345, top: "top-[37.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Dairy"},
        {id: 346, top: "top-[46.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Dairy"},
        {id: 347, top: "top-[55.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Dairy"},
        {id: 348, top: "top-[64.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Dairy"},
        {id: 349, top: "top-[73.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%",category:"Dairy"},
        {id: 350, top: "top-[84.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%",category:"Dairy"},

    ];

    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: string;
    } | null>(null);

    //categories
    const [categories, setCategories] = useState<[categoriesInterface]|[]>([])

    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            try {
                const productsData: ProductTypes[] = await getTableName();

                // Verificar si el array está vacío para llenarlo
                if (productsgrid2.length === 0) {
                    productsData.forEach((product) => {
                        // Verificar si el producto ya está en `productsgrid2`
                        const exists = productsgrid2.some((p) => p.id === product.id);
                        if (!exists) {
                            productsgrid2.push(product);
                        } else {
                            console.warn(`El producto con id ${product.id} ya existe en productsgrid2.`);
                        }
                    });
                    setProducts([productsgrid2[0]]);
                }

            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const getCategoriesView = async () => {
            const resp = await getCategories();
            if (resp.status === 200) {
                setCategories(resp.result);
            }
        }
        getCategoriesView();
    }, []);

    const removeDeletedProducts = (products: ProductTypes[], deletedProducts: ProductTypes[]): void => {
        // Filtrar los productos que no están en deletedProducts
        for (const deletedProduct of deletedProducts) {
            const index = products.findIndex((product) => product.id === deletedProduct.id);
            if (index !== -1) {
                products.splice(index, 1);
            }
        }
    };

    removeDeletedProducts(productsgrid2, deletedProducts);


    const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;


        // Obtener las coordenadas del clic derecho
        const container = e.currentTarget.closest('.scroll-container') as HTMLElement;
        const containerRect = container?.getBoundingClientRect();

        let posX = e.clientX;
        let posY = e.clientY;

        if (containerRect) {
            posX = e.clientX - containerRect.left + container.scrollLeft;
            posY = e.clientY - containerRect.top + container.scrollTop;
        }

        // Ajustar las coordenadas para evitar que el menú se salga de la pantalla
        const menuWidth = 150; // Ancho estimado del menú contextual
        const menuHeight = 200; // Alto estimado del menú contextual

        if (posX + menuWidth > window.innerWidth) {
            posX -= menuWidth;
        }
        if (posY + menuHeight > window.innerHeight) {
            posY -= menuHeight;
        }

        // Establecer el estado del menú contextual con las coordenadas ajustadas
        setContextMenu({
            visible: true,
            x: posX,
            y: posY - 50,
            productId: cellId.toString(),
        });
    };
    const handleClearCell = (cellId: string): void => {
        const cellIdNumber: number = parseInt(cellId, 10);
        const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
        productTempDeleted = '';
        if (elementIndex !== -1) {
            // Guardar el elemento en el array de productos eliminados
            deletedProducts.push(productsgrid2[elementIndex]);
            selectedProducts.length = 0;

            // Eliminar el elemento del array

        } else {
            console.log("Elemento no encontrado.");
        }

    };

    const handleInitChangeProduct = (Cellid: string): void => {
        const cellIdNumber: number = parseInt(Cellid, 10);
        const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
        if (elementIndex !== -1) {
            productoA = productsgrid2[elementIndex];
        }

    }

    const handleChangeProducts = (cellId: string): void => {
        const cellIdNumber = parseInt(cellId, 10);
        if (productoA.gridId != undefined && productoA.gridId != cellIdNumber) {
            const elementIndex: number = productsgrid2.findIndex((p: Product | null): boolean => p?.gridId === cellIdNumber);

            // Si se encuentra la celda (puede ser vacía)
            if (elementIndex !== -1) {
                let productoB = productsgrid2[elementIndex];

                // Si la celda está vacía (es null o undefined), crear un objeto vacío para `productoB`
                if (!productoB) {
                    productoB = {id: "", image: "", name: "", gridId: cellIdNumber, descriptions: []};
                }

                // Intercambiar las posiciones (gridId) de `productoA` y `productoB`
                const tempGridId = productoA.gridId;
                productoA.gridId = productoB.gridId;
                productoB.gridId = tempGridId;

                // Actualizar el array `productsgrid2` con los cambios
                productsgrid2[elementIndex] = productoB;

                // Si `productoA` también pertenece a `productsgrid2`, actualizarlo también
                const indexA = productsgrid2.findIndex((p: Product): boolean => p?.id === productoA.id);
                if (indexA !== -1) {
                    productsgrid2[indexA] = productoA;
                }

                setProducts([productoB]);
            }
            resetProductoA();
            resetProductoB();
        }
        products.length = 0;
    };

    const addProductIfAbsent = (product: ProductTypes): void => {

        if (product.id !== productTempDeleted) {

            const existsInProductinArray = productsgrid2.some((p) => p.id === product.id);

            if (!existsInProductinArray) {
                productsgrid2.push(product);
                productTempDeleted = product.id;
                selectedProducts.length = 0;
            }

        }

    };

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
     // Función helper para verificar si una celda tiene producto
     const hasProductInCell = (cellId: number): boolean => {
        const hasProduct = productsgrid2.some(p => p.gridId === cellId) ||
                          selectedProducts.some(p => p.gridId === cellId);
        return hasProduct;
    }

    // Función para obtener el producto de una celda específica
    const getProductInCell = (cellId: number): ProductTypes | undefined => {
        return productsgrid2.find(p => p.gridId === cellId) ||
               selectedProducts.find(p => p.gridId === cellId);
    }

    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page04.jpg" alt="PDF" width={400} height={400} priority/>
            {gridCells.map((cell, index) => {
                const selectedProduct = productsgrid2?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);

                const categoryItem = categories.find((cat:categoriesInterface, index:number) =>(cell.category === cat.name_category));

                if (selectedProduct !== undefined && productTempDeleted !== selectedProduct.id) {
                    addProductIfAbsent(selectedProduct);
                }
                return (
                    <GridCardProduct
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={onProductSelect}
                        handleChangeProducts={handleChangeProducts}
                        onContextMenu={handleContextMenu}
                        categoryCard={categoryItem as categoriesInterface}
                    />
                );
            })}


            {contextMenu?.visible && (
                <div
                    style={{
                        position: 'fixed', // Asegúrate de usar fixed para alinear con el viewport
                        top: `${contextMenu.y}px`,
                        left: `${contextMenu.x}px`,
                        zIndex: 1000,
                    }}
                >
                    <RightClick
                        productId={contextMenu.productId}
                        handleRemoveProduct={handleClearCell}
                        handleEditProduct={onEditProduct}
                        handleChangeProduct={handleInitChangeProduct}
                    />
                </div>
            )}
        </div>
    );
};

export const ImageGrid4 = ({
                               onProductSelect,
                               selectedProducts,
                               isMoveModeActive,
                               onEditProduct,
                               onRemoveProduct,
                               onChangeProduct
                           }: ImageGridProps) => {
    const gridCells = [
        {id: 401, top: "top-[1.8%] ", left: "left-[0%]", width: "23.2%", height: "7.8%",category:"Breakfast"},
        {id: 402, top: "top-[1.8%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%",category:"Breakfast"},
        {id: 403, top: "top-[1.8%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%",category:"Breakfast"},
        {id: 404, top: "top-[9.8%]", left: "left-[0%]", width: "23.2%", height: "7.8%",category:"Breakfast"},
        {id: 405, top: "top-[9.8%]", left: "left-[23.2%]", width: "23.2%", height: "7.8%",category:"Breakfast"},
        {id: 406, top: "top-[9.8%]", left: "left-[45.5%] ", width: "23.2%", height: "7.8%",category:"Breakfast"},
        {id: 407, top: "top-[18%] ", left: "left-[0%]", width: "23.2%", height: "7.8%",category:"Breakfast"},
        {id: 408, top: "top-[18%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%",category:"Breakfast"},
        {id: 409, top: "top-[18%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%",category:"Breakfast"},
        {id: 410, top: "top-[27.9%]", left: "left-[0%]", width: "14.5%", height: "8%",category:"Breakfast"},
        {id: 411, top: "top-[27.9%]", left: "left-[14.4%] ", width: "14%", height: "8%",category:"Breakfast"},
        {id: 412, top: "top-[27.9%]", left: "left-[28.6%] ", width: "14%", height: "8%",category:"Breakfast"},
        {id: 413, top: "top-[27.9%]", left: "left-[42.8%] ", width: "14%", height: "8%",category:"Breakfast"},
        {id: 414, top: "top-[27.9%]", left: "left-[57%] ", width: "14%", height: "8%",category:"Breakfast"},
        {id: 415, top: "top-[36.8%]", left: "left-[0%]", width: "23.5%", height: "8%",category:"Breakfast"},
        {id: 416, top: "top-[36.8%]", left: "left-[24.2%] ", width: "23%", height: "8%",category:"Breakfast"},
        {id: 417, top: "top-[36.8%]", left: "left-[47.5%] ", width: "23%", height: "8%",category:"Breakfast"},
        {id: 418, top: "top-[45.8%]", left: "left-[0%]", width: "23%", height: "9.8%",category:"Breakfast"},
        {id: 419, top: "top-[45.8%]", left: "left-[23.2%]", width: "23%", height: "9.8%",category:"Breakfast"},
        {id: 420, top: "top-[45.8%]", left: "left-[46.5%]", width: "23%", height: "9.8%",category:"Breakfast"},
        {id: 421, top: "top-[55.8%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 422, top: "top-[55.8%]", left: "left-[17.4%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 423, top: "top-[55.8%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 424, top: "top-[55.8%]", left: "left-[53.2%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 425, top: "top-[64.5%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 426, top: "top-[64.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 427, top: "top-[64.5%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 428, top: "top-[64.5%]", left: "left-[53.2%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 429, top: "top-[72.6%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 430, top: "top-[72.6%]", left: "left-[17.4%] ", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 431, top: "top-[72.6%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 432, top: "top-[72.6%]", left: "left-[53%] ", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 433, top: "top-[81.5%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 434, top: "top-[81.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 435, top: "top-[81.5%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 436, top: "top-[81.5%]", left: "left-[53%] ", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 437, top: "top-[90.5%]", left: "left-[0%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 438, top: "top-[90.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 439, top: "top-[90.5%]", left: "left-[35%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 440, top: "top-[90.5%]", left: "left-[53%]", width: "18%", height: "8.2%",category:"Breakfast"},
        {id: 441, top: "top-[1.1%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Breakfast"},
        {id: 442, top: "top-[10.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Breakfast"},
        {id: 443, top: "top-[19.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Breakfast"},
        {id: 444, top: "top-[28.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Breakfast"},
        {id: 445, top: "top-[37.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Breakfast"},
        {id: 446, top: "top-[46.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Breakfast"},
        {id: 447, top: "top-[55.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Breakfast"},
        {id: 448, top: "top-[64.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%",category:"Breakfast"},
        {id: 449, top: "top-[73.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%",category:"Breakfast"},
        {id: 450, top: "top-[84.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%",category:"Breakfast"},

    ];

    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: string;
    } | null>(null);

    //categories
    const [categories, setCategories] = useState<[categoriesInterface]|[]>([])

    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            try {
                const productsData: ProductTypes[] = await getTableName();

                // Verificar si el array está vacío para llenarlo
                if (productsgrid2.length === 0) {
                    productsData.forEach((product) => {
                        // Verificar si el producto ya está en `productsgrid2`
                        const exists = productsgrid2.some((p) => p.id === product.id);
                        if (!exists) {
                            productsgrid2.push(product);
                        } else {
                            console.warn(`El producto con id ${product.id} ya existe en productsgrid2.`);
                        }
                    });
                    setProducts([productsgrid2[0]]);
                }

            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const getCategoriesView = async () => {
            const resp = await getCategories();
            if (resp.status === 200) {
                setCategories(resp.result);
            }
        }
        getCategoriesView();
    }, []);

    const removeDeletedProducts = (products: ProductTypes[], deletedProducts: ProductTypes[]): void => {
        // Filtrar los productos que no están en deletedProducts
        for (const deletedProduct of deletedProducts) {
            const index = products.findIndex((product) => product.id === deletedProduct.id);
            if (index !== -1) {
                products.splice(index, 1);
            }
        }
    };

    removeDeletedProducts(productsgrid2, deletedProducts);
    const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;


        // Obtener las coordenadas del clic derecho
        const container = e.currentTarget.closest('.scroll-container') as HTMLElement;
        const containerRect = container?.getBoundingClientRect();

        let posX = e.clientX;
        let posY = e.clientY;

        if (containerRect) {
            posX = e.clientX - containerRect.left + container.scrollLeft;
            posY = e.clientY - containerRect.top + container.scrollTop;
        }

        // Ajustar las coordenadas para evitar que el menú se salga de la pantalla
        const menuWidth = 150; // Ancho estimado del menú contextual
        const menuHeight = 200; // Alto estimado del menú contextual

        if (posX + menuWidth > window.innerWidth) {
            posX -= menuWidth;
        }
        if (posY + menuHeight > window.innerHeight) {
            posY -= menuHeight;
        }

        // Establecer el estado del menú contextual con las coordenadas ajustadas
        setContextMenu({
            visible: true,
            x: posX,
            y: posY - 50,
            productId: cellId.toString(),
        });
    };
    const handleClearCell = (cellId: string): void => {
        const cellIdNumber: number = parseInt(cellId, 10);
        const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
        productTempDeleted = '';
        if (elementIndex !== -1) {
            // Guardar el elemento en el array de productos eliminados
            deletedProducts.push(productsgrid2[elementIndex]);
            selectedProducts.length = 0;

            // Eliminar el elemento del array

        } else {
            console.log("Elemento no encontrado.");
        }

    };

    const handleInitChangeProduct = (Cellid: string): void => {
        const cellIdNumber: number = parseInt(Cellid, 10);
        const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
        if (elementIndex !== -1) {
            productoA = productsgrid2[elementIndex];
        }

    }

    const handleChangeProducts = (cellId: string): void => {
        const cellIdNumber = parseInt(cellId, 10);
        if (productoA.gridId != undefined && productoA.gridId != cellIdNumber) {
            const elementIndex: number = productsgrid2.findIndex((p: Product | null): boolean => p?.gridId === cellIdNumber);

            // Si se encuentra la celda (puede ser vacía)
            if (elementIndex !== -1) {
                let productoB = productsgrid2[elementIndex];

                // Si la celda está vacía (es null o undefined), crear un objeto vacío para `productoB`
                if (!productoB) {
                    productoB = {id: "", image: "", name: "", gridId: cellIdNumber, descriptions: []};
                }

                // Intercambiar las posiciones (gridId) de `productoA` y `productoB`
                const tempGridId = productoA.gridId;
                productoA.gridId = productoB.gridId;
                productoB.gridId = tempGridId;

                // Actualizar el array `productsgrid2` con los cambios
                productsgrid2[elementIndex] = productoB;

                // Si `productoA` también pertenece a `productsgrid2`, actualizarlo también
                const indexA = productsgrid2.findIndex((p: Product): boolean => p?.id === productoA.id);
                if (indexA !== -1) {
                    productsgrid2[indexA] = productoA;
                }

                setProducts([productoB]);
            }
            resetProductoA();
            resetProductoB();
        }
        products.length = 0;
    };

    const addProductIfAbsent = (product: ProductTypes): void => {

        if (product.id !== productTempDeleted) {

            const existsInProductinArray = productsgrid2.some((p) => p.id === product.id);

            if (!existsInProductinArray) {
                productsgrid2.push(product);
                productTempDeleted = product.id;
                selectedProducts.length = 0;
            }

        }

    };
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page04.jpg" alt="PDF" width={400} height={400} priority/>
            {gridCells.map((cell, index) => {
                const selectedProduct = productsgrid2?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);

                const categoryItem = categories.find((cat:categoriesInterface, index:number) =>(cell.category === cat.name_category));

                if (selectedProduct !== undefined && productTempDeleted !== selectedProduct.id) {
                    addProductIfAbsent(selectedProduct);
                }
                return (
                    <GridCardProduct
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={onProductSelect}
                        handleChangeProducts={handleChangeProducts}
                        onContextMenu={handleContextMenu}
                        categoryCard={categoryItem as categoriesInterface}
                    />
                );
            })}


            {contextMenu?.visible && (
                <div
                    style={{
                        position: 'fixed', // Asegúrate de usar fixed para alinear con el viewport
                        top: `${contextMenu.y}px`,
                        left: `${contextMenu.x}px`,
                        zIndex: 1000,
                    }}
                >
                    <RightClick
                        productId={contextMenu.productId}
                        handleRemoveProduct={handleClearCell}
                        handleEditProduct={onEditProduct}
                        handleChangeProduct={handleInitChangeProduct}
                    />
                </div>
            )}
        </div>
    );
};

