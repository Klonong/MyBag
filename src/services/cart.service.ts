import { api } from "@/lib/api";

export type CartProductImage = {
  id?: number;
  product_id?: string;
  color_id?: number;
  image_url?: string;
};

export type CartProductColor = {
  id?: number;
  product_id?: string;
  name?: string;
  hex_code?: string | null;
  stock?: number;
  product_color_images?: CartProductImage[];
};

export type CartProduct = {
  id: string;
  name: string;
  description?: string;
  price?: number | string;
  discount?: number | string | null;
  categories?: { id?: number; name?: string } | null;
  badges?: { id?: number; name?: string } | null;
  product_images?: CartProductImage[];
  product_colors?: CartProductColor[];
  finalPrice?: number | string | null;
  categoryId?: number | null;
  badgeId?: number | null;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
  color: CartProductColor;
};

export type Cart = {
  id: string | null;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
};

export type AddCartItemInput = {
  productId: string;
  colorId: number;
  quantity: number;
};

export const cartService = {
  getCart: () => api.get<Cart>("/cart"),

  addItem: (payload: AddCartItemInput) => api.post<Cart>("/cart/items", payload),

  updateItem: (itemId: string | number, quantity: number) =>
    api.patch<Cart>(`/cart/items/${itemId}`, { quantity }),

  removeItem: (itemId: string | number) => api.delete<Cart>(`/cart/items/${itemId}`),

  clearCart: () => api.delete<Cart>("/cart"),
};
