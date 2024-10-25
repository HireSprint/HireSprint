"use client"
import  {  CardProduct} from "../components/card";
import { getProductsRF } from "../api/productos/prductosRF";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import LoadingLottie from "../components/lottie/loading-Lottie.json";
import Sidebar from "../components/sideBar";
import { motion } from "framer-motion"; // Para animaciones
import { ImageGrid, ImageGrid2 } from "../components/imageGrid";


interface Product
{
  id: string;
  name: string;
  image: string;
  gridId?: number;
  description?: string;
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
  const [grids, setGrids] = useState<Grid[]>([]); 



  useEffect(() => {
    if (products.length === 0) {
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
    }
  }, [products.length]);

  


  const handleProductSelect = (product: Product) => {
    if (selectedGridId === null) return;
  
    const productWithGrid = { ...product, gridId: selectedGridId };
  
    setGrids((prevGrids) =>
      prevGrids.map((grid) =>
        grid.id === selectedGridId ? { ...grid, product: productWithGrid } : grid
      )
    );
  
    setSelectedProducts((prev) => {
      const newProducts = prev.filter((p) => p.gridId !== selectedGridId);
      return [...newProducts, productWithGrid]; // Reemplaza o añade el producto
    });
  };


  const handleGridSelect = (gridId: number) => {
    setSelectedGridId(gridId);
    setShowProducts(true); 
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prevProducts) => 
      prevProducts.filter((product) => product.id !== productId)
    );
    setGrids((prevGrids) => 
      prevGrids.map((grid) => 
        grid.product && grid.product.id === productId ? { ...grid, product: null } : grid
      )
    );
  };

  return (
    <div className=" flex flex-col h-fit items-center  ">
    <div className="grid grid-cols-2 w-full flex items-center justify-center py-8">
        <div className="flex justify-center items-center w-full border-r-2 border-black">
          <ImageGrid 
            onProductSelect={handleGridSelect} 
            selectedProducts={selectedProducts}/>
        </div>
        <div className="flex justify-center items-center w-full border-r-2 border-black">
         
        </div>
      </div>

      {/* Mostrar / Ocultar productos */}
      <div className="flex ">
        {showProducts ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-0 left-0 w-full bg-[#393939] h-[25%]"
          >
            <GridProduct
              products={products}
              loading={loading}
              onProductSelect={handleProductSelect}
              onHideProducts={() => setShowProducts(false)}
            />
          </motion.div>
        ) : null}
      </div>

      <button
        className="absolute right-0 bg-[#393939] w-12 h-20 rounded-l-full p-4 font-bold hover:w-28 transition-all duration-300 hover:bg-[#7cc304]"
        onClick={() => setSideBarVisible(true)}
        aria-label="Abrir Panel Productos"
      > Abrir Panel
      </button>
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
            onRemoveProduct={handleRemoveProduct}
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
    <div className=" bg-[#393939] p-4 h-fit">
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" p-2 border rounded text-black m-4 "
        />
        <button
          onClick={onHideProducts}
          className="bg-red-500 text-white p-2 rounded m-4"
        >
          Ocultar Productos
        </button>
      </div>
      <div>
        
      </div>

      
        {loading ? (
          <div className="flex justify-center items-center ">
            <Lottie animationData={LoadingLottie} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 h-fit">
            {filteredProducts.map((product) => (
              <CardProduct
                product={product}
                key={product.id}
                onProductSelect={onProductSelect}
              />
            ))}
          </div>
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
  );
};

export default Diseno
