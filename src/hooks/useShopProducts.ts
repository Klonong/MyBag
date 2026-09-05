"use client";

import { useEffect, useMemo, useState } from "react";
import { staticFilterSections } from "@/components/ui/filter";
import type { CategoryItem, Product, ProductDetail, ProductListResponse, ProductRating } from "@/interfaces";
import { categoryService } from "@/services/category.service";
import { productsService, type ProductSort } from "@/services/products.service";

const ITEMS_PER_PAGE = 12;

type BackendProductColor = {
  id?: number | string;
  name: string;
  hex_code?: string | null;
  stock?: number;
  product_color_images?: { image_url?: string }[];
};

type BackendProduct = {
  id: string;
  name: string;
  description: string;
  price: string | number | null;
  categories?: { name?: string } | null;
  badges?: { name?: string } | null;
  product_images?: { image_url?: string }[];
  product_colors?: BackendProductColor[];
  rating?: ProductRating;
};

export const emptyProductListResponse: ProductListResponse = {
  items: [],
  meta: {
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
  },
};

export const normalizeShopProduct = (item: BackendProduct | ProductDetail): Product => {
  const firstImage = item.product_images?.[0]?.image_url ?? "";
  const variantImages = (item.product_colors ?? []).map((color) => {
    const images = color.product_color_images ?? [];

    return {
      id: String(color.id ?? `${item.id}-${color.name}`),
      name: color.name,
      description: `${item.name} in ${color.name}`,
      price: Number(item.price ?? 0),
      color: color.name,
      colorHex: color.hex_code ?? "#000000",
      images: [
        images[0]?.image_url ?? firstImage,
        images[1]?.image_url ?? firstImage,
        images[2]?.image_url ?? firstImage,
      ] as [string, string, string],
    };
  });

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price ?? 0),
    image: firstImage,
    badge: item.badges?.name ?? undefined,
    category: item.categories?.name ?? "",
    variants: variantImages,
    rating: item.rating,
  };
};

export const useShopProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [sort, setSort] = useState<ProductSort>("newest");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [productsData, setProductsData] = useState<ProductListResponse>(emptyProductListResponse);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await categoryService.getCategories();
      if (!result.error && result.data) {
        setCategories(result.data);
      }
    };

    void fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const result = await productsService.getProductList({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        categoryId: selectedCategoryId,
        search: searchTerm.trim() || undefined,
        sort,
      });

      if (result.error) {
        console.error("Failed to fetch products:", result.error.message);
        setProductsData(emptyProductListResponse);
        setIsLoading(false);
        return;
      }

      setProductsData(
        result.data ?? {
          ...emptyProductListResponse,
          meta: {
            ...emptyProductListResponse.meta,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          },
        },
      );
      setIsLoading(false);
    };

    void fetchProducts();
  }, [currentPage, searchTerm, selectedCategoryId, sort]);

  const sortByItems = useMemo(
    () => [
      { label: "Newest Arrivals", value: "newest" },
      { label: "Price: Low to High", value: "price_asc" },
      { label: "Price: High to Low", value: "price_desc" },
      { label: "Best Sellers", value: "best_seller" },
    ],
    [],
  );

  const categorySections = useMemo(
    () => [
      {
        title: "Category",
        type: "category" as const,
        items: categories.map((category) => ({
          label: category.name,
          value: String(category.id),
          count: category._count?.products,
        })),
      },
      ...staticFilterSections,
    ],
    [categories],
  );

  const products = useMemo(
    () => (productsData.items ?? []).map(normalizeShopProduct),
    [productsData.items],
  );

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword),
    );
  }, [products, searchTerm]);

  const totalPages = Math.max(1, productsData.meta.totalPages ?? 1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    currentPage,
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    setCurrentPage,
    sort,
    setSort,
    categories,
    products,
    filteredProducts,
    isLoading,
    totalPages,
    sortByItems,
    categorySections,
    handlePageChange,
  };
};
