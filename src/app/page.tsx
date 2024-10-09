"use client"
import { useEffect, useState } from 'react';
import { getProductsRF } from "./api/productos/prductosRF";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState(true); // Estado para controlar el loading

  useEffect(() => {
    // Función para obtener productos y actualizar el estado
    const fetchProducts = async () => {
      try {
        const productsData = await getProductsRF();
        setProducts(productsData);
        setLoading(false); // Cambia el estado de loading cuando los productos se hayan cargado
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setLoading(false); // Cambia el estado de loading incluso en caso de error
      }
    };

    fetchProducts(); // Llama la función al montar el componente
  }, []); //

  return ( 
    <div className="flex flex-col justify-center items-center text-black">
  <h1>Productos</h1>

{loading ? (
  <p>Cargando productos...</p>
) : (
  <ul>
    {products.map(product => (
      <li key={product.id}>{product.name}</li>
    ))}
  </ul>
)}
</div>
    
    
  );
}

{ /*     <h1 className="title text-3x1 font-bold text-black">Upload Files</h1>
  <MyDropzone className="p-16 mt-10 border-2 border-black text-black"/> */}