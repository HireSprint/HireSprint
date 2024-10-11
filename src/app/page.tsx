"use client"

import { useState } from "react";
import CardProduct from "./components/card";
import { useProductContext } from "./context/productContext";


export default function Home() {
  const { products } = useProductContext();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) => {
      // Solo agregar si no está en la lista
      if (!prev.includes(id)) {
        console.log("Producto seleccionado:", id); // Log al seleccionar
        return [...prev, id]; // Agregar el ID al array
      }
      console.log("El producto ya fue seleccionado:", id); // Log si ya estaba seleccionado
      return prev; // No hacer nada si ya está en la lista
    });
  };

  console.log(selectedProducts)

  return (
    <div>
      <h1>Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <CardProduct 
              key={product.id} 
              product={product} 
              onSelect={handleSelectProduct} 
            />
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
      <div className="mt-6">
        <h2>Productos seleccionados:</h2>
        {selectedProducts.length > 0 ? (
          <ul>
            {selectedProducts.map((id) => (
              <li key={id}>{id}</li> 
            ))}
          </ul>
        ) : (
          <p>No se han seleccionado productos.</p>
        )}
      </div>
    </div>
  );
}