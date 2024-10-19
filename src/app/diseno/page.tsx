"use client"
import  { CardSide, CardProduct} from "../components/card";
import MyDropzone from "../components/dropA";
import { getProductsRF } from "../api/productos/prductosRF";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import LoadingLottie from "../components/lottie/loading-Lottie.json";
import Sidebar from "../components/sideBar";
import { motion } from "framer-motion"; // Para animaciones
import PdfViewerComponent from "../components/PdfViewerComponent";

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
  const [selectedGridId, setSelectedGridId] = useState<number | null>(null); // Estado para el grid seleccionado
  const [grids, setGrids] = useState<Grid[]>(generateDefaultGrids());
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sideBarVisible, setSideBarVisible] = useState(false);


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

  // Grids predeterminados
  function generateDefaultGrids(): Grid[] {
    return Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      product: null,
    }));
  }


  const handleProductSelect = (product: Product) => {
    if (selectedGridId === null) return;
  
    const productWithGrid = { ...product, gridId: selectedGridId };
  
    // Actualizar el grid seleccionado con el nuevo producto
    setGrids((prevGrids) =>
      prevGrids.map((grid) =>
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


  return (
    <div className="relative flex flex-col h-screen items-center justify-center">
      {/* Contenedor de los grids y zona de drop */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="grid grid-cols-4 gap-2 p-2 border-2 border-black">
          {grids.map((grid) => (
            <motion.div
              key={grid.id}
              onClick={() => {
                setSelectedGridId(grid.id);
                setShowProducts(true);
              }}
              className={`w-36 h-36 border-2 cursor-pointer ${
                grid.id === selectedGridId
                  ? 'bg-red-300'
                  : grid.product
                  ? 'bg-green-500'
                  : 'bg-red-500 hover:bg-red-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {grid.product ? (
                <CardSide product={grid.product} />
              ) : (
                <p className="text-center">Grid {grid.id}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="border-2 border-black flex justify-center items-center">
          <PdfViewerComponent initialCuadros={1}/>
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
            className="absolute bottom-0 left-0 w-full bg-gray-200 p-4"
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
    <div className="absolute bottom-0 left-0 w-full bg-gray-200 p-4">
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
