"use client";
import { useEffect } from "react";
import { getProduct } from "./api/apiMongo/getProduct";

export default function HomePage() {

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProduct();
      console.log("products", products);
      if (products.length === 0) {
        fetchProducts();
      }
    };
    fetchProducts();
  }, []);

  return (
      <div>

    </div>
  );
}
