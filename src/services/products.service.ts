import { api } from "@/lib/api";
import type { ProductDetail, ProductListResponse } from "@/interfaces";

export type ProductSort =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "best_seller";

export type ProductListQuery = {
  page?: number;
  limit?: number;
  categoryId?: number;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: ProductSort;
};

export const productsService = {
  getProductList: ({
    page = 1,
    limit = 10,
    categoryId,
    color,
    minPrice,
    maxPrice,
    search,
    sort = "newest",
  }: ProductListQuery = {}) => {
    const params = Object.fromEntries(
      Object.entries({
        page,
        limit,
        categoryId,
        color,
        minPrice,
        maxPrice,
        search,
        sort,
      }).filter(([, value]) => value !== undefined && value !== "" && value !== null),
    );

    return api.get<ProductListResponse>(`/products?${new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString()}`);
  },
  getProductById: (id: string) => api.get<ProductDetail>(`/products/${id}`),
};
