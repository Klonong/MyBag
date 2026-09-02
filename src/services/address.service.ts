import { api } from "@/lib/api";

export type CreateAddressInput = {
  label?: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
};

export type Address = {
  id: string;
  user_id: string;
  label: string | null;
  recipient_name: string;
  phone: string;
  address_line: string;
  address_line2: string | null;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export const addressService = {
  list: () => api.get<Address[]>("/addresses"),
  create: (address: CreateAddressInput) => api.post<Address>("/addresses", address),
};
