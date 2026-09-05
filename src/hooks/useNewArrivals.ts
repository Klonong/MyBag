"use client";

import { useEffect, useState } from "react";
import { normalizeShopProduct } from "@/hooks/useShopProducts";
import type { Product } from "@/interfaces";
import { productsService } from "@/services/products.service";

export const useNewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const result = await productsService.getProductList({
        page: 1,
        limit: 12,
        sort: "newest",
      });

      if (!result.error && result.data) {
        setProducts((result.data.items ?? []).map(normalizeShopProduct));
      }

      setIsLoading(false);
    };

    void loadProducts();
  }, []);

  const heroProduct = products[0];

  return {
    products,
    isLoading,
    heroProduct,
  };
};
