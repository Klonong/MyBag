export interface ProductVariant {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
  colorHex: string;
  images: [string, string, string];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  category: string;
  variants?: ProductVariant[];
  material?: string[];
  rating?: ProductRating;
}

export interface ProductListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductColorImage {
  id?: number | string;
  image_url?: string;
}

export interface ProductColor {
  id?: number | string;
  name: string;
  hex_code?: string | null;
  stock?: number;
  product_color_images?: ProductColorImage[];
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: string | number | null;
  discount?: string | number | null;
  categories?: { id?: number; name?: string } | null;
  badges?: { id?: number; name?: string } | null;
  product_images?: ProductColorImage[];
  product_colors?: ProductColor[];
  rating?: ProductRating;
}

export interface ProductListResponse {
  items: ProductDetail[];
  meta: ProductListMeta;
}
