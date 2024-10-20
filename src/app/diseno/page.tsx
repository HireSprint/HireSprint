"use client"
import  { CardSide, CardProduct} from "../components/card";
import { getProductsRF } from "../api/productos/prductosRF";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import LoadingLottie from "../components/lottie/loading-Lottie.json";
import Sidebar from "../components/sideBar";
import { motion } from "framer-motion"; // Para animaciones
import Image from "next/image";


interface Product
{
  id: string;
  name: string;
  image: string;
  gridId?: number;
}
interface Grid
{
  id: number;
  product: Product | null; 
}


const Diseno = () => {
  const [showProducts, setShowProducts] = useState(false);
  const [selectedGridId, setSelectedGridId] = useState<number | null>(null); 
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [grids, setGrids] = useState<Grid[]>([]); // Añadido para evitar error de 'setGrids' no definido


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProductsRF();
        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  


  const handleProductSelect = (product: Product) => {
    if (selectedGridId === null) return;
  
    const productWithGrid = { ...product, gridId: selectedGridId };
    setGrids((prevGrids) =>
      prevGrids.map((grid: Grid) =>
        grid.id === selectedGridId ? { ...grid, product: productWithGrid } : grid
      )
    );
  
    // Verificar si ya existe un producto para el mismo gridId
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.gridId === selectedGridId);
      if (exists) {
        // Reemplazar producto existente
        return prev.map((p) =>
          p.gridId === selectedGridId ? productWithGrid : p
        );
      } else {
        // Añadir nuevo producto
        return [...prev, productWithGrid];
      }
    });
  };

  const obtenerPosicionClick = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    console.log(`Posición del click - X: ${x}, Y: ${y}`);
  };

  useEffect(() => {
    window.addEventListener('click', obtenerPosicionClick);
    return () => {
      window.removeEventListener('click', obtenerPosicionClick);
    };
  }, []);

  return (
    <div className=" flex flex-col h-screen items-center justify-center">
      <div className="grid grid-cols-2 gap-4 w-full h-[85vh] ">
        <div className=" p-2 border-2 border-black flex justify-center items-center">
          <Image src="/file/circularMain.png" alt="PDF" width={340} height={340} />
        </div>

        <div className="border-2 border-black flex justify-center items-center">
          <Image src="/file/demo-1.png" alt="PDF" width={340} height={340} />
        <div
          className="flex border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '295px', left: '1275px', width: '75px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(1);
          }}
        >
          {selectedProducts.find((p) => p.gridId === 1)?.name || '1'}
        </div>
        <div
          className="flex border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '295px', left: '1355px', width: '75px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(2);
          }}
        ><p className="absolute text-xs">
          {selectedProducts.find((p) => p.gridId === 2)?.name || '2'}
        </p>
          {selectedProducts.find((p) => p.gridId === 2)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 2)!.image} 
              alt={selectedProducts.find((p) => p.gridId === 2)?.name || ''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="flex border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '295px', left: '1435px', width: '75px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(3);
          }}
        ><p className="absolute">
          {selectedProducts.find((p) => p.gridId === 3)?.name || '3'}
        </p>
          {selectedProducts.find((p) => p.gridId === 3)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 3)!.image} 
              alt={selectedProducts.find((p) => p.gridId === 3)?.name || ''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="flex border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '350px', left: '1275px', width: '75px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(4);
          }}
        ><p className="absolute">
          {selectedProducts.find((p) => p.gridId === 4)?.name || '4'}
        </p>
          {selectedProducts.find((p) => p.gridId === 4)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 4)!.image} 
              alt={selectedProducts.find((p) => p.gridId === 4)?.name || ''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="flex border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '350px', left: '1355px', width: '75px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(5);
          }}
        ><p className="absolute">
          {selectedProducts.find((p) => p.gridId === 5)?.name || '5'}
        </p>
          {selectedProducts.find((p) => p.gridId === 5)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 5)!.image} 
              alt={selectedProducts.find((p) => p.gridId === 5)?.name || ''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="flex border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '350px', left: '1435px', width: '75px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(6);
          }}
        ><p className="">
          {selectedProducts.find((p) => p.gridId === 6)?.name || '6'}
        </p>
          {selectedProducts.find((p) => p.gridId === 6)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 6)!.image} 
              alt={selectedProducts.find((p) => p.gridId === 6)?.name || ''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="flex border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '350px', left: '1520px', width: '95px', height: '65px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(11);
          }}
        ><p className="">
          {selectedProducts.find((p) => p.gridId === 11)?.name || '11'}
        </p>
          {selectedProducts.find((p) => p.gridId === 11)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 11)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '290px', left: '1520px', width: '95px', height: '60px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(10);
          }}
        >
          <p className="absolute">
          {selectedProducts.find((p) => p.gridId === 10)?.name || '10'}
          </p>
          {selectedProducts.find((p) => p.gridId === 10)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 10)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '405px', left: '1435px', width: '75px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(9);
          }}
        >
          <p className="absolute">
          {selectedProducts.find((p) => p.gridId === 9)?.name || '9'}
          </p>
          {selectedProducts.find((p) => p.gridId === 9)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 9)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '425px', left: '1520px', width: '95px', height: '65px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(12);
          }}
        >
          <p className="absolute">
          {selectedProducts.find((p) => p.gridId === 12)?.name || '12'}
          </p>
          {selectedProducts.find((p) => p.gridId === 12)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 12)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '405px', left: '1275px', width: '75px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(7);
          }}
        >
          <p className="absolute">
          {selectedProducts.find((p) => p.gridId === 7)?.name || '7'}
          </p>
          {selectedProducts.find((p) => p.gridId === 7)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 7)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '405px', left: '1355px', width: '75px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(8);
          }}
        >
          <p className="absolute">
          {selectedProducts.find((p) => p.gridId === 8)?.name || '8'}
          </p>
          {selectedProducts.find((p) => p.gridId === 8)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 8)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '470px', left: '1275px', width: '45px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(13);
          }}
        >
          <p className="absolute">
          {selectedProducts.find((p) => p.gridId === 13)?.name || '13'}
          </p>
          {selectedProducts.find((p) => p.gridId === 13)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 13)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '470px', left: '1325px', width: '45px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(14);
          }}
        >
          <p className="absolute">
          {selectedProducts.find((p) => p.gridId === 14)?.name || '14'}
          </p>
          {selectedProducts.find((p) => p.gridId === 14)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 14)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '470px', left: '1375px', width: '45px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(15);
          }}
        >
          <p className="absolute">
          {selectedProducts.find((p) => p.gridId === 15)?.name || '15'}
          </p>
          {selectedProducts.find((p) => p.gridId === 15)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 15)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '470px', left: '1425px', width: '45px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(16);
          }}
        >
          <p className="absolute">
          {selectedProducts.find((p) => p.gridId === 16)?.name || '16'}
          </p>
          {selectedProducts.find((p) => p.gridId === 16)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 16)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        <div
          className="border-2 border-black absolute rounded cursor-pointer text-black hover:bg-red-300 text-center text-xs items-center justify-end"
          style={{ top: '470px', left: '1475px', width: '45px', height: '50px' }}
          onClick={() => {
            setShowProducts(true);
            setSelectedGridId(17);
          }}
        >
          <p className="absolute">
            {selectedProducts.find((p) => p.gridId === 17)?.name || '17'}
          </p>
          {selectedProducts.find((p) => p.gridId === 17)?.image && (
            <Image 
              src={selectedProducts.find((p) => p.gridId === 17)!.image} 
              alt={''}
              width={50} 
              height={30} 
              objectFit="contain"
            />
          )}
        </div>
        </div>
      </div>

      {/* Mostrar / Ocultar productos */}
      <div className="flex mt-4">
        {showProducts ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-[70vh] left-0 w-full bg-gray-200 p-4"
          >
            <GridProduct
              products={products}
              loading={loading}
              onProductSelect={handleProductSelect}
              onHideProducts={() => setShowProducts(false)}
            />
          </motion.div>
        ) : (
          <button
            onClick={() => setShowProducts(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Mostrar Productos
          </button>
        )}
      </div>

      <button
        className="absolute right-0 bg-black w-12 h-20 rounded-l-full"
        onClick={() => setSideBarVisible(true)}
      >
      </button>

      {/* Sidebar de productos seleccionados */}
      {sideBarVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute right-0 bg-white w-64 h-full shadow-lg"
        >
          <Sidebar
            selectedProducts={selectedProducts}
            onClose={() => setSideBarVisible(false)}
          />
        </motion.div>
      )}
    </div>
  );
};

interface GridProductProps {
  products: Product[];
  loading: boolean;
  onProductSelect: (product: Product) => void;
  onHideProducts?: () => void;
}

const GridProduct: React.FC<GridProductProps> = ({
  products,
  loading,
  onProductSelect,
  onHideProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" bg-gray-200">
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded text-black"
        />
        <button
          onClick={onHideProducts}
          className="bg-red-500 text-white p-2 rounded"
        >
          Ocultar Productos
        </button>
      </div>
      <div>
        
      </div>

      <div className="flex overflow-x-auto space-x-4 whitespace-nowrap">
        {loading ? (
          <div className="flex justify-center items-center w-64 h-64">
            <Lottie animationData={LoadingLottie} />
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CardProduct
              product={product}
              key={product.id}
              onProductSelect={onProductSelect}
            />
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default Diseno
