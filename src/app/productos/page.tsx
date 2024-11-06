"use client";
import { useEffect, useState } from 'react';
import { getProductsRF } from '../api/productos/prductosRF'; 
import {CardProduct} from '../components/card';
import Lottie from "lottie-react";
import LoadingLottie from "../components/lottie/loading-Lottie.json";
import Sidebar from '../components/sideBar';
import { ProductTypes } from '@/types/product'; 


const ProductosBase = () => {
  const [products, setProducts] = useState<ProductTypes[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [selectedProducts, setSelectedProducts] = useState<ProductTypes[]>([]); 
  const [showSidebar, setShowSidebar] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProductsRF();
        const formattedProducts: ProductTypes[] = productsData.map(product => ({
          ...product,
          descriptions: Array.isArray(product.descriptions) 
            ? product.descriptions.filter((desc): desc is string => typeof desc === 'string')
            : typeof product.descriptions === 'string' 
              ? [product.descriptions]
              : []
        }));
        setProducts(formattedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setLoading(false);
      }
    };

    fetchProducts(); 
  }, []); 

  const filteredProducts = products.filter(product =>
    product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct); 

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5; 

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const handleSelectProduct = (id: ProductTypes) => {
    setSelectedProducts(prev => {
      if (!prev.includes(id)) {
        console.log("Producto seleccionado:", id); 
        return [...prev, id]; 
      }
      console.log("El producto ya fue seleccionado:", id); 
      return prev; 
    })
    setShowSidebar(true)
    ;
  };
  const handleSidebarClose = () => {
    setShowSidebar(false);
  };

  const handleRemoveProduct = (productId: string) => {
    // Implementar lógica para remover producto
  };

  return (
    <div className="flex flex-col justify-center items-center text-black">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <div className='relative left-96'>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
      </div>

      {loading ? (
        <div className='flex justify-center items-center w-64 h-64'>
          <Lottie animationData={LoadingLottie} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map(product => (
            <CardProduct 
              key={product.id} 
              product={{
                ...product,
                descriptions: Array.isArray(product.descriptions) ? [product.descriptions[0] || ''] : ['']
              }}
              onProductSelect={handleSelectProduct}
            />
          ))}
        </div>  
      )}

      <div className="flex justify-center mt-4">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(1)}
            className="mx-1 px-3 py-1 border rounded bg-white text-black"
          >
            &lt;
          </button>
        )}

        {getPageNumbers().map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {number}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="mx-1 px-3 py-1 border rounded bg-white text-black"
          >
            &gt; 
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductosBase;