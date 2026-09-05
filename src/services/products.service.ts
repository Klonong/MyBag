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

export type UpdateProductColorInput = {
  id?: number;
  name?: string;
  hexCode?: string;
  stock?: number;
  imageUrls?: string[];
};

export type UpdateProductInput = Partial<{
  name: string;
  description: string;
  price: number;
  discount: number;
  categoryId: number;
  badgeId: number;
  productImageUrls: string[];
  colors: UpdateProductColorInput[];
  removeColorIds: number[];
}>;

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
  }: ProductListQuery = {}) =>
    api.get<ProductListResponse>("/products", {
      page,
      limit,
      categoryId,
      color,
      minPrice,
      maxPrice,
      search,
      sort,
    }),
  getProductById: (id: string) => api.get<ProductDetail>(`/products/${id}`),
  updateProduct: (id: string, input: UpdateProductInput) =>
    api.patch<ProductDetail>(`/products/${id}`, input),
  deleteProduct: (id: string) => api.delete<void>(`/products/${id}`),
};
