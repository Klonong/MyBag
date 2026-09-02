export type CartItem = {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
};

// ─── Shipping ─────────────────────────────────────────────────────────────────

export type ShippingData = {
  addressId?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  deliveryMethod: "standard" | "express";
};

export const defaultShipping: ShippingData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  address2: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Indonesia",
  deliveryMethod: "standard",
};

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentMethod = "card" | "bank" | "wallet";

export type PaymentData = {
  method: PaymentMethod;
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
};

export const defaultPayment: PaymentData = {
  method: "card",
  nameOnCard: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  saveCard: false,
};
