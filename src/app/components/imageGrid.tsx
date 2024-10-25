import Image from "next/image";
import { useState, useEffect } from "react";
import { getTableName } from "../api/productos/prductosRF";
import Draggable from "react-draggable";

interface Product {
  id: string;
  name: string;
  image: string;
  gridId?: number;
  descriptions?: string[] | undefined;
  key?: string;
}

interface ImageGridProps {
  onProductSelect: (gridId: number) => void;
  selectedProducts: Product[];
}

export const ImageGrid = ({ onProductSelect, selectedProducts = [] }: ImageGridProps) => {
  const gridCells = [
    { id: 1, top: "top-44", left: "left-0", width: "80px", height: "56px" },
    { id: 2, top: "top-44", left: "left-20", width: "80px", height: "56px" },
    { id: 3, top: "top-44", left: "left-40", width: "80px", height: "56px" },
    { id: 4, top: "top-[230px]", left: "left-0", width: "80px", height: "56px" },
    { id: 5, top: "top-[230px]", left: "left-20", width: "80px", height: "56px" },
    { id: 6, top: "top-[230px]", left: "left-40", width: "80px", height: "56px" },
    { id: 7, top: "top-72", left: "left-0", width: "80px", height: "56px" },
    { id: 8, top: "top-72", left: "left-20", width: "80px", height: "56px" },
    { id: 9, top: "top-72", left: "left-40", width: "80px", height: "56px" },
    { id: 10, top: "top-[350px]", left: "left-0", width: "50px", height: "56px" },
    { id: 11, top: "top-[350px]", left: "left-12", width: "50px", height: "56px" },
    { id: 12, top: "top-[350px]", left: "left-24", width: "50px", height: "56px" },
    { id: 13, top: "top-[350px]", left: "left-36", width: "50px", height: "56px" },
    { id: 14, top: "top-[350px]", left: "left-48", width: "50px", height: "56px" },
    { id: 15, top: "top-[410px]", left: "left-0", width: "80px", height: "56px" },
    { id: 16, top: "top-[410px]", left: "left-20", width: "85px", height: "56px" },
    { id: 17, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px" },
    { id: 18, top: "top-44", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 19, top: "top-[240px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 20, top: "top-[310px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 21, top: "top-[370px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 22, top: "top-[420px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 23, top: "top-[480px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 24, top: "top-[540px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 25, top: "top-[600px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 26, top: "top-[660px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 27, top: "top-[720px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 28, top: "top-[775px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 29, top: "top-[470px]", left: "left-0", width: "85px", height: "68px" },
    { id: 30, top: "top-[470px]", left: "left-[85px]", width: "80px", height: "68px" },
    { id: 31, top: "top-[470px]", left: "left-[165px]", width: "80px", height: "68px" },
    { id: 32, top: "top-[540px]", left: "left-0", width: "63px", height: "60px" },
    { id: 33, top: "top-[540px]", left: "left-[63px]", width: "60px", height: "60px" },
    { id: 34, top: "top-[540px]", left: "left-[126px]", width: "58px", height: "60px" },
    { id: 35, top: "top-[540px]", left: "left-[184px]", width: "63px", height: "60px" },
    { id: 36, top: "top-[600px]", left: "left-0", width: "63px", height: "53px" },
    { id: 37, top: "top-[600px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 38, top: "top-[600px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 39, top: "top-[600px]", left: "left-[184px]", width: "63px", height: "53px" },
    { id: 40, top: "top-[650px]", left: "left-0", width: "63px", height: "53px" },
    { id: 41, top: "top-[650px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 42, top: "top-[650px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 43, top: "top-[650px]", left: "left-[184px]", width: "63px", height: "53px" },
    { id: 44, top: "top-[710px]", left: "left-0", width: "63px", height: "53px" },
    { id: 45, top: "top-[710px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 46, top: "top-[710px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 47, top: "top-[710px]", left: "left-[184px]", width: "63px", height: "53px" },
    { id: 48, top: "top-[770px]", left: "left-0", width: "63px", height: "53px" },
    { id: 49, top: "top-[770px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 50, top: "top-[770px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 51, top: "top-[770px]", left: "left-[184px]", width: "63px", height: "53px" },
  ];
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getTableName();
        console.log(productsData);
        setProducts(productsData);
        setLoading(false); 
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setLoading(false); 
      }
    };

    fetchProducts(); 
  }, []); 

  return (
    <div className="relative inline-block">
    {loading ? (
      <div>Cargando productos...</div>
    ) : (
      <>
      <Image src="/file/demo-1.png" alt="PDF" width={340} height={340} priority />
      {gridCells.map((cell, index) => {
  const selectedProduct = products?.find((p) => p.gridId === cell.id) || 
    selectedProducts?.find((p) => p.gridId === cell.id);
    console.log(`Cell ID: ${cell.id}`, selectedProduct);
  return (
    <Draggable key={cell.id}>
      <div
        key={cell.id}
        className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
        style={{ width: cell.width, height: cell.height }}
        onClick={() => onProductSelect(cell.id)}
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
    </Draggable>
        );
      })}
      </>
    )}
    </div>
  );
}



export const ImageGrid2 = ({ onProductSelect, selectedProducts }: ImageGridProps) => {
  const gridCells = [
    { id: 1, top: "top-44", left: "left-0", width: "80px", height: "56px" },
    { id: 2, top: "top-44", left: "left-20", width: "80px", height: "56px" },
    { id: 3, top: "top-44", left: "left-40", width: "80px", height: "56px" },
    { id: 4, top: "top-[230px]", left: "left-0", width: "80px", height: "56px" },
    { id: 5, top: "top-[230px]", left: "left-20", width: "80px", height: "56px" },
    { id: 6, top: "top-[230px]", left: "left-40", width: "80px", height: "56px" },
    { id: 7, top: "top-72", left: "left-0", width: "80px", height: "56px" },
    { id: 8, top: "top-72", left: "left-20", width: "80px", height: "56px" },
    { id: 9, top: "top-72", left: "left-40", width: "80px", height: "56px" },
    { id: 10, top: "top-[350px]", left: "left-0", width: "50px", height: "56px" },
    { id: 11, top: "top-[350px]", left: "left-12", width: "50px", height: "56px" },
    { id: 12, top: "top-[350px]", left: "left-24", width: "50px", height: "56px" },
    { id: 13, top: "top-[350px]", left: "left-36", width: "50px", height: "56px" },
    { id: 14, top: "top-[350px]", left: "left-48", width: "50px", height: "56px" },
    { id: 15, top: "top-[410px]", left: "left-0", width: "80px", height: "56px" },
    { id: 16, top: "top-[410px]", left: "left-20", width: "85px", height: "56px" },
    { id: 17, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px" },
    { id: 0, top: "top-44", left: "left-60", width: "100px", height: "56px" },
    { id: 0, top: "top-[240px]", left: "left-60", width: "100px", height: "56px" },
    { id: 0, top: "top-[310px]", left: "left-60", width: "100px", height: "56px" },
   
  ];

  return (
    <div className="relative inline-block">
      <Image src="/file/demo-1.png" alt="PDF" width={340} height={340} />
      {gridCells.map((cell) => {

        return (
          <div
            key={cell.id}
            className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
            style={{ width: cell.width, height: cell.height }} // Aplicar ancho y alto
            onClick={() => onProductSelect(cell.id)}
          >
            <div className="absolute text-black font-bold">
              {selectedProducts?.name || cell.id.toString()}
            </div>
              {selectedProducts?.image && (
                <Image 
                  src={selectedProducts.image} 
                  alt={selectedProducts.name || ''}
                  width={70} 
                  height={70} 
                  objectFit="cover"
                />
              )}
          </div>
        );
      })}
    </div>
  );
}



