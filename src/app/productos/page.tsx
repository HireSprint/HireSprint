"use client"
import { useEffect, useState } from 'react';
import { getProductsRF } from '../api/productos/prductosRF'; 
import CardProduct from '../components/card';
import Lottie from "lottie-react";



const ProductosBase = () => {
  const [products, setProducts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 

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

  return (
    <div className="flex flex-col justify-center items-center text-black">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      {loading ? (
        <Lottie animationData={} loop={true} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <CardProduct key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductosBase;
