"use client";
import { useEffect, useState } from 'react';
import { getProductsRF } from '../api/productos/prductosRF'; 
import CardProduct from '../components/card';
import Lottie from "lottie-react";
import LoadingLottie from "../components/lottie/loading-Lottie.json";

interface Product {
  id: string; 
  name: string;
  image: string; 
}

const ProductosBase = () => {
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const productsPerPage = 12; // Número de productos por página

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProductsRF();
        setProducts(productsData);
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

  // Calcular los índices de inicio y fin para la paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct); // Productos a mostrar

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Manejar el cambio de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Determinar el rango de botones de página
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5; // Máximo de botones visibles

    if (totalPages <= maxVisiblePages) {
      // Si hay menos o igual que maxVisiblePages, mostrar todos
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay más páginas, calcular el rango a mostrar
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Ajustar el rango si está cerca del final
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
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
            <CardProduct key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex justify-center mt-4">
        {/* Botón de la primera página */}
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(1)}
            className="mx-1 px-3 py-1 border rounded bg-white text-black"
          >
            &lt;
          </button>
        )}

        {/* Botones de las páginas visibles */}
        {getPageNumbers().map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {number}
          </button>
        ))}

        {/* Botón "Siguiente" */}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="mx-1 px-3 py-1 border rounded bg-white text-black"
          >
            &gt; {/* Esto representa una flecha hacia la derecha */}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductosBase;


