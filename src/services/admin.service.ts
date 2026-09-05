import { api, unwrapList, type ApiResult } from "@/lib/api";

export type AdminCategory = { id: number; name: string; productCount?: number; products?: number; updatedAt?: string; updated?: string };
export type AdminDiscount = { id: string; name: string; code: string; type: "percentage" | "fixed" | "Percentage" | "Fixed amount"; value: number | string; status: "active" | "scheduled" | "expired" | "Active" | "Scheduled" | "Expired"; startsAt?: string; endsAt?: string; ends?: string };
export type AdminOrder = {
  id: string;
  user_id?: string;
  customer?: string;
  items?: number;
  total: string | number;
  status?: string;
  status_id?: number;
  order_statuses?: { id: number; code: string; name: string } | null;
  created_at?: string;
  date?: string;
};

/** Orders now carry their status via the `order_statuses` join (code/name) rather than a flat `status` string. */
export const getOrderStatus = (order: AdminOrder): string =>
  order.order_statuses?.code ?? order.status ?? "";

export const getOrderStatusLabel = (order: AdminOrder): string =>
  order.order_statuses?.name ?? order.status ?? "Unknown";
export type AdminCustomer = { id: string; name: string | null; email: string; orderCount?: number; orders?: number; totalSpent?: string | number; spent?: string; isActive?: boolean; status?: "Active" | "Inactive"; createdAt?: string; joined?: string };
export type AdminSettings = { storeName: string; supportEmail: string; currency: string };

export const adminService = {
  listCategories: () => api.get<AdminCategory[]>("/categories"),
  getCategory: (id: number) => api.get<AdminCategory>(`/categories/${id}`),
  createCategory: (name: string) => api.post<AdminCategory>("/categories", { name }),
  updateCategory: (id: number, name: string) => api.patch<AdminCategory>(`/categories/${id}`, { name }),
  deleteCategory: (id: number) => api.delete<void>(`/categories/${id}`),

  listDiscounts: async (params?: { status?: string; page?: number; limit?: number; search?: string }): Promise<ApiResult<AdminDiscount[]>> => {
    const result = await api.get<unknown>("/admin/discounts", params);
    return { data: unwrapList<AdminDiscount>(result.data), error: result.error };
  },
  getDiscount: (id: string) => api.get<AdminDiscount>(`/admin/discounts/${id}`),
  createDiscount: (input: { name: string; code: string; type: "percentage" | "fixed"; value: number; startsAt?: string; endsAt?: string; isActive: boolean }) => api.post<AdminDiscount>("/admin/discounts", input),
  updateDiscount: (id: string, input: Partial<{ name: string; code: string; type: "percentage" | "fixed"; value: number; startsAt: string; endsAt: string; isActive: boolean }>) => api.patch<AdminDiscount>(`/admin/discounts/${id}`, input),
  deleteDiscount: (id: string) => api.delete<void>(`/admin/discounts/${id}`),

  listOrders: async (params?: { page?: number; limit?: number; status?: string }): Promise<ApiResult<AdminOrder[]>> => {
    const result = await api.get<unknown>("/admin/orders", params);
    return { data: unwrapList<AdminOrder>(result.data), error: result.error };
  },
  getOrder: (id: string) => api.get<AdminOrder>(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => api.patch<AdminOrder>(`/admin/orders/${id}/status`, { status }),

  listCustomers: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResult<AdminCustomer[]>> => {
    const result = await api.get<unknown>("/admin/customers", params);
    return { data: unwrapList<AdminCustomer>(result.data), error: result.error };
  },
  getCustomer: (id: string) => api.get<AdminCustomer>(`/admin/customers/${id}`),
  updateCustomerStatus: (id: string, isActive: boolean) => api.patch<AdminCustomer>(`/admin/customers/${id}/status`, { isActive }),

  getSettings: () => api.get<AdminSettings>("/admin/settings"),
  updateSettings: (settings: AdminSettings) => api.patch<AdminSettings>("/admin/settings", settings),
};
