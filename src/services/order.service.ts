import { api } from "@/lib/api";

export type DeliveryMethod = "standard" | "express";
export type PaymentMethod = "card" | "bank" | "wallet";

export type CreateOrderInput = {
  cartItemIds: string[];
  addressId?: string;
  deliveryMethod?: DeliveryMethod;
  paymentMethod?: PaymentMethod;
  couponCode?: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  color_id: number | null;
  product_name: string;
  color_name: string | null;
  unit_price: string;
  quantity: number;
  subtotal: string;
};

export type Order = {
  id: string;
  user_id: string;
  address_id: string | null;
  status_id: number;
  delivery_method: DeliveryMethod;
  payment_method: PaymentMethod;
  subtotal: string;
  shipping_fee: string;
  tax: string;
  discount: string;
  total: string;
  created_at: string;
  updated_at: string;
  status: string;
  order_items: OrderItem[];
};

export type OrderListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type OrderListQuery = {
  page?: number;
  limit?: number;
  status?: string;
};

export type OrderListResponse = {
  items: Order[];
  meta: OrderListMeta;
};

export type OrderPreview = {
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
};

export type CouponValidation = {
  valid: boolean;
  discountAmount: number;
  message: string;
};

export const orderService = {
  createSummary: (input: CreateOrderInput) =>
    api.post<Order>("/orders/summary", input),
  list: (query: OrderListQuery = {}) =>
    api.get<OrderListResponse>("/orders", query),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  preview: (input: CreateOrderInput) =>
    api.post<OrderPreview>("/orders/preview", input),
  validateCoupon: (code: string, subtotal: number) =>
    api.post<CouponValidation>("/orders/validate-coupon", { code, subtotal }),
};
