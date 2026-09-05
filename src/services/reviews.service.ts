import { api } from "@/lib/api";

export type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null };
};

export type ReviewListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ReviewListResponse = {
  items: Review[];
  meta: ReviewListMeta;
};

export type ReviewInput = {
  rating: number;
  comment?: string;
};

export const reviewsService = {
  list: (productId: string, query: { page?: number; limit?: number } = {}) =>
    api.get<ReviewListResponse>(`/products/${productId}/reviews`, query),
  create: (productId: string, input: ReviewInput) =>
    api.post<Review>(`/products/${productId}/reviews`, input),
  update: (productId: string, id: number, input: Partial<ReviewInput>) =>
    api.patch<Review>(`/products/${productId}/reviews/${id}`, input),
  remove: (productId: string, id: number) =>
    api.delete<void>(`/products/${productId}/reviews/${id}`),
};
