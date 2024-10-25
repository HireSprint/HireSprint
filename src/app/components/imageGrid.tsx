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
    { id: 0101, top: "top-44", left: "left-0", width: "80px", height: "56px" },
    { id: 0102, top: "top-44", left: "left-20", width: "80px", height: "56px" },
    { id: 0103, top: "top-44", left: "left-40", width: "80px", height: "56px" },
    { id: 0104, top: "top-[230px]", left: "left-0", width: "80px", height: "56px" },
    { id: 0105, top: "top-[230px]", left: "left-20", width: "80px", height: "56px" },
    { id: 0106, top: "top-[230px]", left: "left-40", width: "80px", height: "56px" },
    { id: 0107, top: "top-72", left: "left-0", width: "80px", height: "56px" },
    { id: 0108, top: "top-72", left: "left-20", width: "80px", height: "56px" },
    { id: 0109, top: "top-72", left: "left-40", width: "80px", height: "56px" },
    { id: 0110, top: "top-[350px]", left: "left-0", width: "50px", height: "56px" },
    { id: 0111, top: "top-[350px]", left: "left-12", width: "50px", height: "56px" },
    { id: 0112, top: "top-[350px]", left: "left-24", width: "50px", height: "56px" },
    { id: 0113, top: "top-[350px]", left: "left-36", width: "50px", height: "56px" },
    { id: 0114, top: "top-[350px]", left: "left-48", width: "50px", height: "56px" },
    { id: 0115, top: "top-[410px]", left: "left-0", width: "80px", height: "56px" },
    { id: 0116, top: "top-[410px]", left: "left-20", width: "85px", height: "56px" },
    { id: 0117, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px" },
    { id: 0118, top: "top-44", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0119, top: "top-[240px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0120, top: "top-[310px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0121, top: "top-[370px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0122, top: "top-[420px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0123, top: "top-[480px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0124, top: "top-[540px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0125, top: "top-[600px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0126, top: "top-[660px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0127, top: "top-[720px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0128, top: "top-[775px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 0129, top: "top-[470px]", left: "left-0", width: "85px", height: "68px" },
    { id: 0130, top: "top-[470px]", left: "left-[85px]", width: "80px", height: "68px" },
    { id: 0131, top: "top-[470px]", left: "left-[165px]", width: "80px", height: "68px" },
    { id: 0132, top: "top-[540px]", left: "left-0", width: "63px", height: "60px" },
    { id: 0133, top: "top-[540px]", left: "left-[63px]", width: "60px", height: "60px" },
    { id: 0134, top: "top-[540px]", left: "left-[126px]", width: "58px", height: "60px" },
    { id: 0135, top: "top-[540px]", left: "left-[184px]", width: "63px", height: "60px" },
    { id: 0136, top: "top-[600px]", left: "left-0", width: "63px", height: "53px" },
    { id: 0137, top: "top-[600px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 0138, top: "top-[600px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 0139, top: "top-[600px]", left: "left-[184px]", width: "63px", height: "53px" },
    { id: 0140, top: "top-[650px]", left: "left-0", width: "63px", height: "53px" },
    { id: 0141, top: "top-[650px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 0142, top: "top-[650px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 0143, top: "top-[650px]", left: "left-[184px]", width: "63px", height: "53px" },
    { id: 0144, top: "top-[710px]", left: "left-0", width: "63px", height: "53px" },
    { id: 0145, top: "top-[710px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 0146, top: "top-[710px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 0147, top: "top-[710px]", left: "left-[184px]", width: "63px", height: "53px" },
    { id: 0148, top: "top-[770px]", left: "left-0", width: "63px", height: "53px" },
    { id: 0149, top: "top-[770px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 0150, top: "top-[770px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 0151, top: "top-[770px]", left: "left-[184px]", width: "63px", height: "53px" },
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


export const ImageGrid2 = ({ onProductSelect, selectedProducts}: ImageGridProps) => {
  const gridCells = [
    { id: 0201, top: "top-44", left: "left-0", width: "80px", height: "56px" },
    { id: 0202, top: "top-44", left: "left-20", width: "80px", height: "56px" },
    { id: 0203, top: "top-44", left: "left-40", width: "80px", height: "56px" },
    { id: 0204, top: "top-[230px]", left: "left-0", width: "80px", height: "56px" },
    { id: 0205, top: "top-[230px]", left: "left-20", width: "80px", height: "56px" },
    { id: 0206, top: "top-[230px]", left: "left-40", width: "80px", height: "56px" },
    { id: 0207, top: "top-72", left: "left-0", width: "80px", height: "56px" },
    { id: 0208, top: "top-72", left: "left-20", width: "80px", height: "56px" },
    { id: 0209, top: "top-72", left: "left-40", width: "80px", height: "56px" },
    { id: 0210, top: "top-[350px]", left: "left-0", width: "50px", height: "56px" },
    { id: 0211, top: "top-[350px]", left: "left-12", width: "50px", height: "56px" },
    { id: 0212, top: "top-[350px]", left: "left-24", width: "50px", height: "56px" },
    { id: 0213, top: "top-[350px]", left: "left-36", width: "50px", height: "56px" },
    { id: 0214, top: "top-[350px]", left: "left-48", width: "50px", height: "56px" },
    { id: 0215, top: "top-[410px]", left: "left-0", width: "80px", height: "56px" },
    { id: 0216, top: "top-[410px]", left: "left-20", width: "85px", height: "56px" },
    { id: 0217, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px" },

    { id: 0218, top: "top-44", left: "left-60", width: "100px", height: "56px" },
    { id: 0219, top: "top-[240px]", left: "left-60", width: "100px", height: "56px" },
    { id: 0220, top: "top-[310px]", left: "left-60", width: "100px", height: "56px" },
   
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

export const ImageGrid3 = ({onProductSelect, selectedProducts}: ImageGridProps) => {
  const gridCells = [
    {id: 0301, top: "top-44", left: "left-0", width: "80px", height: "56px"},
    {id: 0302, top: "top-44", left: "left-20", width: "80px", height: "56px"},
    {id: 0303, top: "top-44", left: "left-40", width: "80px", height: "56px"},
    {id: 0304, top: "top-[230px]", left: "left-0", width: "80px", height: "56px"},
    {id: 0305, top: "top-[230px]", left: "left-20", width: "80px", height: "56px"},
    {id: 0306, top: "top-[230px]", left: "left-40", width: "80px", height: "56px"},
    {id: 0307, top: "top-72", left: "left-0", width: "80px", height: "56px"},
    {id: 0308, top: "top-72", left: "left-20", width: "80px", height: "56px"},
    {id: 0309, top: "top-72", left: "left-40", width: "80px", height: "56px"},
    {id: 0310, top: "top-[350px]", left: "left-0", width: "50px", height: "56px"},
    {id: 0311, top: "top-[350px]", left: "left-12", width: "50px", height: "56px"},
    {id: 0312, top: "top-[350px]", left: "left-24", width: "50px", height: "56px"},
    {id: 0313, top: "top-[350px]", left: "left-36", width: "50px", height: "56px"},
    {id: 0314, top: "top-[350px]", left: "left-48", width: "50px", height: "56px"},
    {id: 0315, top: "top-[410px]", left: "left-0", width: "80px", height: "56px"},
    {id: 0316, top: "top-[410px]", left: "left-20", width: "85px", height: "56px"},
    {id: 0317, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px"},

    {id: 0318, top: "top-44", left: "left-60", width: "100px", height: "56px"},
    {id: 0319, top: "top-[240px]", left: "left-60", width: "100px", height: "56px"},
    {id: 0320, top: "top-[310px]", left: "left-60", width: "100px", height: "56px"},

  ];

  return (
      <div className="relative inline-block">
        <Image src="/file/demo-1.png" alt="PDF" width={340} height={340}/>
        {gridCells.map((cell) => {

          return (
              <div
                  key={cell.id}
                  className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
                  style={{width: cell.width, height: cell.height}} // Aplicar ancho y alto
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

export const ImageGrid4 = ({onProductSelect, selectedProducts}: ImageGridProps) => {
  const gridCells = [
    {id: 0401, top: "top-44", left: "left-0", width: "80px", height: "56px"},
    {id: 0402, top: "top-44", left: "left-20", width: "80px", height: "56px"},
    {id: 0403, top: "top-44", left: "left-40", width: "80px", height: "56px"},
    {id: 0404, top: "top-[230px]", left: "left-0", width: "80px", height: "56px"},
    {id: 0405, top: "top-[230px]", left: "left-20", width: "80px", height: "56px"},
    {id: 0406, top: "top-[230px]", left: "left-40", width: "80px", height: "56px"},
    {id: 0407, top: "top-72", left: "left-0", width: "80px", height: "56px"},
    {id: 0408, top: "top-72", left: "left-20", width: "80px", height: "56px"},
    {id: 0409, top: "top-72", left: "left-40", width: "80px", height: "56px"},
    {id: 0410, top: "top-[350px]", left: "left-0", width: "50px", height: "56px"},
    {id: 0411, top: "top-[350px]", left: "left-12", width: "50px", height: "56px"},
    {id: 0412, top: "top-[350px]", left: "left-24", width: "50px", height: "56px"},
    {id: 0413, top: "top-[350px]", left: "left-36", width: "50px", height: "56px"},
    {id: 0414, top: "top-[350px]", left: "left-48", width: "50px", height: "56px"},
    {id: 0415, top: "top-[410px]", left: "left-0", width: "80px", height: "56px"},
    {id: 0416, top: "top-[410px]", left: "left-20", width: "85px", height: "56px"},
    {id: 0417, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px"},
         
    {id: 0418, top: "top-44", left: "left-60", width: "100px", height: "56px"},
    {id: 0419, top: "top-[240px]", left: "left-60", width: "100px", height: "56px"},
    {id: 0420, top: "top-[310px]", left: "left-60", width: "100px", height: "56px"},

  ];

  return (
      <div className="relative inline-block">
        <Image src="/file/demo-1.png" alt="PDF" width={340} height={340}/>
        {gridCells.map((cell) => {

          return (
              <div
                  key={cell.id}
                  className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
                  style={{width: cell.width, height: cell.height}} // Aplicar ancho y alto
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

export const ImageGrid5 = ({onProductSelect, selectedProducts}: ImageGridProps) => {
  const gridCells = [
    {id: 0501, top: "top-44", left: "left-0", width: "80px", height: "56px"},
    {id: 0502, top: "top-44", left: "left-20", width: "80px", height: "56px"},
    {id: 0503, top: "top-44", left: "left-40", width: "80px", height: "56px"},
    {id: 0504, top: "top-[230px]", left: "left-0", width: "80px", height: "56px"},
    {id: 0505, top: "top-[230px]", left: "left-20", width: "80px", height: "56px"},
    {id: 0506, top: "top-[230px]", left: "left-40", width: "80px", height: "56px"},
    {id: 0507, top: "top-72", left: "left-0", width: "80px", height: "56px"},
    {id: 0508, top: "top-72", left: "left-20", width: "80px", height: "56px"},
    {id: 0509, top: "top-72", left: "left-40", width: "80px", height: "56px"},
    {id: 0510, top: "top-[350px]", left: "left-0", width: "50px", height: "56px"},
    {id: 0511, top: "top-[350px]", left: "left-12", width: "50px", height: "56px"},
    {id: 0512, top: "top-[350px]", left: "left-24", width: "50px", height: "56px"},
    {id: 0513, top: "top-[350px]", left: "left-36", width: "50px", height: "56px"},
    {id: 0514, top: "top-[350px]", left: "left-48", width: "50px", height: "56px"},
    {id: 0515, top: "top-[410px]", left: "left-0", width: "80px", height: "56px"},
    {id: 0516, top: "top-[410px]", left: "left-20", width: "85px", height: "56px"},
    {id: 0517, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px"},
         
    {id: 0518, top: "top-44", left: "left-60", width: "100px", height: "56px"},
    {id: 0519, top: "top-[240px]", left: "left-60", width: "100px", height: "56px"},
    {id: 0520, top: "top-[310px]", left: "left-60", width: "100px", height: "56px"},

  ];

  return (
      <div className="relative inline-block">
        <Image src="/file/demo-1.png" alt="PDF" width={340} height={340}/>
        {gridCells.map((cell) => {

          return (
              <div
                  key={cell.id}
                  className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
                  style={{width: cell.width, height: cell.height}} // Aplicar ancho y alto
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



