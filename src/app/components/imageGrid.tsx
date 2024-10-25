import Image from "next/image";
import { useState, useEffect } from "react";
import { getTableName } from "../api/productos/prductosRF";
import Draggable from "react-draggable";
import RightClick from "./rightClick";

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
  onRemoveProduct: (productId: string) => void;
  onEditProduct: (productId: string) => void;
  onChangeProduct: (productId: string) => void;
}

export const ImageGrid = ({ 
  onProductSelect, 
  selectedProducts, 
  onRemoveProduct,
  onEditProduct,
  onChangeProduct 
}: ImageGridProps) => {
  const gridCells = [
    { id: 101, top: "top-44", left: "left-0", width: "80px", height: "56px" },
    { id: 102, top: "top-44", left: "left-20", width: "80px", height: "56px" },
    { id: 103, top: "top-44", left: "left-40", width: "80px", height: "56px" },
    { id: 104, top: "top-[230px]", left: "left-0", width: "80px", height: "56px" },
    { id: 105, top: "top-[230px]", left: "left-20", width: "80px", height: "56px" },
    { id: 106, top: "top-[230px]", left: "left-40", width: "80px", height: "56px" },
    { id: 107, top: "top-72", left: "left-0", width: "80px", height: "56px" },
    { id: 108, top: "top-72", left: "left-20", width: "80px", height: "56px" },
    { id: 109, top: "top-72", left: "left-40", width: "80px", height: "56px" },
    { id: 110, top: "top-[350px]", left: "left-0", width: "50px", height: "56px" },
    { id: 111, top: "top-[350px]", left: "left-12", width: "50px", height: "56px" },
    { id: 112, top: "top-[350px]", left: "left-24", width: "50px", height: "56px" },
    { id: 113, top: "top-[350px]", left: "left-36", width: "50px", height: "56px" },
    { id: 114, top: "top-[350px]", left: "left-48", width: "50px", height: "56px" },
    { id: 115, top: "top-[410px]", left: "left-0", width: "80px", height: "56px" },
    { id: 116, top: "top-[410px]", left: "left-20", width: "85px", height: "56px" },
    { id: 117, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px" },
    { id: 118, top: "top-44", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 119, top: "top-[240px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 120, top: "top-[310px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 121, top: "top-[370px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 122, top: "top-[420px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 123, top: "top-[480px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 124, top: "top-[540px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 125, top: "top-[600px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 126, top: "top-[660px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 127, top: "top-[720px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 128, top: "top-[775px]", left: "left-[245px]", width: "95px", height: "56px" },
    { id: 129, top: "top-[470px]", left: "left-0", width: "85px", height: "68px" },
    { id: 130, top: "top-[470px]", left: "left-[85px]", width: "80px", height: "68px" },
    { id: 131, top: "top-[470px]", left: "left-[165px]", width: "80px", height: "68px" },
    { id: 132, top: "top-[540px]", left: "left-0", width: "63px", height: "60px" },
    { id: 133, top: "top-[540px]", left: "left-[63px]", width: "60px", height: "60px" },
    { id: 134, top: "top-[540px]", left: "left-[126px]", width: "58px", height: "60px" },
    { id: 135, top: "top-[540px]", left: "left-[184px]", width: "63px", height: "60px" },
    { id: 136, top: "top-[600px]", left: "left-0", width: "63px", height: "53px" },
    { id: 137, top: "top-[600px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 138, top: "top-[600px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 139, top: "top-[600px]", left: "left-[184px]", width: "63px", height: "53px" },
    { id: 140, top: "top-[650px]", left: "left-0", width: "63px", height: "53px" },
    { id: 141, top: "top-[650px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 142, top: "top-[650px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 143, top: "top-[650px]", left: "left-[184px]", width: "63px", height: "53px" },
    { id: 144, top: "top-[710px]", left: "left-0", width: "63px", height: "53px" },
    { id: 145, top: "top-[710px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 146, top: "top-[710px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 147, top: "top-[710px]", left: "left-[184px]", width: "63px", height: "53px" },
    { id: 148, top: "top-[770px]", left: "left-0", width: "63px", height: "53px" },
    { id: 149, top: "top-[770px]", left: "left-[63px]", width: "60px", height: "53px" },
    { id: 150, top: "top-[770px]", left: "left-[126px]", width: "58px", height: "53px" },
    { id: 151, top: "top-[770px]", left: "left-[184px]", width: "63px", height: "53px" },
  ];
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    productId: string;
  } | null>(null);

{ /* useEffect(() => {
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
  }, []); */}

  const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      productId: cellId.toString()
    });
  };


  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
  
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
      </Draggable>
    );
  })}

  {contextMenu?.visible && (
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


export const ImageGrid2 = ({ onProductSelect, selectedProducts}: ImageGridProps) => {
  const gridCells = [
    { id: 201, top: "top-44", left: "left-0", width: "80px", height: "56px" },
    { id: 202, top: "top-44", left: "left-20", width: "80px", height: "56px" },
    { id: 203, top: "top-44", left: "left-40", width: "80px", height: "56px" },
    { id: 204, top: "top-[230px]", left: "left-0", width: "80px", height: "56px" },
    { id: 205, top: "top-[230px]", left: "left-20", width: "80px", height: "56px" },
    { id: 206, top: "top-[230px]", left: "left-40", width: "80px", height: "56px" },
    { id: 207, top: "top-72", left: "left-0", width: "80px", height: "56px" },
    { id: 208, top: "top-72", left: "left-20", width: "80px", height: "56px" },
    { id: 209, top: "top-72", left: "left-40", width: "80px", height: "56px" },
    { id: 210, top: "top-[350px]", left: "left-0", width: "50px", height: "56px" },
    { id: 211, top: "top-[350px]", left: "left-12", width: "50px", height: "56px" },
    { id: 212, top: "top-[350px]", left: "left-24", width: "50px", height: "56px" },
    { id: 213, top: "top-[350px]", left: "left-36", width: "50px", height: "56px" },
    { id: 214, top: "top-[350px]", left: "left-48", width: "50px", height: "56px" },
    { id: 215, top: "top-[410px]", left: "left-0", width: "80px", height: "56px" },
    { id: 216, top: "top-[410px]", left: "left-20", width: "85px", height: "56px" },
    { id: 217, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px" },
    { id: 218, top: "top-44", left: "left-60", width: "100px", height: "56px" },
    { id: 219, top: "top-[240px]", left: "left-60", width: "100px", height: "56px" },
    { id: 220, top: "top-[310px]", left: "left-60", width: "100px", height: "56px" },
   
  ];

  const [products, setProducts] = useState<Product[]>([]); 
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    productId: string;
  } | null>(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getTableName();
        setProducts(productsData);
      } catch (error) {
        console.error('Error al obtener productos:', error)
      }
    };

    fetchProducts(); 
  }, []); 

  const handleContextMenu = (e: React.MouseEvent, cellId: number) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      productId: cellId.toString()
    });
  };

  const handleRemoveProduct = (productId: string) => {
    // Implementa la lógica para eliminar el producto
    console.log('Eliminar producto:', productId);
    setContextMenu(null);
  };

  const handleEditProduct = (productId: string) => {
    // Implementa la lógica para editar el producto
    console.log('Editar producto:', productId);
    setContextMenu(null);
  };

  const handleChangeProduct = (productId: string) => {
    // Implementa la lógica para cambiar el producto
    console.log('Cambiar producto:', productId);
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">

      <Image src="/file/demo-1.png" alt="PDF" width={340} height={340} priority />
      {gridCells.map((cell, index) => {
  const selectedProduct = products?.find((p) => p.gridId === cell.id) || 
    selectedProducts?.find((p) => p.gridId === cell.id);

    return (
      <Draggable key={cell.id}>
        <div
          key={cell.id}
          className={`absolute flex border-2 border-black ${cell.top} ${cell.left} rounded cursor-pointer hover:bg-red-300 text-center text-xs items-center justify-end`}
          style={{ width: cell.width, height: cell.height }}
          onClick={() => onProductSelect(cell.id)}
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
      </Draggable>
    );
  })}

  {contextMenu?.visible && (
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
        handleRemoveProduct={handleRemoveProduct}
        handleEditProduct={handleEditProduct}
        handleChangeProduct={handleChangeProduct}
      />
    </div>
  )}
</div>
);
};

export const ImageGrid3 = ({onProductSelect, selectedProducts}: ImageGridProps) => {
  const gridCells = [
    {id: 301, top: "top-44", left: "left-0", width: "80px", height: "56px"},
    {id: 302, top: "top-44", left: "left-20", width: "80px", height: "56px"},
    {id: 303, top: "top-44", left: "left-40", width: "80px", height: "56px"},
    {id: 304, top: "top-[230px]", left: "left-0", width: "80px", height: "56px"},
    {id: 305, top: "top-[230px]", left: "left-20", width: "80px", height: "56px"},
    {id: 306, top: "top-[230px]", left: "left-40", width: "80px", height: "56px"},
    {id: 307, top: "top-72", left: "left-0", width: "80px", height: "56px"},
    {id: 308, top: "top-72", left: "left-20", width: "80px", height: "56px"},
    {id: 309, top: "top-72", left: "left-40", width: "80px", height: "56px"},
    {id: 310, top: "top-[350px]", left: "left-0", width: "50px", height: "56px"},
    {id: 311, top: "top-[350px]", left: "left-12", width: "50px", height: "56px"},
    {id: 312, top: "top-[350px]", left: "left-24", width: "50px", height: "56px"},
    {id: 313, top: "top-[350px]", left: "left-36", width: "50px", height: "56px"},
    {id: 314, top: "top-[350px]", left: "left-48", width: "50px", height: "56px"},
    {id: 315, top: "top-[410px]", left: "left-0", width: "80px", height: "56px"},
    {id: 316, top: "top-[410px]", left: "left-20", width: "85px", height: "56px"},
    {id: 317, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px"},
    {id: 318, top: "top-44", left: "left-60", width: "100px", height: "56px"},
    {id: 319, top: "top-[240px]", left: "left-60", width: "100px", height: "56px"},
    {id: 320, top: "top-[310px]", left: "left-60", width: "100px", height: "56px"},

  ];

  const [products, setProducts] = useState<Product[]>([]); 
 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getTableName();
        setProducts(productsData);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProducts(); 
  }, []); 

  return (
    <div className="relative inline-block">

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
    </div>
  );
}


export const ImageGrid4 = ({onProductSelect, selectedProducts}: ImageGridProps) => {
  const gridCells = [
    {id: 401, top: "top-44", left: "left-0", width: "80px", height: "56px"},
    {id: 402, top: "top-44", left: "left-20", width: "80px", height: "56px"},
    {id: 403, top: "top-44", left: "left-40", width: "80px", height: "56px"},
    {id: 404, top: "top-[230px]", left: "left-0", width: "80px", height: "56px"},
    {id: 405, top: "top-[230px]", left: "left-20", width: "80px", height: "56px"},
    {id: 406, top: "top-[230px]", left: "left-40", width: "80px", height: "56px"},
    {id: 407, top: "top-72", left: "left-0", width: "80px", height: "56px"},
    {id: 408, top: "top-72", left: "left-20", width: "80px", height: "56px"},
    {id: 409, top: "top-72", left: "left-40", width: "80px", height: "56px"},
    {id: 410, top: "top-[350px]", left: "left-0", width: "50px", height: "56px"},
    {id: 411, top: "top-[350px]", left: "left-12", width: "50px", height: "56px"},
    {id: 412, top: "top-[350px]", left: "left-24", width: "50px", height: "56px"},
    {id: 413, top: "top-[350px]", left: "left-36", width: "50px", height: "56px"},
    {id: 414, top: "top-[350px]", left: "left-48", width: "50px", height: "56px"},
    {id: 415, top: "top-[410px]", left: "left-0", width: "80px", height: "56px"},
    {id: 416, top: "top-[410px]", left: "left-20", width: "85px", height: "56px"},
    {id: 417, top: "top-[410px]", left: "left-[165px]", width: "80px", height: "56px"},  
    {id: 418, top: "top-44", left: "left-60", width: "100px", height: "56px"},
    {id: 419, top: "top-[240px]", left: "left-60", width: "100px", height: "56px"},
    {id: 420, top: "top-[310px]", left: "left-60", width: "100px", height: "56px"},

  ];

  const [products, setProducts] = useState<Product[]>([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getTableName();
        setProducts(productsData);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProducts(); 
  }, []); 

  return (
    <div className="relative inline-block">
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
    </div>
  );
}
