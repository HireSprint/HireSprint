import Image from "next/image";
import {useState, useEffect} from "react";
import {getTableName} from "../api/productos/prductosRF";
import RightClick from "./rightClick";
import { CardProduct, GridCardProduct} from "./card";
import { useProductContext } from "../context/productContext";
import { ProductTypes } from "@/types/product";

interface Product {
    id: string;
    name: string;
    image: string;
    gridId?: number;
    descriptions?: string[] | undefined;
    key?: string;
}

interface ImageGridProps {
    onProductSelect: (gridId: number, event: React.MouseEvent) => void;
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
        {id: 1, top: "top-[21%] ", left: "left-[0%]", width: "23.5%", height: "6.5%"},
        {id: 2, top: "top-[21%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%"},
        {id: 3, top: "top-[21%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%"},
        {id: 4, top: "top-[27.3%]", left: "left-[0%]", width: "23.5%", height: "6.5%"},
        {id: 5, top: "top-[27.3%]", left: "left-[23.2%]", width: "23.5%", height: "6.5%"},
        {id: 6, top: "top-[27.3%]", left: "left-[46.4%]", width: "23.5%", height: "6.5%"},
        {id: 7, top: "top-[33.6%] ", left: "left-[0%]", width: "23.5%", height: "6.5%"},
        {id: 8, top: "top-[33.6%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%"},
        {id: 9, top: "top-[33.6%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%"},
        {id: 10, top: "top-[42%]", left: "left-0%", width: "14.5%", height: "6.4%"},
        {id: 11, top: "top-[42%]", left: "left-[14.2%] ", width: "14.5%", height: "6.4%"},
        {id: 12, top: "top-[42%]", left: "left-[28.4%] ", width: "14.5%", height: "6.4%"},
        {id: 13, top: "top-[42%]", left: "left-[42.7%] ", width: "14.5%", height: "6.4%"},
        {id: 14, top: "top-[42%]", left: "left-[57%] ", width: "14.5%", height: "6.4%"},
        {id: 15, top: "top-[49.2%]", left: "left-[0]", width: "23.5%", height: "6.4%"},
        {id: 16, top: "top-[49.2%]", left: "left-[23.9%] ", width: "23.5%", height: "6.4%"},
        {id: 17, top: "top-[49.2%]", left: "left-[47.8%] ", width: "23.5%", height: "6.4%"},
        {id: 18, top: "top-[56.4%]", left: "left-[0%] ", width: "23.5%", height: "8.2%"},
        {id: 19, top: "top-[56.4%]", left: "left-[23.8%]", width: "23.5%", height: "8.2%"},
        {id: 20, top: "top-[56.4%]", left: "left-[47.5%]", width: "23.5%", height: "8.2%"},
        {id: 21, top: "top-[64.7%]", left: "left-[0%] ", width: "18%", height: "6.8%"},
        {id: 22, top: "top-[64.7%]", left: "left-[18%]", width: "18%", height: "6.8%"},
        {id: 23, top: "top-[64.7%]", left: "left-[35.5%]", width: "18%", height: "6.8%"},
        {id: 24, top: "top-[64.7%]", left: "left-[53%]", width: "18%", height: "6.8%"},
        {id: 25, top: "top-[71.5%]", left: "left-[0%]", width: "18%", height: "6.8%"},
        {id: 26, top: "top-[71.5%]", left: "left-[18%]", width: "18%", height: "6.8%"},
        {id: 27, top: "top-[71.5%]", left: "left-[35.5%]", width: "18%", height: "6.8%"},
        {id: 28, top: "top-[71.5%]", left: "left-[53%]", width: "18%", height: "6.8%"},
        {id: 29, top: "top-[78%]", left: "left-[0%]", width: "18%", height: "6.8%"},
        {id: 30, top: "top-[78%]", left: "left-[18%]", width: "18%", height: "6.8%"},
        {id: 31, top: "top-[78%]", left: "left-[35.5%]", width: "18%", height: "6.8%"},
        {id: 32, top: "top-[78%]", left: "left-[53%]", width: "18%", height: "6.8%"},
        {id: 33, top: "top-[85.2%]", left: "left-[0%]", width: "18%", height: "6.4%"},
        {id: 34, top: "top-[85.2%]", left: "left-[18%]", width: "18%", height: "6.4%"},
        {id: 35, top: "top-[85.2%]", left: "left-[35.5%]", width: "18%", height: "6.4%"},
        {id: 36, top: "top-[85.2%]", left: "left-[53%]", width: "18%", height: "6.4%"},
        {id: 37, top: "top-[92.2%]", left: "left-[0%]", width: "18%", height: "7%"},
        {id: 38, top: "top-[92.2%]", left: "left-[18%]", width: "18%", height: "7%"},
        {id: 39, top: "top-[92.2%]", left: "left-[35.5%]", width: "18%", height: "7%"},
        {id: 40, top: "top-[92.2%]", left: "left-[53%]", width: "18%", height: "7%"},
        {id: 41, top: "top-[20.5%]", left: "left-[72%]", width: "27%", height: "7.5%"},
        {id: 42, top: "top-[27.9%]", left: "left-[72%]", width: "27%", height: "7.5%"},
        {id: 43, top: "top-[35.3%]", left: "left-[72%]", width: "27%", height: "7.5%"},
        {id: 44, top: "top-[42.7%]", left: "left-[72%]", width: "27%", height: "7.5%"},
        {id: 45, top: "top-[50.1%]", left: "left-[72%]", width: "27%", height: "7.5%"},
        {id: 46, top: "top-[57.5%]", left: "left-[72%]", width: "27%", height: "7.5%"},
        {id: 47, top: "top-[64.9%]", left: "left-[72%]", width: "27%", height: "7.5%"},
        {id: 48, top: "top-[72.3%]", left: "left-[72%]", width: "27%", height: "7.5%"},
        {id: 49, top: "top-[79.7%]", left: "left-[72%]", width: "27%", height: "9%"},
        {id: 50, top: "top-[88.5%]", left: "left-[72%]", width: "27%", height: "9%"},
    ];
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const {productArray, setProductArray} = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: string;
    } | null>(null);


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
 

    
    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page01.jpg" alt="PDF" width={400} height={400} priority/>
            {gridCells.map((cell, index) => {
                const selectedProduct = products?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);
                return ( 
                <GridCardProduct 
                    product={selectedProduct!}  
                    cell={cell}
                    onProductGridSelect={onProductSelect}
                    onContextMenu={handleContextMenu}
                    setProductArray={setProductArray}
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
        {id: 51, top: "top-[1%] ", left: "left-[0%]", width: "20.2%", height: "5.5%"},
        {id: 52, top: "top-[1%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%"},
        {id: 53, top: "top-[1%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%"},
        {id: 54, top: "top-[1%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%"},
        {id: 55, top: "top-[1%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%"},
        {id: 56, top: "top-[6.8%]", left: "left-[0%] ", width: "20.2%", height: "5.5%"},
        {id: 57, top: "top-[6.8%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%"},
        {id: 58, top: "top-[6.8%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%"},
        {id: 59, top: "top-[6.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%"},
        {id: 60, top: "top-[6.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%"},
        {id: 61, top: "top-[12.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%"},
        {id: 62, top: "top-[12.5%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%"},
        {id: 63, top: "top-[12.5%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%"},
        {id: 64, top: "top-[12.5%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%"},
        {id: 65, top: "top-[12.5%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%"},
        {id: 66, top: "top-[18.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%"},
        {id: 67, top: "top-[18.2%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%"},
        {id: 68, top: "top-[18.2%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%"},
        {id: 69, top: "top-[18.2%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%"},
        {id: 70, top: "top-[18.2%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%"},
        {id: 71, top: "top-[23.9%]", left: "left-[0%]", width: "20.2%", height: "5.5%"},
        {id: 72, top: "top-[23.9%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%"},
        {id: 73, top: "top-[23.9%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%"},
        {id: 74, top: "top-[23.9%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%"},
        {id: 75, top: "top-[23.9%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%"},
        {id: 76, top: "top-[29.6%]", left: "left-[0%]", width: "20.2%", height: "5.5%"},
        {id: 77, top: "top-[29.6%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%"},
        {id: 78, top: "top-[29.6%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%"},
        {id: 79, top: "top-[29.6%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%"},
        {id: 80, top: "top-[29.6%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%"},
        {id: 81, top: "top-[36.3%]", left: "left-[0%]", width: "20.2%", height: "11%"},
        {id: 82, top: "top-[36.3%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%"},
        {id: 83, top: "top-[36.3%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%"},
        {id: 84, top: "top-[36.3%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%"},
        {id: 85, top: "top-[36.3%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%"},
        {id: 86, top: "top-[41.8%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%"},
        {id: 87, top: "top-[41.8%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%"},
        {id: 88, top: "top-[41.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%"},
        {id: 89, top: "top-[41.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%"},
        {id: 90, top: "top-[47.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%"},
        {id: 91, top: "top-[47.5%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%"},
        {id: 92, top: "top-[47.5%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%"},
        {id: 93, top: "top-[47.5%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%"},
        {id: 94, top: "top-[47.5%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%"},
        {id: 95, top: "top-[53.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%"},
        {id: 96, top: "top-[53.2%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%"},
        {id: 97, top: "top-[53.2%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%"},
        {id: 98, top: "top-[53.2%]", left: "left-[60%]", width: "40%", height: "11.2%"},
        {id: 99, top: "top-[59%]", left: "left-[0%]", width: "20.2%", height: "5.5%"},
        {id: 100, top: "top-[59%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%"},
        {id: 101, top: "top-[59%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%"},
        {id: 102, top: "top-[65.8%]", left: "left-[0%]", width: "25.2%", height: "8.5%"},
        {id: 103, top: "top-[65.8%]", left: "left-[25.2%]", width: "25.2%", height: "8.5%"},
        {id: 104, top: "top-[65.8%]", left: "left-[50.4%]", width: "25.2%", height: "8.5%"},
        {id: 105, top: "top-[65.8%]", left: "left-[75.6%]", width: "25.2%", height: "8.5%"},
        {id: 106, top: "top-[74.3%]", left: "left-[0%]", width: "25.2%", height: "6.5%"},
        {id: 107, top: "top-[74.3%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%"},
        {id: 108, top: "top-[74.3%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%"},
        {id: 109, top: "top-[74.3%]", left: "left-[75.6%]", width: "25.2%", height: "13.5%"},
        {id: 110, top: "top-[80.8%]", left: "left-[0%]", width: "25.2%", height: "6.5%"},
        {id: 111, top: "top-[80.8%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%"},
        {id: 112, top: "top-[80.8%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%"},
        {id: 113, top: "top-[89.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%"},
        {id: 114, top: "top-[89.5%]", left: "left-[20.2%]", width: "20%", height: "5.5%"},
        {id: 115, top: "top-[89.5%]", left: "left-[40.5%]", width: "19%", height: "5.5%"},
        {id: 116, top: "top-[89.5%]", left: "left-[58.7%]", width: "20.2%", height: "5.5%"},
        {id: 117, top: "top-[89.5%]", left: "left-[79.2%]", width: "20.8%", height: "10.5%"},
        {id: 118, top: "top-[95%]", left: "left-[0%]", width: "20.2%", height: "4.8%"},
        {id: 119, top: "top-[95%]", left: "left-[20.2%]", width: "20.2%", height: "4.8%"},
        {id: 120, top: "top-[95%]", left: "left-[40.5%]", width: "19%", height: "4.8%"},
        {id: 121, top: "top-[95%]", left: "left-[59.7%]", width: "20.2%", height: "4.8%"},


    ];
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: string;
    } | null>(null);


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
    return (
        <div className="relative overflow-auto no-scrollbar" >
            <Image src="/pages/page02.jpg" alt="PDF" width={360} height={360} priority/>
            {gridCells.map((cell, index) => {

                const selectedProduct = productsgrid2?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);

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
        {id: 301, top: "top-[1.8%] ", left: "left-[0%]", width: "23.2%", height: "7.8%"},
        {id: 302, top: "top-[1.8%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%"},
        {id: 303, top: "top-[1.8%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%"},
        {id: 304, top: "top-[9.8%]", left: "left-[0%]", width: "23.2%", height: "7.8%"},
        {id: 305, top: "top-[9.8%]", left: "left-[23.2%]", width: "23.2%", height: "7.8%"},
        {id: 306, top: "top-[9.8%]", left: "left-[45.5%] ", width: "23.2%", height: "7.8%"},
        {id: 307, top: "top-[18%] ", left: "left-[0%]", width: "23.2%", height: "7.8%"},
        {id: 308, top: "top-[18%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%"},
        {id: 309, top: "top-[18%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%"},
        {id: 310, top: "top-[27.9%]", left: "left-[0%]", width: "14.5%", height: "8%"},
        {id: 311, top: "top-[27.9%]", left: "left-[14.4%] ", width: "14%", height: "8%"},
        {id: 312, top: "top-[27.9%]", left: "left-[28.6%] ", width: "14%", height: "8%"},
        {id: 313, top: "top-[27.9%]", left: "left-[42.8%] ", width: "14%", height: "8%"},
        {id: 314, top: "top-[27.9%]", left: "left-[57%] ", width: "14%", height: "8%"},
        {id: 315, top: "top-[36.8%]", left: "left-[0%]", width: "23.5%", height: "8%"},
        {id: 316, top: "top-[36.8%]", left: "left-[24.2%] ", width: "23%", height: "8%"},
        {id: 317, top: "top-[36.8%]", left: "left-[47.5%] ", width: "23%", height: "8%"},
        {id: 318, top: "top-[45.8%]", left: "left-[0%]", width: "23%", height: "9.8%"},
        {id: 319, top: "top-[45.8%]", left: "left-[23.2%]", width: "23%", height: "9.8%"},
        {id: 320, top: "top-[45.8%]", left: "left-[46.5%]", width: "23%", height: "9.8%"},
        {id: 321, top: "top-[55.8%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 322, top: "top-[55.8%]", left: "left-[17.4%]", width: "18%", height: "8.2%"},
        {id: 323, top: "top-[55.8%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 324, top: "top-[55.8%]", left: "left-[53.2%]", width: "18%", height: "8.2%"},
        {id: 325, top: "top-[64.5%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 326, top: "top-[64.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%"},
        {id: 327, top: "top-[64.5%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 328, top: "top-[64.5%]", left: "left-[53.2%]", width: "18%", height: "8.2%"},
        {id: 329, top: "top-[72.6%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 330, top: "top-[72.6%]", left: "left-[17.4%] ", width: "18%", height: "8.2%"},
        {id: 331, top: "top-[72.6%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 332, top: "top-[72.6%]", left: "left-[53%] ", width: "18%", height: "8.2%"},
        {id: 333, top: "top-[81.5%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 334, top: "top-[81.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%"},
        {id: 335, top: "top-[81.5%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 336, top: "top-[81.5%]", left: "left-[53%] ", width: "18%", height: "8.2%"},
        {id: 337, top: "top-[90.5%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 338, top: "top-[90.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%"},
        {id: 339, top: "top-[90.5%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 340, top: "top-[90.5%]", left: "left-[53%]", width: "18%", height: "8.2%"},
        {id: 341, top: "top-[1.1%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 342, top: "top-[10.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 343, top: "top-[19.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 344, top: "top-[28.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 345, top: "top-[37.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 346, top: "top-[46.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 347, top: "top-[55.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 348, top: "top-[64.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 349, top: "top-[73.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%"},
        {id: 350, top: "top-[84.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%"},

    ];

    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: string;
    } | null>(null);


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
            <Image src="/pages/page03.jpg" alt="PDF" width={400} height={400} priority/>
            {gridCells.map((cell, index) => {

                const selectedProduct = productsgrid2?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);

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
        {id: 401, top: "top-[1.8%] ", left: "left-[0%]", width: "23.2%", height: "7.8%"},
        {id: 402, top: "top-[1.8%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%"},
        {id: 403, top: "top-[1.8%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%"},
        {id: 404, top: "top-[9.8%]", left: "left-[0%]", width: "23.2%", height: "7.8%"},
        {id: 405, top: "top-[9.8%]", left: "left-[23.2%]", width: "23.2%", height: "7.8%"},
        {id: 406, top: "top-[9.8%]", left: "left-[45.5%] ", width: "23.2%", height: "7.8%"},
        {id: 407, top: "top-[18%] ", left: "left-[0%]", width: "23.2%", height: "7.8%"},
        {id: 408, top: "top-[18%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%"},
        {id: 409, top: "top-[18%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%"},
        {id: 410, top: "top-[27.9%]", left: "left-[0%]", width: "14.5%", height: "8%"},
        {id: 411, top: "top-[27.9%]", left: "left-[14.4%] ", width: "14%", height: "8%"},
        {id: 412, top: "top-[27.9%]", left: "left-[28.6%] ", width: "14%", height: "8%"},
        {id: 413, top: "top-[27.9%]", left: "left-[42.8%] ", width: "14%", height: "8%"},
        {id: 414, top: "top-[27.9%]", left: "left-[57%] ", width: "14%", height: "8%"},
        {id: 415, top: "top-[36.8%]", left: "left-[0%]", width: "23.5%", height: "8%"},
        {id: 416, top: "top-[36.8%]", left: "left-[24.2%] ", width: "23%", height: "8%"},
        {id: 417, top: "top-[36.8%]", left: "left-[47.5%] ", width: "23%", height: "8%"},
        {id: 418, top: "top-[45.8%]", left: "left-[0%]", width: "23%", height: "9.8%"},
        {id: 419, top: "top-[45.8%]", left: "left-[23.2%]", width: "23%", height: "9.8%"},
        {id: 420, top: "top-[45.8%]", left: "left-[46.5%]", width: "23%", height: "9.8%"},
        {id: 421, top: "top-[55.8%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 422, top: "top-[55.8%]", left: "left-[17.4%]", width: "18%", height: "8.2%"},
        {id: 423, top: "top-[55.8%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 424, top: "top-[55.8%]", left: "left-[53.2%]", width: "18%", height: "8.2%"},
        {id: 425, top: "top-[64.5%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 426, top: "top-[64.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%"},
        {id: 427, top: "top-[64.5%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 428, top: "top-[64.5%]", left: "left-[53.2%]", width: "18%", height: "8.2%"},
        {id: 429, top: "top-[72.6%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 430, top: "top-[72.6%]", left: "left-[17.4%] ", width: "18%", height: "8.2%"},
        {id: 431, top: "top-[72.6%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 432, top: "top-[72.6%]", left: "left-[53%] ", width: "18%", height: "8.2%"},
        {id: 433, top: "top-[81.5%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 434, top: "top-[81.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%"},
        {id: 435, top: "top-[81.5%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 436, top: "top-[81.5%]", left: "left-[53%] ", width: "18%", height: "8.2%"},
        {id: 437, top: "top-[90.5%]", left: "left-[0%]", width: "18%", height: "8.2%"},
        {id: 438, top: "top-[90.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%"},
        {id: 439, top: "top-[90.5%]", left: "left-[35%]", width: "18%", height: "8.2%"},
        {id: 440, top: "top-[90.5%]", left: "left-[53%]", width: "18%", height: "8.2%"},
        {id: 441, top: "top-[1.1%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 442, top: "top-[10.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 443, top: "top-[19.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 444, top: "top-[28.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 445, top: "top-[37.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 446, top: "top-[46.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 447, top: "top-[55.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 448, top: "top-[64.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%"},
        {id: 449, top: "top-[73.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%"},
        {id: 450, top: "top-[84.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%"},

    ];

    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: string;
    } | null>(null);


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

