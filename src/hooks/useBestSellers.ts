"use client";

import { useEffect, useState } from "react";
import { normalizeShopProduct } from "@/hooks/useShopProducts";
import type { Product } from "@/interfaces";
import { productsService } from "@/services/products.service";

export const useBestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const result = await productsService.getProductList({
        page: 1,
        limit: 12,
        sort: "best_seller",
      });

      if (!result.error && result.data) {
        setProducts((result.data.items ?? []).map(normalizeShopProduct));
      }

      setIsLoading(false);
    };

    void loadProducts();
  }, []);

  const featuredProduct = products[0];
  const remainingProducts = products.slice(1);

  return {
    products,
    isLoading,
    featuredProduct,
    remainingProducts,
  };
};
