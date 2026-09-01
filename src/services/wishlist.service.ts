import { api } from "@/lib/api";

export type WishlistProductImage = {
  id?: number;
  product_id?: string;
  image_url?: string;
};

export type WishlistProductColor = {
  id?: number;
  product_id?: string;
  name?: string;
  hex_code?: string | null;
  stock?: number;
  product_color_images?: WishlistProductImage[];
};

export type WishlistProduct = {
  id: string;
  name: string;
  description?: string;
  price?: number | string;
  discount?: number | string | null;
  finalPrice?: number | string | null;
  categories?: { id?: number; name?: string } | null;
  badges?: { id?: number; name?: string } | null;
  product_images?: WishlistProductImage[];
  product_colors?: WishlistProductColor[];
};

export type WishlistItem = {
  id: string;
  productId?: string;
  quantity?: number;
  product?: WishlistProduct;
};

export type Wishlist = {
  items: WishlistItem[];
};

export const wishlistService = {
  getWishlist: () => api.get<Wishlist>("/wishlist"),

  addItem: (productId: string) => api.post<Wishlist>("/wishlist", { productId }),

  removeItem: (wishlistId: string) => api.delete<Wishlist>(`/wishlist/${wishlistId}`),

  clearWishlist: () => api.delete<Wishlist>("/wishlist"),
};
