import Image from "next/image";
import {useState, useEffect} from "react";
import {getTableName} from "../api/productos/prductosRF";
import RightClick from "./rightClick";
import { CardProduct} from "./card";
import { ProductTypes } from "@/types/product";
import {ProductProvider,useProductContext} from "@/app/context/productContext";

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
//export let productsgrid2: ProductTypes[] = [];
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
       {id: 102, top: "top-[280px] ", left: "left-[125px] ", width: "125px", height: "85px"},
       {id: 101, top: "top-[280px] ", left: "left-0", width: "125px", height: "85px"},
       {id: 103, top: "top-[280px] ", left: "left-[250px] ", width: "125px", height: "85px"},
       {id: 104, top: "top-[370px]", left: "left-0", width: "125px", height: "85px"},
       {id: 105, top: "top-[370px]", left: "left-[125px] ", width: "125px", height: "85px"},
       {id: 106, top: "top-[370px]", left: "left-[250px] ", width: "125px", height: "85px"},
       {id: 107, top: "top-[455px] ", left: "left-0", width: "125px", height: "85px"},
       {id: 108, top: "top-[455px] ", left: "left-[125px] ", width: "125px", height: "85px"},
       {id: 109, top: "top-[455px] ", left: "left-[250px] ", width: "125px", height: "85px"},
       {id: 110, top: "top-[550px]", left: "left-0", width: "80px", height: "86px"},
       {id: 111, top: "top-[550px]", left: "left-[80px] ", width: "75px", height: "86px"},
       {id: 112, top: "top-[550px]", left: "left-[155px] ", width: "75px", height: "86px"},
       {id: 113, top: "top-[550px]", left: "left-[230px] ", width: "75px", height: "86px"},
       {id: 114, top: "top-[550px]", left: "left-[305px] ", width: "75px", height: "86px"},
       {id: 115, top: "top-[640px]", left: "left-0", width: "125px", height: "85px"},
       {id: 116, top: "top-[640px]", left: "left-[128px] ", width: "125px", height: "85px"},
       {id: 117, top: "top-[640px]", left: "left-[255px] ", width: "125px", height: "85px"},
       {id: 118, top: "top-[735px]", left: "left-0 ", width: "130px", height: "105px"},
       {id: 119, top: "top-[735px]", left: "left-[127px]", width: "130px", height: "105px"},
       {id: 120, top: "top-[735px]", left: "left-[255px]", width: "128px", height: "105px"},
       {id: 121, top: "top-[840px]", left: "left-0 ", width: "95px", height: "90px"},
       {id: 122, top: "top-[840px]", left: "left-[95px]", width: "95px", height: "90px"},
       {id: 123, top: "top-[840px]", left: "left-[190px]", width: "95px", height: "90px"},
       {id: 124, top: "top-[840px]", left: "left-[285px]", width: "95px", height: "90px"},
       {id: 125, top: "top-[930px]", left: "left-0", width: "95px", height: "86px"},
       {id: 126, top: "top-[930px]", left: "left-[95px]", width: "95px", height: "86px"},
       {id: 127, top: "top-[930px]", left: "left-[190px]", width: "95px", height: "86px"},
       {id: 128, top: "top-[930px]", left: "left-[285px]", width: "95px", height: "86px"},
       {id: 129, top: "top-[1015px]", left: "left-0", width: "95px", height: "86px"},
       {id: 130, top: "top-[1015px]", left: "left-[95px] ", width: "95px", height: "86px"},
       {id: 131, top: "top-[1015px]", left: "left-[190px]", width: "95px", height: "86px"},
       {id: 132, top: "top-[1015px]", left: "left-[285px] ", width: "95px", height: "86px"},
       {id: 133, top: "top-[1110px]", left: "left-0", width: "95px", height: "86px"},
       {id: 134, top: "top-[1110px]", left: "left-[95px]", width: "95px", height: "86px"},
       {id: 135, top: "top-[1110px]", left: "left-[190px]", width: "95px", height: "86px"},
       {id: 136, top: "top-[1110px]", left: "left-[285px] ", width: "95px", height: "86px"},
       {id: 137, top: "top-[1200px]", left: "left-0", width: "95px", height: "100px"},
       {id: 138, top: "top-[1200px]", left: "left-[95px]", width: "95px", height: "100px"},
       {id: 139, top: "top-[1200px]", left: "left-[190px]", width: "95px", height: "100px"},
       {id: 140, top: "top-[1200px]", left: "left-[285px]", width: "95px", height: "100px"},
       {id: 141, top: "top-[270px]", left: "left-[380px]", width: "150px", height: "100px"},
       {id: 142, top: "top-[370px]", left: "left-[380px]", width: "150px", height: "100px"},
       {id: 143, top: "top-[470px]", left: "left-[380px]", width: "150px", height: "100px"},
       {id: 144, top: "top-[570px]", left: "left-[380px]", width: "150px", height: "100px"},
       {id: 145, top: "top-[670px]", left: "left-[380px]", width: "150px", height: "100px"},
       {id: 146, top: "top-[770px]", left: "left-[380px]", width: "150px", height: "100px"},
       {id: 147, top: "top-[870px]", left: "left-[380px]", width: "150px", height: "100px"},
       {id: 148, top: "top-[970px]", left: "left-[380px]", width: "150px", height: "100px"},
       {id: 149, top: "top-[1070px]", left: "left-[380px]", width: "150px", height: "120px"},
       {id: 150, top: "top-[1200px]", left: "left-[380px]", width: "150px", height: "100px"},
    ];
    const [products, setProducts] = useState<ProductTypes[]>([]);
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
        <div className="relative  w-[550px] h-[550px] overflow-auto " >
            <Image src="/file/demo-1.png" alt="PDF" width={550} height={550} priority/>
            {gridCells.map((cell, index) => {
                const selectedProduct = products?.find((p) => p.gridId === cell.id) ||
                    selectedProducts?.find((p) => p.gridId === cell.id);
                return (
                        <div
                            key={cell.id}
                            className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
                            style={{width: cell.width, height: cell.height}}
                            onClick={(e) => onProductSelect(cell.id, e)}
                            onContextMenu={(e) => handleContextMenu(e, cell.id)}
                        >
                                                 <div className="absolute text-black font-bold">
                                {selectedProduct?.name || cell.id.toString()}
                            </div>
                            {selectedProduct?.image && (
                                <Image
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name || ''}
                                    width={70}
                                    height={70}
                                    objectFit="cover"
                                />
                            )}
          </div>
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
        {id: 202, top: "top-[20px] ", left: "left-[125px] ", width: "125px", height: "85px"},
        {id: 201, top: "top-[20px] ", left: "left-0", width: "125px", height: "85px"},
        {id: 203, top: "top-[20px] ", left: "left-[250px] ", width: "125px", height: "85px"},
        {id: 204, top: "top-[110px]", left: "left-0", width: "125px", height: "85px"},
        {id: 205, top: "top-[110px]", left: "left-[125px] ", width: "125px", height: "85px"},
        {id: 206, top: "top-[110px]", left: "left-[250px] ", width: "125px", height: "85px"},
        {id: 207, top: "top-[195px] ", left: "left-0", width: "125px", height: "85px"},
        {id: 208, top: "top-[195px] ", left: "left-[125px] ", width: "125px", height: "85px"},
        {id: 209, top: "top-[195px] ", left: "left-[250px] ", width: "125px", height: "85px"},
        {id: 210, top: "top-[294px]", left: "left-0", width: "80px", height: "86px"},
        {id: 211, top: "top-[294px]", left: "left-[80px] ", width: "75px", height: "86px"},
        {id: 212, top: "top-[294px]", left: "left-[155px] ", width: "75px", height: "86px"},
        {id: 213, top: "top-[294px]", left: "left-[230px] ", width: "75px", height: "86px"},
        {id: 214, top: "top-[294px]", left: "left-[305px] ", width: "75px", height: "86px"},
        {id: 215, top: "top-[388px]", left: "left-0", width: "125px", height: "85px"},
        {id: 216, top: "top-[388px]", left: "left-[128px] ", width: "125px", height: "85px"},
        {id: 217, top: "top-[388px]", left: "left-[255px] ", width: "125px", height: "85px"},
        {id: 218, top: "top-[482px]", left: "left-0 ", width: "130px", height: "105px"},
        {id: 219, top: "top-[482px]", left: "left-[127px]", width: "130px", height: "105px"},
        {id: 220, top: "top-[482px]", left: "left-[255px]", width: "128px", height: "105px"},
        {id: 221, top: "top-[589px]", left: "left-0 ", width: "95px", height: "90px"},
        {id: 222, top: "top-[589px]", left: "left-[95px]", width: "95px", height: "90px"},
        {id: 223, top: "top-[589px]", left: "left-[190px]", width: "95px", height: "90px"},
        {id: 224, top: "top-[589px]", left: "left-[285px]", width: "95px", height: "90px"},
        {id: 225, top: "top-[679px]", left: "left-0", width: "95px", height: "86px"},
        {id: 226, top: "top-[679px]", left: "left-[95px]", width: "95px", height: "86px"},
        {id: 227, top: "top-[679px]", left: "left-[190px]", width: "95px", height: "86px"},
        {id: 228, top: "top-[679px]", left: "left-[285px]", width: "95px", height: "86px"},
        {id: 229, top: "top-[765px]", left: "left-0", width: "95px", height: "86px"},
        {id: 230, top: "top-[765px]", left: "left-[95px] ", width: "95px", height: "86px"},
        {id: 231, top: "top-[765px]", left: "left-[190px]", width: "95px", height: "86px"},
        {id: 232, top: "top-[765px]", left: "left-[285px] ", width: "95px", height: "86px"},
        {id: 233, top: "top-[860px]", left: "left-0", width: "95px", height: "86px"},
        {id: 234, top: "top-[860px]", left: "left-[95px]", width: "95px", height: "86px"},
        {id: 235, top: "top-[860px]", left: "left-[190px]", width: "95px", height: "86px"},
        {id: 236, top: "top-[860px]", left: "left-[285px] ", width: "95px", height: "86px"},
        {id: 237, top: "top-[955px]", left: "left-0", width: "95px", height: "100px"},
        {id: 238, top: "top-[955px]", left: "left-[95px]", width: "95px", height: "100px"},
        {id: 239, top: "top-[955px]", left: "left-[190px]", width: "95px", height: "100px"},
        {id: 240, top: "top-[955px]", left: "left-[285px]", width: "95px", height: "100px"},
        {id: 241, top: "top-[10px]", left: "left-[385px]", width: "150px", height: "100px"},
        {id: 242, top: "top-[110px]", left: "left-[385px]", width: "150px", height: "100px"},
        {id: 243, top: "top-[210px]", left: "left-[385px]", width: "150px", height: "100px"},
        {id: 244, top: "top-[310px]", left: "left-[385px]", width: "150px", height: "100px"},
        {id: 245, top: "top-[410px]", left: "left-[385px]", width: "150px", height: "100px"},
        {id: 246, top: "top-[510px]", left: "left-[385px]", width: "150px", height: "100px"},
        {id: 247, top: "top-[610px]", left: "left-[385px]", width: "150px", height: "100px"},
        {id: 248, top: "top-[710px]", left: "left-[385px]", width: "150px", height: "100px"},
        {id: 249, top: "top-[810px]", left: "left-[385px]", width: "150px", height: "120px"},
        {id: 250, top: "top-[930px]", left: "left-[385px]", width: "150px", height: "100px"},
    ];
    const {products, setProducts} = useProductContext()
    // const [products, setProducts] = useState<ProductTypes[]>([]);
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
            console.log(products.length,"cantidad de elementos en array products")
                // Verificar si el array está vacío para llenarlo
                if (products.length === 0) {
                    productsData.forEach((product) => {
                        // Verificar si el producto ya está en `productsgrid2`
                        const exists = products.some((p) => p.id === product.id);
                        if (!exists) {
                            setProducts(product);
                        } else {
                            console.warn(`El producto con id ${product.id} ya existe en productsgrid2.`);
                        }
                    });
                    //setProducts([productsgrid2[0]]);
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

    removeDeletedProducts(products, deletedProducts);


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

  
    //Eliminar Producto
    const handleClearCell = (cellId: string): void => {
        const cellIdNumber: number = parseInt(cellId, 10);
        const elementIndex: number = products.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
        productTempDeleted = '';
        if (elementIndex !== -1) {
            // Guardar el elemento en el array de productos eliminados
            deletedProducts.push(products[elementIndex]);
            selectedProducts.length = 0;   
           
            // Eliminar el elemento del array
          
        } else {
            console.log("Elemento no encontrado.");
        }

    };

    const handleInitChangeProduct = (Cellid: string): void => {
        const cellIdNumber: number = parseInt(Cellid, 10);
        const elementIndex: number = products.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
        if (elementIndex !== -1) {
            productoA = products[elementIndex];           
        }     

    }
    const handleChangeProducts = (cellId: string): void => {
        const cellIdNumber = parseInt(cellId, 10);
        if (productoA.gridId != undefined && productoA.gridId != cellIdNumber) {
            const elementIndex: number = products.findIndex((p: Product | null): boolean => p?.gridId === cellIdNumber);

            // Si se encuentra la celda (puede ser vacía)
            if (elementIndex !== -1) {
                let productoB = products[elementIndex];

                // Si la celda está vacía (es null o undefined), crear un objeto vacío para `productoB`
                if (!productoB) {
                    productoB = {id: "", image: "", name: "", gridId: cellIdNumber, descriptions: []};
                }

                // Intercambiar las posiciones (gridId) de `productoA` y `productoB`
                const tempGridId = productoA.gridId;
                productoA.gridId = productoB.gridId;
                productoB.gridId = tempGridId;

                // Actualizar el array `productsgrid2` con los cambios
                products[elementIndex] = productoB;

                // Si `productoA` también pertenece a `productsgrid2`, actualizarlo también
                const indexA = products.findIndex((p: Product): boolean => p?.id === productoA.id);
                if (indexA !== -1) {
                    products[indexA] = productoA;
                }

                setProducts([productoB]);
            }
            resetProductoA();
            resetProductoB();
        }
       
    };


    const addProductIfAbsent = (product: ProductTypes): void => {

        if (product.id !== productTempDeleted) {

            const existsInProductinArray = products.some((p) => p.id === product.id);

            if (!existsInProductinArray) {
                products.push(product);
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
        <div className="relative  w-[550px] h-[550px] overflow-auto">
            <Image src="/file/demo-2.png" alt="PDF" width={550} height={550} priority/>
            {gridCells.map((cell, index) => {

                const selectedProduct = products?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);

                if (selectedProduct !== undefined && productTempDeleted !== selectedProduct.id) {
                    addProductIfAbsent(selectedProduct);
                }
                return (
                    <div
                        key={cell.id}
                        className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
                        style={{width: cell.width, height: cell.height}}
                        onClick={(e) => {

                                onProductSelect(cell.id, e);                               
                                handleChangeProducts(cell.id.toString());

                            }}
                            onContextMenu={(e) => handleContextMenu(e, cell.id)}
                        >
                            <div className="absolute text-black font-bold">
                                {selectedProduct?.name || cell.id.toString()}
                            </div>
                            {selectedProduct?.image && (
                                <Image
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name || ''}
                                    width={70}
                                    height={70}
                                    objectFit="cover"
                                />
                            )}
                        </div>
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

// export const ImageGrid3 = ({
//                                onProductSelect,
//                                selectedProducts,
//                                isMoveModeActive,
//                                onEditProduct,
//                                onRemoveProduct,
//                                onChangeProduct
//                            }: ImageGridProps) => {
//     const gridCells = [
//         {id: 302, top: "top-[20px] ", left: "left-[125px] ", width: "125px", height: "85px"},
//         {id: 301, top: "top-[20px] ", left: "left-0", width: "125px", height: "85px"},
//         {id: 303, top: "top-[20px] ", left: "left-[250px] ", width: "125px", height: "85px"},
//         {id: 304, top: "top-[110px]", left: "left-0", width: "125px", height: "85px"},
//         {id: 305, top: "top-[110px]", left: "left-[125px] ", width: "125px", height: "85px"},
//         {id: 306, top: "top-[110px]", left: "left-[250px] ", width: "125px", height: "85px"},
//         {id: 307, top: "top-[195px] ", left: "left-0", width: "125px", height: "85px"},
//         {id: 308, top: "top-[195px] ", left: "left-[125px] ", width: "125px", height: "85px"},
//         {id: 309, top: "top-[195px] ", left: "left-[250px] ", width: "125px", height: "85px"},
//         {id: 310, top: "top-[294px]", left: "left-0", width: "80px", height: "86px"},
//         {id: 311, top: "top-[294px]", left: "left-[80px] ", width: "75px", height: "86px"},
//         {id: 312, top: "top-[294px]", left: "left-[155px] ", width: "75px", height: "86px"},
//         {id: 313, top: "top-[294px]", left: "left-[230px] ", width: "75px", height: "86px"},
//         {id: 314, top: "top-[294px]", left: "left-[305px] ", width: "75px", height: "86px"},
//         {id: 315, top: "top-[388px]", left: "left-0", width: "125px", height: "85px"},
//         {id: 316, top: "top-[388px]", left: "left-[128px] ", width: "125px", height: "85px"},
//         {id: 317, top: "top-[388px]", left: "left-[255px] ", width: "125px", height: "85px"},
//         {id: 318, top: "top-[482px]", left: "left-0 ", width: "130px", height: "105px"},
//         {id: 319, top: "top-[482px]", left: "left-[127px]", width: "130px", height: "105px"},
//         {id: 320, top: "top-[482px]", left: "left-[255px]", width: "128px", height: "105px"},
//         {id: 321, top: "top-[589px]", left: "left-0 ", width: "95px", height: "90px"},
//         {id: 322, top: "top-[589px]", left: "left-[95px]", width: "95px", height: "90px"},
//         {id: 323, top: "top-[589px]", left: "left-[190px]", width: "95px", height: "90px"},
//         {id: 324, top: "top-[589px]", left: "left-[285px]", width: "95px", height: "90px"},
//         {id: 325, top: "top-[679px]", left: "left-0", width: "95px", height: "86px"},
//         {id: 326, top: "top-[679px]", left: "left-[95px]", width: "95px", height: "86px"},
//         {id: 327, top: "top-[679px]", left: "left-[190px]", width: "95px", height: "86px"},
//         {id: 328, top: "top-[679px]", left: "left-[285px]", width: "95px", height: "86px"},
//         {id: 329, top: "top-[765px]", left: "left-0", width: "95px", height: "86px"},
//         {id: 330, top: "top-[765px]", left: "left-[95px] ", width: "95px", height: "86px"},
//         {id: 331, top: "top-[765px]", left: "left-[190px]", width: "95px", height: "86px"},
//         {id: 332, top: "top-[765px]", left: "left-[285px] ", width: "95px", height: "86px"},
//         {id: 333, top: "top-[860px]", left: "left-0", width: "95px", height: "86px"},
//         {id: 334, top: "top-[860px]", left: "left-[95px]", width: "95px", height: "86px"},
//         {id: 335, top: "top-[860px]", left: "left-[190px]", width: "95px", height: "86px"},
//         {id: 336, top: "top-[860px]", left: "left-[285px] ", width: "95px", height: "86px"},
//         {id: 337, top: "top-[955px]", left: "left-0", width: "95px", height: "100px"},
//         {id: 338, top: "top-[955px]", left: "left-[95px]", width: "95px", height: "100px"},
//         {id: 339, top: "top-[955px]", left: "left-[190px]", width: "95px", height: "100px"},
//         {id: 340, top: "top-[955px]", left: "left-[285px]", width: "95px", height: "100px"},
//         {id: 341, top: "top-[10px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 342, top: "top-[110px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 343, top: "top-[210px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 344, top: "top-[310px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 345, top: "top-[410px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 346, top: "top-[510px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 347, top: "top-[610px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 348, top: "top-[710px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 349, top: "top-[810px]", left: "left-[385px]", width: "150px", height: "120px"},
//         {id: 350, top: "top-[930px]", left: "left-[385px]", width: "150px", height: "100px"},
//
//     ];
//
//     const [products, setProducts] = useState<ProductTypes[]>([]);
//     const [contextMenu, setContextMenu] = useState<{
//         visible: boolean;
//         x: number;
//         y: number;
//         productId: string;
//     } | null>(null);
//
//
//     useEffect(() => {
//         const fetchProducts = async (): Promise<void> => {
//             try {
//                 const productsData: ProductTypes[] = await getTableName();
//
//                 // Verificar si el array está vacío para llenarlo
//                 if (productsgrid2.length === 0) {
//                     productsData.forEach((product) => {
//                         // Verificar si el producto ya está en `productsgrid2`
//                         const exists = productsgrid2.some((p) => p.id === product.id);
//                         if (!exists) {
//                             productsgrid2.push(product);
//                         } else {
//                             console.warn(`El producto con id ${product.id} ya existe en productsgrid2.`);
//                         }
//                     });
//                     setProducts([productsgrid2[0]]);
//                 }
//
//             } catch (error) {
//                 console.error('Error al obtener productos:', error);
//             }
//         };
//
//         fetchProducts();
//     }, []);
//
//     const removeDeletedProducts = (products: ProductTypes[], deletedProducts: ProductTypes[]): void => {
//         // Filtrar los productos que no están en deletedProducts
//         for (const deletedProduct of deletedProducts) {
//             const index = products.findIndex((product) => product.id === deletedProduct.id);
//             if (index !== -1) {
//                 products.splice(index, 1);
//             }
//         }
//     };
//
//     removeDeletedProducts(productsgrid2, deletedProducts);
//
//
//     const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
//         e.preventDefault();
//         if (isMoveModeActive) return;
//
//
//         // Obtener las coordenadas del clic derecho
//         const container = e.currentTarget.closest('.scroll-container') as HTMLElement;
//         const containerRect = container?.getBoundingClientRect();
//
//         let posX = e.clientX;
//         let posY = e.clientY;
//
//         if (containerRect) {
//             posX = e.clientX - containerRect.left + container.scrollLeft;
//             posY = e.clientY - containerRect.top + container.scrollTop;
//         }
//
//         // Ajustar las coordenadas para evitar que el menú se salga de la pantalla
//         const menuWidth = 150; // Ancho estimado del menú contextual
//         const menuHeight = 200; // Alto estimado del menú contextual
//
//         if (posX + menuWidth > window.innerWidth) {
//             posX -= menuWidth;
//         }
//         if (posY + menuHeight > window.innerHeight) {
//             posY -= menuHeight;
//         }
//
//         // Establecer el estado del menú contextual con las coordenadas ajustadas
//         setContextMenu({
//             visible: true,
//             x: posX,
//             y: posY - 50,
//             productId: cellId.toString(),
//         });
//     };
//     const handleClearCell = (cellId: string): void => {
//         const cellIdNumber: number = parseInt(cellId, 10);
//         const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
//         productTempDeleted = '';
//         if (elementIndex !== -1) {
//             // Guardar el elemento en el array de productos eliminados
//             deletedProducts.push(productsgrid2[elementIndex]);
//             selectedProducts.length = 0;
//
//             // Eliminar el elemento del array
//
//         } else {
//             console.log("Elemento no encontrado.");
//         }
//
//     };
//
//     const handleInitChangeProduct = (Cellid: string): void => {
//         const cellIdNumber: number = parseInt(Cellid, 10);
//         const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
//         if (elementIndex !== -1) {
//             productoA = productsgrid2[elementIndex];
//         }
//
//     }
//
//     const handleChangeProducts = (cellId: string): void => {
//         const cellIdNumber = parseInt(cellId, 10);
//         if (productoA.gridId != undefined && productoA.gridId != cellIdNumber) {
//             const elementIndex: number = productsgrid2.findIndex((p: Product | null): boolean => p?.gridId === cellIdNumber);
//
//             // Si se encuentra la celda (puede ser vacía)
//             if (elementIndex !== -1) {
//                 let productoB = productsgrid2[elementIndex];
//
//                 // Si la celda está vacía (es null o undefined), crear un objeto vacío para `productoB`
//                 if (!productoB) {
//                     productoB = {id: "", image: "", name: "", gridId: cellIdNumber, descriptions: []};
//                 }
//
//                 // Intercambiar las posiciones (gridId) de `productoA` y `productoB`
//                 const tempGridId = productoA.gridId;
//                 productoA.gridId = productoB.gridId;
//                 productoB.gridId = tempGridId;
//
//                 // Actualizar el array `productsgrid2` con los cambios
//                 productsgrid2[elementIndex] = productoB;
//
//                 // Si `productoA` también pertenece a `productsgrid2`, actualizarlo también
//                 const indexA = productsgrid2.findIndex((p: Product): boolean => p?.id === productoA.id);
//                 if (indexA !== -1) {
//                     productsgrid2[indexA] = productoA;
//                 }
//
//                 setProducts([productoB]);
//             }
//             resetProductoA();
//             resetProductoB();
//         }
//         products.length = 0;
//     };
//
//     const addProductIfAbsent = (product: ProductTypes): void => {
//
//         if (product.id !== productTempDeleted) {
//
//             const existsInProductinArray = productsgrid2.some((p) => p.id === product.id);
//
//             if (!existsInProductinArray) {
//                 productsgrid2.push(product);
//                 productTempDeleted = product.id;
//                 selectedProducts.length = 0;
//             }
//
//         }
//
//     };
//    
//     useEffect(() => {
//         const handleClickOutside = () => setContextMenu(null);
//         document.addEventListener('click', handleClickOutside);
//         return () => document.removeEventListener('click', handleClickOutside);
//     }, []);
//
//     return (
//         <div className="relative  w-[550px] h-[550px] overflow-auto">
//             <Image src="/file/demo-2.png" alt="PDF" width={550} height={550} priority/>
//             {gridCells.map((cell, index) => {
//
//                 const selectedProduct = productsgrid2?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);
//
//                 if (selectedProduct !== undefined && productTempDeleted !== selectedProduct.id) {
//                     addProductIfAbsent(selectedProduct);
//                 }
//                 return (
//                     <div
//                         key={cell.id}
//                             className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
//                             style={{width: cell.width, height: cell.height}}
//                             onClick={(e) => {
//
//                                 onProductSelect(cell.id, e);
//                                 handleChangeProducts(cell.id.toString());
//
//                             }}
//                             onContextMenu={(e) => handleContextMenu(e, cell.id)}
//                         >
//                             <div className="absolute text-black font-bold">
//                                 {selectedProduct?.name || cell.id.toString()}
//                             </div>
//                             {selectedProduct?.image && (
//                                 <Image
//                                     src={selectedProduct.image}
//                                     alt={selectedProduct.name || ''}
//                                     width={70}
//                                     height={70}
//                                     objectFit="cover"
//                                 />
//                             )}
//
//
//                     </div>
//                 );
//             })}
//
//             {contextMenu?.visible && (
//                 <div
//                     style={{
//                         position: 'fixed', // Asegúrate de usar fixed para alinear con el viewport
//                         top: `${contextMenu.y}px`,
//                         left: `${contextMenu.x}px`,
//                         zIndex: 1000,
//                     }}
//                 >
//                     <RightClick
//                         productId={contextMenu.productId}
//                         handleRemoveProduct={handleClearCell}
//                         handleEditProduct={onEditProduct}
//                         handleChangeProduct={handleInitChangeProduct}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };
//
//
// export const ImageGrid4 = ({
//                                onProductSelect,
//                                selectedProducts,
//                                isMoveModeActive,
//                                onEditProduct,
//                                onRemoveProduct,
//                                onChangeProduct
//                            }: ImageGridProps) => {
//     const gridCells = [
//         {id: 402, top: "top-[20px] ", left: "left-[125px] ", width: "125px", height: "85px"},
//         {id: 401, top: "top-[20px] ", left: "left-0", width: "125px", height: "85px"},
//         {id: 403, top: "top-[20px] ", left: "left-[250px] ", width: "125px", height: "85px"},
//         {id: 404, top: "top-[110px]", left: "left-0", width: "125px", height: "85px"},
//         {id: 405, top: "top-[110px]", left: "left-[125px] ", width: "125px", height: "85px"},
//         {id: 406, top: "top-[110px]", left: "left-[250px] ", width: "125px", height: "85px"},
//         {id: 407, top: "top-[195px] ", left: "left-0", width: "125px", height: "85px"},
//         {id: 408, top: "top-[195px] ", left: "left-[125px] ", width: "125px", height: "85px"},
//         {id: 409, top: "top-[195px] ", left: "left-[250px] ", width: "125px", height: "85px"},
//         {id: 410, top: "top-[294px]", left: "left-0", width: "80px", height: "86px"},
//         {id: 411, top: "top-[294px]", left: "left-[80px] ", width: "75px", height: "86px"},
//         {id: 412, top: "top-[294px]", left: "left-[155px] ", width: "75px", height: "86px"},
//         {id: 413, top: "top-[294px]", left: "left-[230px] ", width: "75px", height: "86px"},
//         {id: 414, top: "top-[294px]", left: "left-[305px] ", width: "75px", height: "86px"},
//         {id: 415, top: "top-[388px]", left: "left-0", width: "125px", height: "85px"},
//         {id: 416, top: "top-[388px]", left: "left-[128px] ", width: "125px", height: "85px"},
//         {id: 417, top: "top-[388px]", left: "left-[255px] ", width: "125px", height: "85px"},
//         {id: 418, top: "top-[482px]", left: "left-0 ", width: "130px", height: "105px"},
//         {id: 419, top: "top-[482px]", left: "left-[127px]", width: "130px", height: "105px"},
//         {id: 420, top: "top-[482px]", left: "left-[255px]", width: "128px", height: "105px"},
//         {id: 421, top: "top-[589px]", left: "left-0 ", width: "95px", height: "90px"},
//         {id: 422, top: "top-[589px]", left: "left-[95px]", width: "95px", height: "90px"},
//         {id: 423, top: "top-[589px]", left: "left-[190px]", width: "95px", height: "90px"},
//         {id: 424, top: "top-[589px]", left: "left-[285px]", width: "95px", height: "90px"},
//         {id: 425, top: "top-[679px]", left: "left-0", width: "95px", height: "86px"},
//         {id: 426, top: "top-[679px]", left: "left-[95px]", width: "95px", height: "86px"},
//         {id: 427, top: "top-[679px]", left: "left-[190px]", width: "95px", height: "86px"},
//         {id: 428, top: "top-[679px]", left: "left-[285px]", width: "95px", height: "86px"},
//         {id: 429, top: "top-[765px]", left: "left-0", width: "95px", height: "86px"},
//         {id: 430, top: "top-[765px]", left: "left-[95px] ", width: "95px", height: "86px"},
//         {id: 431, top: "top-[765px]", left: "left-[190px]", width: "95px", height: "86px"},
//         {id: 432, top: "top-[765px]", left: "left-[285px] ", width: "95px", height: "86px"},
//         {id: 433, top: "top-[860px]", left: "left-0", width: "95px", height: "86px"},
//         {id: 434, top: "top-[860px]", left: "left-[95px]", width: "95px", height: "86px"},
//         {id: 435, top: "top-[860px]", left: "left-[190px]", width: "95px", height: "86px"},
//         {id: 436, top: "top-[860px]", left: "left-[285px] ", width: "95px", height: "86px"},
//         {id: 437, top: "top-[955px]", left: "left-0", width: "95px", height: "100px"},
//         {id: 438, top: "top-[955px]", left: "left-[95px]", width: "95px", height: "100px"},
//         {id: 439, top: "top-[955px]", left: "left-[190px]", width: "95px", height: "100px"},
//         {id: 440, top: "top-[955px]", left: "left-[285px]", width: "95px", height: "100px"},
//         {id: 441, top: "top-[10px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 442, top: "top-[110px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 443, top: "top-[210px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 444, top: "top-[310px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 445, top: "top-[410px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 446, top: "top-[510px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 447, top: "top-[610px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 448, top: "top-[710px]", left: "left-[385px]", width: "150px", height: "100px"},
//         {id: 449, top: "top-[810px]", left: "left-[385px]", width: "150px", height: "120px"},
//         {id: 450, top: "top-[930px]", left: "left-[385px]", width: "150px", height: "100px"},
//
//     ];
//
//     const [products, setProducts] = useState<ProductTypes[]>([]);
//     const [contextMenu, setContextMenu] = useState<{
//         visible: boolean;
//         x: number;
//         y: number;
//         productId: string;
//     } | null>(null);
//
//
//     useEffect(() => {
//         const fetchProducts = async (): Promise<void> => {
//             try {
//                 const productsData: ProductTypes[] = await getTableName();
//
//                 // Verificar si el array está vacío para llenarlo
//                 if (productsgrid2.length === 0) {
//                     productsData.forEach((product) => {
//                         // Verificar si el producto ya está en `productsgrid2`
//                         const exists = productsgrid2.some((p) => p.id === product.id);
//                         if (!exists) {
//                             productsgrid2.push(product);
//                         } else {
//                             console.warn(`El producto con id ${product.id} ya existe en productsgrid2.`);
//                         }
//                     });
//                     setProducts([productsgrid2[0]]);
//                 }
//
//             } catch (error) {
//                 console.error('Error al obtener productos:', error);
//             }
//         };
//
//         fetchProducts();
//     }, []);
//     const removeDeletedProducts = (products: ProductTypes[], deletedProducts: ProductTypes[]): void => {
//         // Filtrar los productos que no están en deletedProducts
//         for (const deletedProduct of deletedProducts) {
//             const index = products.findIndex((product) => product.id === deletedProduct.id);
//             if (index !== -1) {
//                 products.splice(index, 1);
//             }
//         }
//     };
//
//     removeDeletedProducts(productsgrid2, deletedProducts);
//     const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
//         e.preventDefault();
//         if (isMoveModeActive) return;
//
//
//         // Obtener las coordenadas del clic derecho
//         const container = e.currentTarget.closest('.scroll-container') as HTMLElement;
//         const containerRect = container?.getBoundingClientRect();
//
//         let posX = e.clientX;
//         let posY = e.clientY;
//
//         if (containerRect) {
//             posX = e.clientX - containerRect.left + container.scrollLeft;
//             posY = e.clientY - containerRect.top + container.scrollTop;
//         }
//
//         // Ajustar las coordenadas para evitar que el menú se salga de la pantalla
//         const menuWidth = 150; // Ancho estimado del menú contextual
//         const menuHeight = 200; // Alto estimado del menú contextual
//
//         if (posX + menuWidth > window.innerWidth) {
//             posX -= menuWidth;
//         }
//         if (posY + menuHeight > window.innerHeight) {
//             posY -= menuHeight;
//         }
//
//         // Establecer el estado del menú contextual con las coordenadas ajustadas
//         setContextMenu({
//             visible: true,
//             x: posX,
//             y: posY - 50,
//             productId: cellId.toString(),
//         });
//     };
//     const handleClearCell = (cellId: string): void => {
//         const cellIdNumber: number = parseInt(cellId, 10);
//         const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
//         productTempDeleted = '';
//         if (elementIndex !== -1) {
//             // Guardar el elemento en el array de productos eliminados
//             deletedProducts.push(productsgrid2[elementIndex]);
//             selectedProducts.length = 0;
//
//             // Eliminar el elemento del array
//
//         } else {
//             console.log("Elemento no encontrado.");
//         }
//
//     };
//
//     const handleInitChangeProduct = (Cellid: string): void => {
//         const cellIdNumber: number = parseInt(Cellid, 10);
//         const elementIndex: number = productsgrid2.findIndex((p: Product): boolean => p.gridId === cellIdNumber);
//         if (elementIndex !== -1) {
//             productoA = productsgrid2[elementIndex];
//         }
//
//     }
//
//     const handleChangeProducts = (cellId: string): void => {
//         const cellIdNumber = parseInt(cellId, 10);
//         if (productoA.gridId != undefined && productoA.gridId != cellIdNumber) {
//             const elementIndex: number = productsgrid2.findIndex((p: Product | null): boolean => p?.gridId === cellIdNumber);
//
//             // Si se encuentra la celda (puede ser vacía)
//             if (elementIndex !== -1) {
//                 let productoB = productsgrid2[elementIndex];
//
//                 // Si la celda está vacía (es null o undefined), crear un objeto vacío para `productoB`
//                 if (!productoB) {
//                     productoB = {id: "", image: "", name: "", gridId: cellIdNumber, descriptions: []};
//                 }
//
//                 // Intercambiar las posiciones (gridId) de `productoA` y `productoB`
//                 const tempGridId = productoA.gridId;
//                 productoA.gridId = productoB.gridId;
//                 productoB.gridId = tempGridId;
//
//                 // Actualizar el array `productsgrid2` con los cambios
//                 productsgrid2[elementIndex] = productoB;
//
//                 // Si `productoA` también pertenece a `productsgrid2`, actualizarlo también
//                 const indexA = productsgrid2.findIndex((p: Product): boolean => p?.id === productoA.id);
//                 if (indexA !== -1) {
//                     productsgrid2[indexA] = productoA;
//                 }
//
//                 setProducts([productoB]);
//             }
//             resetProductoA();
//             resetProductoB();
//         }
//         products.length = 0;
//     };
//
//     const addProductIfAbsent = (product: ProductTypes): void => {
//
//         if (product.id !== productTempDeleted) {
//
//             const existsInProductinArray = productsgrid2.some((p) => p.id === product.id);
//
//             if (!existsInProductinArray) {
//                 productsgrid2.push(product);
//                 productTempDeleted = product.id;
//                 selectedProducts.length = 0;
//             }
//
//         }
//
//     };
//     useEffect(() => {
//         const handleClickOutside = () => setContextMenu(null);
//         document.addEventListener('click', handleClickOutside);
//         return () => document.removeEventListener('click', handleClickOutside);
//     }, []);
//
//     return (
//         <div className="relative  w-[550px] h-[550px] overflow-auto">
//             <Image src="/file/demo-2.png" alt="PDF" width={550} height={550} priority/>
//             {gridCells.map((cell, index) => {
//                 const selectedProduct = productsgrid2?.find((p) => p.gridId === cell.id) || selectedProducts?.find((p) => p.gridId === cell.id);
//
//                 if (selectedProduct !== undefined && productTempDeleted !== selectedProduct.id) {
//                     addProductIfAbsent(selectedProduct);
//                 }
//                 return (
//                     <div
//                         key={cell.id}
//                             className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
//                             style={{width: cell.width, height: cell.height}}
//                         onClick={(e) => {
//
//                             onProductSelect(cell.id, e);
//                             handleChangeProducts(cell.id.toString());
//
//                         }}
//                             onContextMenu={(e) => handleContextMenu(e, cell.id)}
//                         >
//                             <div className="absolute text-black font-bold">
//                                 {selectedProduct?.name || cell.id.toString()}
//                             </div>
//                             {selectedProduct?.image && (
//                                 <Image
//                                     src={selectedProduct.image}
//                                     alt={selectedProduct.name || ''}
//                                     width={70}
//                                     height={70}
//                                     objectFit="cover"
//                                 />
//                             )}
//
//
//                         </div>
//                 );
//             })}
//
//             {contextMenu?.visible && (
//                 <div
//                     style={{
//                         position: 'fixed', // Asegúrate de usar fixed para alinear con el viewport
//                         top: `${contextMenu.y}px`,
//                         left: `${contextMenu.x}px`,
//                         zIndex: 1000,
//                     }}
//                 >
//                     <RightClick
//                         productId={contextMenu.productId}
//                         handleRemoveProduct={handleClearCell}
//                         handleEditProduct={onEditProduct}
//                         handleChangeProduct={handleInitChangeProduct}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };  
//
