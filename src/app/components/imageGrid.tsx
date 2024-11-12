import Image from "next/image";
import {useState, useEffect} from "react";
import RightClick from "./rightClick";
import {GridCardProduct} from "./card";
import {useProductContext} from "../context/productContext";
import {categoriesInterface} from "@/types/category";
import {ProductTypes} from "@/types/product";


interface ImageGridProps {
    onProductSelect: (gridId: number, categoryGridSelected: categoriesInterface, event: React.MouseEvent) => void;
    selectedProducts: ProductTypes[];
    onRemoveProduct: (productId: number) => void;
    onEditProduct: (productId: number) => void;
    onChangeProduct: (productId: number) => void;
    isMoveModeActive: boolean;
    onCopyProduct: (product: ProductTypes) => void;
    copiedProduct: ProductTypes | null;
    onPasteProduct: () => void;
}

export let productoA: ProductTypes = {
    _id: "",
    id_category: 0,
    name: "",
    brand: "",
    upc: 0,
    size: "",
    variety: "",
    price: 0,
    conditions: "",
    sku: "",
    desc: "",
    main: "",
    addl: "",
    burst: "",
    sale_price: 0,
    price_text: "",
    reg_price: 0,
    save_up_to: "",
    item_code: 0,
    group_code: 0,
    burst2: "",
    burst3: "",
    burst4: "",
    with_cart: false,
    notes: "",
    buyer_notes: "",
    effective: "",
    unit_price: "",
    id_product: 0,
    __v: 0,
    color: "",
    url_image: ""
};

export function updateProductoA(argProduct: ProductTypes | undefined) {
    Object.assign(productoA, argProduct);
}

export let productoB: ProductTypes = {
    _id: "",
    id_category: 0,
    name: "",
    brand: "",
    upc: 0,
    size: "",
    variety: "",
    price: 0,
    conditions: "",
    sku: "",
    desc: "",
    main: "",
    addl: "",
    burst: "",
    sale_price: 0,
    price_text: "",
    reg_price: 0,
    save_up_to: "",
    item_code: 0,
    group_code: 0,
    burst2: "",
    burst3: "",
    burst4: "",
    with_cart: false,
    notes: "",
    buyer_notes: "",
    effective: "",
    unit_price: "",
    id_product: 0,
    __v: 0,
    color: "",
    url_image: ""
};

export function updateProductoB(argProduct: ProductTypes | undefined) {
    Object.assign(productoB, argProduct);
}

export const resetProductoA = (): void => {
    productoA = {
        _id: "",
        id_category: 0,
        name: "",
        brand: "",
        upc: 0,
        size: "",
        variety: "",
        price: 0,
        conditions: "",
        sku: "",
        desc: "",
        main: "",
        addl: "",
        burst: "",
        sale_price: 0,
        price_text: "",
        reg_price: 0,
        save_up_to: "",
        item_code: 0,
        group_code: 0,
        burst2: "",
        burst3: "",
        burst4: "",
        with_cart: false,
        notes: "",
        buyer_notes: "",
        effective: "",
        unit_price: "",
        id_product: 0,
        __v: 0,
        color: "",
        url_image: ""
    };

};

export const resetProductoB = (): void => {
    productoB = {
        _id: "",
        id_category: 0,
        name: "",
        brand: "",
        upc: 0,
        size: "",
        variety: "",
        price: 0,
        conditions: "",
        sku: "",
        desc: "",
        main: "",
        addl: "",
        burst: "",
        sale_price: 0,
        price_text: "",
        reg_price: 0,
        save_up_to: "",
        item_code: 0,
        group_code: 0,
        burst2: "",
        burst3: "",
        burst4: "",
        with_cart: false,
        notes: "",
        buyer_notes: "",
        effective: "",
        unit_price: "",
        id_product: 0,
        __v: 0,
        color: "",
        url_image: ""
    };

};
export const ImageGrid = ({
                              onProductSelect,
                              selectedProducts,
                              onRemoveProduct,
                              onChangeProduct,
                              isMoveModeActive,
                              onCopyProduct,
                              copiedProduct,
                              onPasteProduct
                          }: ImageGridProps) => {
    const gridCells = [
        //meats
        {id: 1, top: "top-[21%] ", left: "left-[0%]", width: "23.5%", height: "6.5%", category: "Meat"},
        {id: 2, top: "top-[21%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%", category: "Meat"},
        {id: 3, top: "top-[21%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%", category: "Meat"},
        {id: 4, top: "top-[27.3%]", left: "left-[0%]", width: "23.5%", height: "6.5%", category: "Meat"},
        {id: 5, top: "top-[27.3%]", left: "left-[23.2%]", width: "23.5%", height: "6.5%", category: "Meat"},
        {id: 6, top: "top-[27.3%]", left: "left-[46.4%]", width: "23.5%", height: "6.5%", category: "Meat"},
        {id: 7, top: "top-[33.6%] ", left: "left-[0%]", width: "23.5%", height: "6.5%", category: "Meat"},
        {id: 8, top: "top-[33.6%] ", left: "left-[23.2%]", width: "23.5%", height: "6.5%", category: "Meat"},
        {id: 9, top: "top-[33.6%] ", left: "left-[46.4%]", width: "23.5%", height: "6.5%", category: "Meat"},
        //seaFood
        {id: 10, top: "top-[42%]", left: "left-0%", width: "14.5%", height: "6.4%", category: "SeaFood"},
        {id: 11, top: "top-[42%]", left: "left-[14.2%] ", width: "14.5%", height: "6.4%", category: "SeaFood"},
        {id: 12, top: "top-[42%]", left: "left-[28.4%] ", width: "14.5%", height: "6.4%", category: "SeaFood"},
        {id: 13, top: "top-[42%]", left: "left-[42.7%] ", width: "14.5%", height: "6.4%", category: "SeaFood"},
        {id: 14, top: "top-[42%]", left: "left-[57%] ", width: "14.5%", height: "6.4%", category: "SeaFood"},
        //SeaFood
        {id: 15, top: "top-[49.2%]", left: "left-[0]", width: "23.5%", height: "6.4%", category: "Deli"},
        {id: 16, top: "top-[49.2%]", left: "left-[23.9%] ", width: "23.5%", height: "6.4%", category: "Deli"},
        {id: 17, top: "top-[49.2%]", left: "left-[47.8%] ", width: "23.5%", height: "6.4%", category: "Deli"},
        //Grocery
        {id: 18, top: "top-[56.4%]", left: "left-[0%] ", width: "23.5%", height: "8.2%", category: "Grocery"},
        {id: 19, top: "top-[56.4%]", left: "left-[23.8%]", width: "23.5%", height: "8.2%", category: "Grocery"},
        {id: 20, top: "top-[56.4%]", left: "left-[47.5%]", width: "23.5%", height: "8.2%", category: "Grocery"},
        {id: 21, top: "top-[64.7%]", left: "left-[0%] ", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 22, top: "top-[64.7%]", left: "left-[18%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 23, top: "top-[64.7%]", left: "left-[35.5%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 24, top: "top-[64.7%]", left: "left-[53%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 25, top: "top-[71.5%]", left: "left-[0%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 26, top: "top-[71.5%]", left: "left-[18%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 27, top: "top-[71.5%]", left: "left-[35.5%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 28, top: "top-[71.5%]", left: "left-[53%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 29, top: "top-[78%]", left: "left-[0%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 30, top: "top-[78%]", left: "left-[18%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 31, top: "top-[78%]", left: "left-[35.5%]", width: "18%", height: "6.8%", category: "Grocery"},
        {id: 32, top: "top-[78%]", left: "left-[53%]", width: "18%", height: "6.8%", category: "Grocery"},
        //Dairy
        {id: 33, top: "top-[85.2%]", left: "left-[0%]", width: "18%", height: "6.4%", category: "Dairy"},
        {id: 34, top: "top-[85.2%]", left: "left-[18%]", width: "18%", height: "6.4%", category: "Dairy"},
        {id: 35, top: "top-[85.2%]", left: "left-[35.5%]", width: "18%", height: "6.4%", category: "Dairy"},
        {id: 36, top: "top-[85.2%]", left: "left-[53%]", width: "18%", height: "6.4%", category: "Dairy"},
        //froze
        {id: 37, top: "top-[92.2%]", left: "left-[0%]", width: "18%", height: "7%", category: "Dairy"},
        {id: 38, top: "top-[92.2%]", left: "left-[18%]", width: "18%", height: "7%", category: "Dairy"},
        {id: 39, top: "top-[92.2%]", left: "left-[35.5%]", width: "18%", height: "7%", category: "Dairy"},
        {id: 40, top: "top-[92.2%]", left: "left-[53%]", width: "18%", height: "7%", category: "Dairy"},
        //Produce
        {id: 41, top: "top-[20.5%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce"},
        {id: 42, top: "top-[27.9%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce"},
        {id: 43, top: "top-[35.3%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce"},
        {id: 44, top: "top-[42.7%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce"},
        {id: 45, top: "top-[50.1%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce"},
        {id: 46, top: "top-[57.5%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce"},
        {id: 47, top: "top-[64.9%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce"},
        {id: 48, top: "top-[72.3%]", left: "left-[72%]", width: "27%", height: "7.5%", category: "Produce"},
        {id: 49, top: "top-[79.7%]", left: "left-[72%]", width: "27%", height: "9%", category: "Produce"},
        {id: 50, top: "top-[88.5%]", left: "left-[72%]", width: "27%", height: "9%", category: "Produce"},
    ];
    const [productsData, setProductsData] = useState<ProductTypes[]>([]);
    const {setProductArray} = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: number;
    } | null>(null);


    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
        e.preventDefault();
        if (isMoveModeActive) return;

        // Coordenadas iniciales del clic derecho en relación a la ventana
        let posX = e.pageX;
        let posY = e.pageY;

        // Ancho y alto estimados del menú contextual
        const menuWidth = 150; // Ancho estimado del menú contextual
        const menuHeight = 200; // Alto estimado del menú contextual

        // Ajustar las coordenadas si el menú se sale de la pantalla
        if (posX + menuWidth > window.innerWidth) {
            posX = window.innerWidth - menuWidth - 10; // Resta 10px para que no quede pegado al borde
        }
        if (posY + menuHeight > window.innerHeight) {
            posY = window.innerHeight - menuHeight - 10; // Resta 10px para que no quede pegado al borde
        }

        // Establecer el estado del menú contextual con las coordenadas ajustadas
        setContextMenu({
            visible: true,
            x: posX - 125,
            y: posY - 100,
            productId: cellId,
        });
    };


    const handleGridSelect = (
        gridId: number,
        categoryGridSelected: categoriesInterface,
        event: React.MouseEvent
    ) => {
        // Si hay un producto copiado y la celda está vacía
        if (copiedProduct && !selectedProducts.some(p => p.id_product === gridId)) {
            const newProduct = {
                ...copiedProduct,
                id_product: gridId
            };
            onProductSelect(gridId, categoryGridSelected, event);
            setProductArray([newProduct]);
            onPasteProduct();
            return;
        }

        // Lógica existente de selección...
        onProductSelect(gridId, categoryGridSelected, event);
    };


    return (
        <div className="relative overflow-auto no-scrollbar">
            <Image src="/pages/page01.jpg" alt="PDF" width={400} height={400} priority/>
            {gridCells.map((cell) => {
                const selectedProduct = productsData?.find((p) => p.id_product === cell.id) || selectedProducts?.find((p) => p.id_product === cell.id);
                const categoryItem = {name_category: cell.category} as categoriesInterface;
                return (
                    <GridCardProduct
                        key={cell.id}
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                       // onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
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
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_product === contextMenu.productId) as ProductTypes}
                        copiedProduct={copiedProduct}
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
                               onRemoveProduct,
                               onChangeProduct,
                               onCopyProduct,
                               copiedProduct,
                               onPasteProduct
                           }: ImageGridProps) => {
    const gridCells = [
        // Grocery
        {id: 51, top: "top-[1%] ", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 52, top: "top-[1%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 53, top: "top-[1%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 54, top: "top-[1%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 55, top: "top-[1%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 56, top: "top-[6.8%]", left: "left-[0%] ", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 57, top: "top-[6.8%] ", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 58, top: "top-[6.8%] ", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 59, top: "top-[6.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 60, top: "top-[6.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 61, top: "top-[12.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 62, top: "top-[12.5%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 63, top: "top-[12.5%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 64, top: "top-[12.5%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 65, top: "top-[12.5%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 66, top: "top-[18.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 67, top: "top-[18.2%]", left: "left-[20.2%] ", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 68, top: "top-[18.2%]", left: "left-[40.5%] ", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 69, top: "top-[18.2%]", left: "left-[60.7%] ", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 70, top: "top-[18.2%]", left: "left-[80.2%] ", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 71, top: "top-[23.9%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 72, top: "top-[23.9%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 73, top: "top-[23.9%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 74, top: "top-[23.9%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 75, top: "top-[23.9%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 76, top: "top-[29.6%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 77, top: "top-[29.6%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 78, top: "top-[29.6%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 79, top: "top-[29.6%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        {id: 80, top: "top-[29.6%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "Grocery"},
        //International
        {id: 81, top: "top-[36.3%]", left: "left-[0%]", width: "20.2%", height: "11%", category: "International"},
        {id: 82, top: "top-[36.3%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 83, top: "top-[36.3%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 84, top: "top-[36.3%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 85, top: "top-[36.3%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 86, top: "top-[41.8%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 87, top: "top-[41.8%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 88, top: "top-[41.8%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 89, top: "top-[41.8%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 90, top: "top-[47.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 91, top: "top-[47.5%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 92, top: "top-[47.5%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 93, top: "top-[47.5%]", left: "left-[60.7%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 94, top: "top-[47.5%]", left: "left-[80.2%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 95, top: "top-[53.2%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 96, top: "top-[53.2%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 97, top: "top-[53.2%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 98, top: "top-[53.2%]", left: "left-[60%]", width: "40%", height: "11.2%", category: "International"},
        {id: 99, top: "top-[59%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 100, top: "top-[59%]", left: "left-[20.2%]", width: "20.2%", height: "5.5%", category: "International"},
        {id: 101, top: "top-[59%]", left: "left-[40.5%]", width: "20.2%", height: "5.5%", category: "International"},
        //Breakfast
        {id: 102, top: "top-[65.8%]", left: "left-[0%]", width: "25.2%", height: "8.5%", category: "Breakfast"},
        {id: 103, top: "top-[65.8%]", left: "left-[25.2%]", width: "25.2%", height: "8.5%", category: "Breakfast"},
        {id: 104, top: "top-[65.8%]", left: "left-[50.4%]", width: "25.2%", height: "8.5%", category: "Breakfast"},
        {id: 105, top: "top-[65.8%]", left: "left-[75.6%]", width: "25.2%", height: "8.5%", category: "Breakfast"},
        {id: 106, top: "top-[74.3%]", left: "left-[0%]", width: "25.2%", height: "6.5%", category: "Breakfast"},
        {id: 107, top: "top-[74.3%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%", category: "Breakfast"},
        {id: 108, top: "top-[74.3%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%", category: "Breakfast"},
        {id: 109, top: "top-[74.3%]", left: "left-[75.6%]", width: "25.2%", height: "13.5%", category: "Breakfast"},
        {id: 110, top: "top-[80.8%]", left: "left-[0%]", width: "25.2%", height: "6.5%", category: "Breakfast"},
        {id: 111, top: "top-[80.8%]", left: "left-[25.2%]", width: "25.2%", height: "6.5%", category: "Breakfast"},
        {id: 112, top: "top-[80.8%]", left: "left-[50.4%]", width: "25.2%", height: "6.5%", category: "Breakfast"},
        //Snack
        {id: 113, top: "top-[89.5%]", left: "left-[0%]", width: "20.2%", height: "5.5%", category: "Snack"},
        {id: 114, top: "top-[89.5%]", left: "left-[20.2%]", width: "20%", height: "5.5%", category: "Snack"},
        {id: 115, top: "top-[89.5%]", left: "left-[40.5%]", width: "19%", height: "5.5%", category: "Snack"},
        {id: 116, top: "top-[89.5%]", left: "left-[58.7%]", width: "20.2%", height: "5.5%", category: "Snack"},
        {id: 117, top: "top-[89.5%]", left: "left-[79.2%]", width: "20.8%", height: "10.5%", category: "Snack"},
        {id: 118, top: "top-[95%]", left: "left-[0%]", width: "20.2%", height: "4.8%", category: "Snack"},
        {id: 119, top: "top-[95%]", left: "left-[20.2%]", width: "20.2%", height: "4.8%", category: "Snack"},
        {id: 120, top: "top-[95%]", left: "left-[40.5%]", width: "19%", height: "4.8%", category: "Snack"},
        {id: 121, top: "top-[95%]", left: "left-[59.7%]", width: "20.2%", height: "4.8%", category: "Snack"},


    ];

    const {productArray, setProductArray, productsData, setProductsData} = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: number;
    } | null>(null);


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
            x: posX - 125,
            y: posY,
            productId: cellId
        });
    };   
    

    useEffect(() => {

        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const handleGridSelect = (
        gridId: number,
        categoryGridSelected: categoriesInterface,
        event: React.MouseEvent
    ) => {
        // Si hay un producto copiado y la celda está vacía
        if (copiedProduct && !selectedProducts.some(p => p.id_product === gridId)) {
            const newProduct = {
                ...copiedProduct,
                id_product: gridId
            };
            onProductSelect(gridId, categoryGridSelected, event);
            setProductArray([newProduct]);
            onPasteProduct();
            return;
        }

        // Lógica existente de selección...
        onProductSelect(gridId, categoryGridSelected, event);
    };

    const actualizarArray = (): void => {
        if (productArray.length !== selectedProducts.length) {
            selectedProducts.forEach((selectedProduct) => {
                const exists = productArray.some((product) => product.id_product === selectedProduct.id_product);
                if (!exists) {
                    productArray.push(selectedProduct);
                }
            });
            setProductArray(productArray);
        }
    };


    return (
        <div className="relative overflow-auto no-scrollbar">
            <Image src="/pages/page02.jpg" alt="PDF" width={360} height={360} priority/>
            {gridCells.map((cell) => {

                const selectedProduct = productArray?.find((p) => p.id_product === cell.id) || selectedProducts?.find((p) => p.id_product === cell.id);
                const categoryItem = {name_category: cell.category} as categoriesInterface;
                actualizarArray();
                return (
                    <GridCardProduct
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                       // onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                       
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
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_product === contextMenu.productId) as ProductTypes}
                        copiedProduct={copiedProduct}
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
                               onRemoveProduct,
                               onChangeProduct,
                               onCopyProduct,
                               copiedProduct,
                               onPasteProduct
                           }: ImageGridProps) => {
    const gridCells = [
        {id: 301, top: "top-[1.8%] ", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Dairy"},
        {id: 302, top: "top-[1.8%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Dairy"},
        {id: 303, top: "top-[1.8%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%", category: "Dairy"},
        {id: 304, top: "top-[9.8%]", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Dairy"},
        {id: 305, top: "top-[9.8%]", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Dairy"},
        {id: 306, top: "top-[9.8%]", left: "left-[45.5%] ", width: "23.2%", height: "7.8%", category: "Dairy"},
        {id: 307, top: "top-[18%] ", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Dairy"},
        {id: 308, top: "top-[18%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Dairy"},
        {id: 309, top: "top-[18%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%", category: "Dairy"},
        {id: 310, top: "top-[27.9%]", left: "left-[0%]", width: "14.5%", height: "8%", category: "Dairy"},
        {id: 311, top: "top-[27.9%]", left: "left-[14.4%] ", width: "14%", height: "8%", category: "Dairy"},
        {id: 312, top: "top-[27.9%]", left: "left-[28.6%] ", width: "14%", height: "8%", category: "Dairy"},
        {id: 313, top: "top-[27.9%]", left: "left-[42.8%] ", width: "14%", height: "8%", category: "Dairy"},
        {id: 314, top: "top-[27.9%]", left: "left-[57%] ", width: "14%", height: "8%", category: "Dairy"},
        {id: 315, top: "top-[36.8%]", left: "left-[0%]", width: "23.5%", height: "8%", category: "Dairy"},
        {id: 316, top: "top-[36.8%]", left: "left-[24.2%] ", width: "23%", height: "8%", category: "Dairy"},
        {id: 317, top: "top-[36.8%]", left: "left-[47.5%] ", width: "23%", height: "8%", category: "Dairy"},
        {id: 318, top: "top-[45.8%]", left: "left-[0%]", width: "23%", height: "9.8%", category: "Dairy"},
        {id: 319, top: "top-[45.8%]", left: "left-[23.2%]", width: "23%", height: "9.8%", category: "Dairy"},
        {id: 320, top: "top-[45.8%]", left: "left-[46.5%]", width: "23%", height: "9.8%", category: "Dairy"},
        {id: 321, top: "top-[55.8%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 322, top: "top-[55.8%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 323, top: "top-[55.8%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 324, top: "top-[55.8%]", left: "left-[53.2%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 325, top: "top-[64.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 326, top: "top-[64.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 327, top: "top-[64.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 328, top: "top-[64.5%]", left: "left-[53.2%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 329, top: "top-[72.6%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 330, top: "top-[72.6%]", left: "left-[17.4%] ", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 331, top: "top-[72.6%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 332, top: "top-[72.6%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 333, top: "top-[81.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 334, top: "top-[81.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 335, top: "top-[81.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 336, top: "top-[81.5%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 337, top: "top-[90.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 338, top: "top-[90.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 339, top: "top-[90.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 340, top: "top-[90.5%]", left: "left-[53%]", width: "18%", height: "8.2%", category: "Dairy"},
        {id: 341, top: "top-[1.1%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy"},
        {id: 342, top: "top-[10.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy"},
        {id: 343, top: "top-[19.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy"},
        {id: 344, top: "top-[28.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy"},
        {id: 345, top: "top-[37.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy"},
        {id: 346, top: "top-[46.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy"},
        {id: 347, top: "top-[55.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy"},
        {id: 348, top: "top-[64.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Dairy"},
        {id: 349, top: "top-[73.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Dairy"},
        {id: 350, top: "top-[84.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Dairy"},

    ];

    const {productArray, setProductArray, productsData, setProductsData} = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: number;
    } | null>(null);

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
            x: posX - 125,
            y: posY,
            productId: cellId
        });
    };


    useEffect(() => {

        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
 
  

    const actualizarArray = (): void => {
        if (productArray.length !== selectedProducts.length) {
            selectedProducts.forEach((selectedProduct) => {
                const exists = productArray.some((product) => product.id_product === selectedProduct.id_product);
                if (!exists) {
                    productArray.push(selectedProduct);
                }
            });
            setProductArray(productArray);
        }
    };


    const handleGridSelect = (
        gridId: number,
        categoryGridSelected: categoriesInterface,
        event: React.MouseEvent
    ) => {
        // Si hay un producto copiado y la celda está vacía
        if (copiedProduct && !selectedProducts.some(p => p.id_product === gridId)) {
            const newProduct = {
                ...copiedProduct,
                id_product: gridId
            };
            onProductSelect(gridId, categoryGridSelected, event);
            setProductArray([newProduct]);
            onPasteProduct();
            return;
        }

        // Lógica existente de selección...
        onProductSelect(gridId, categoryGridSelected, event);
    };


    return (
        <div className="relative overflow-auto no-scrollbar">
            <Image src="/pages/page03.jpg" alt="PDF" width={360} height={360} priority/>
            {gridCells.map((cell) => {

                const selectedProduct = productArray?.find((p) => p.id_product === cell.id) || selectedProducts?.find((p) => p.id_product === cell.id);
                const categoryItem = {name_category: cell.category} as categoriesInterface;

                actualizarArray();
                return (
                    <GridCardProduct
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                     //   onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}
                       

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
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_product === contextMenu.productId) as ProductTypes}
                        copiedProduct={copiedProduct}
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
                               onRemoveProduct,
                               onChangeProduct,
                               onCopyProduct,
                               copiedProduct,
                               onPasteProduct
                           }: ImageGridProps) => {
    const gridCells = [
        {id: 401, top: "top-[1.8%] ", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Breakfast"},
        {id: 402, top: "top-[1.8%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Breakfast"},
        {id: 403, top: "top-[1.8%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%", category: "Breakfast"},
        {id: 404, top: "top-[9.8%]", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Breakfast"},
        {id: 405, top: "top-[9.8%]", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Breakfast"},
        {id: 406, top: "top-[9.8%]", left: "left-[45.5%] ", width: "23.2%", height: "7.8%", category: "Breakfast"},
        {id: 407, top: "top-[18%] ", left: "left-[0%]", width: "23.2%", height: "7.8%", category: "Breakfast"},
        {id: 408, top: "top-[18%] ", left: "left-[23.2%]", width: "23.2%", height: "7.8%", category: "Breakfast"},
        {id: 409, top: "top-[18%] ", left: "left-[45.5%]", width: "23.2%", height: "7.8%", category: "Breakfast"},
        {id: 410, top: "top-[27.9%]", left: "left-[0%]", width: "14.5%", height: "8%", category: "Breakfast"},
        {id: 411, top: "top-[27.9%]", left: "left-[14.4%] ", width: "14%", height: "8%", category: "Breakfast"},
        {id: 412, top: "top-[27.9%]", left: "left-[28.6%] ", width: "14%", height: "8%", category: "Breakfast"},
        {id: 413, top: "top-[27.9%]", left: "left-[42.8%] ", width: "14%", height: "8%", category: "Breakfast"},
        {id: 414, top: "top-[27.9%]", left: "left-[57%] ", width: "14%", height: "8%", category: "Breakfast"},
        {id: 415, top: "top-[36.8%]", left: "left-[0%]", width: "23.5%", height: "8%", category: "Breakfast"},
        {id: 416, top: "top-[36.8%]", left: "left-[24.2%] ", width: "23%", height: "8%", category: "Breakfast"},
        {id: 417, top: "top-[36.8%]", left: "left-[47.5%] ", width: "23%", height: "8%", category: "Breakfast"},
        {id: 418, top: "top-[45.8%]", left: "left-[0%]", width: "23%", height: "9.8%", category: "Breakfast"},
        {id: 419, top: "top-[45.8%]", left: "left-[23.2%]", width: "23%", height: "9.8%", category: "Breakfast"},
        {id: 420, top: "top-[45.8%]", left: "left-[46.5%]", width: "23%", height: "9.8%", category: "Breakfast"},
        {id: 421, top: "top-[55.8%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 422, top: "top-[55.8%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 423, top: "top-[55.8%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 424, top: "top-[55.8%]", left: "left-[53.2%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 425, top: "top-[64.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 426, top: "top-[64.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 427, top: "top-[64.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 428, top: "top-[64.5%]", left: "left-[53.2%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 429, top: "top-[72.6%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 430, top: "top-[72.6%]", left: "left-[17.4%] ", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 431, top: "top-[72.6%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 432, top: "top-[72.6%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 433, top: "top-[81.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 434, top: "top-[81.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 435, top: "top-[81.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 436, top: "top-[81.5%]", left: "left-[53%] ", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 437, top: "top-[90.5%]", left: "left-[0%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 438, top: "top-[90.5%]", left: "left-[17.4%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 439, top: "top-[90.5%]", left: "left-[35%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 440, top: "top-[90.5%]", left: "left-[53%]", width: "18%", height: "8.2%", category: "Breakfast"},
        {id: 441, top: "top-[1.1%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast"},
        {id: 442, top: "top-[10.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast"},
        {id: 443, top: "top-[19.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast"},
        {id: 444, top: "top-[28.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast"},
        {id: 445, top: "top-[37.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast"},
        {id: 446, top: "top-[46.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast"},
        {id: 447, top: "top-[55.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast"},
        {id: 448, top: "top-[64.2%]", left: "left-[72%]", width: "27.2%", height: "9.2%", category: "Breakfast"},
        {id: 449, top: "top-[73.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Breakfast"},
        {id: 450, top: "top-[84.2%]", left: "left-[72%]", width: "27.2%", height: "11.2%", category: "Breakfast"},

    ];

    const {productArray, setProductArray, productsData, setProductsData} = useProductContext();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        productId: number;
    } | null>(null);


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
            x: posX - 125,
            y: posY,
            productId: cellId
        });
    };


    useEffect(() => {

        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
   
    const handleChangeProductsInGrids = (cellId: string): void => {
        const cellIdNumber = parseInt(cellId, 10);
        
        if (productoA.id_product !== cellIdNumber) {
            const elementIndex: number = productArray.findIndex((p: ProductTypes | null): boolean => p?.id_product === cellIdNumber);
                        // Si se encuentra la celda (puede ser vacía)
            if (elementIndex !== -1) {
                productoB = productArray[elementIndex];
            

                // Intercambiar las posiciones (gridId) de `productoA` y `productoB`
                const tempGridId = productoA.id_product;
                productoA.id_product = productoB.id_product;
                productoB.id_product = tempGridId;

                // Actualizar el array `productsgrid2` con los cambios
                productArray[elementIndex] = productoB;

                // Si `productoA` también pertenece a `productsgrid2`, actualizarlo también
                const indexA = productArray.findIndex((p: ProductTypes): boolean => p?._id === productoA._id);
                if (indexA !== -1) {
                    productArray[indexA] = productoA;
                }
                
                selectedProducts = productArray;

            }
            resetProductoA();
            resetProductoB();
        }

    };

    const actualizarArray = (): void => {
        if (productArray.length !== selectedProducts.length) {
            selectedProducts.forEach((selectedProduct) => {
                const exists = productArray.some((product) => product.id_product === selectedProduct.id_product);
                if (!exists) {
                    productArray.push(selectedProduct);
                }
            });
            setProductArray(productArray);
        }
    };
    const handleGridSelect = (
        gridId: number,
        categoryGridSelected: categoriesInterface,
        event: React.MouseEvent
    ) => {
        // Si hay un producto copiado y la celda está vacía
        if (copiedProduct && !selectedProducts.some(p => p.id_product === gridId)) {
            const newProduct = {
                ...copiedProduct,
                id_product: gridId
            };
            onProductSelect(gridId, categoryGridSelected, event);
            setProductArray([newProduct]);
            onPasteProduct();
            return;
        }

        // Lógica existente de selección...
        onProductSelect(gridId, categoryGridSelected, event);
    };


    return (
        <div className="relative overflow-auto no-scrollbar">
            <Image src="/pages/page04.jpg" alt="PDF" width={360} height={360} priority/>
            {gridCells.map((cell) => {

                const selectedProduct = productArray?.find((p) => p.id_product === cell.id) || selectedProducts?.find((p) => p.id_product === cell.id);
                const categoryItem = {name_category: cell.category} as categoriesInterface;

                actualizarArray();
                return (
                    <GridCardProduct
                        product={selectedProduct!}
                        cell={cell}
                        onProductGridSelect={handleGridSelect}
                      //  onContextMenu={handleContextMenu}
                        setProductArray={(product: ProductTypes) => setProductArray([product])}
                        categoryCard={categoryItem}

                        handleChangeProducts={handleChangeProductsInGrids}

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
                        handleChangeProduct={onChangeProduct}
                        onCopyProduct={onCopyProduct}
                        selectedProduct={selectedProducts.find(p => p.id_product === contextMenu.productId) as ProductTypes}
                        copiedProduct={copiedProduct}
                    />
                </div>
            )}

        </div>
    );
};
