import { api } from "@/lib/api";

export type DeliveryMethod = "standard" | "express";
export type PaymentMethod = "card" | "bank" | "wallet";

export type CreateOrderInput = {
  cartItemIds: string[];
  addressId?: string;
  deliveryMethod?: DeliveryMethod;
  paymentMethod?: PaymentMethod;
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

export const orderService = {
  createSummary: (input: CreateOrderInput) =>
    api.post<Order>("/orders/summary", input),
};