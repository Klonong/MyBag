import { api, type ApiResult } from "@/lib/api";

export type AdminCategory = { id: number; name: string; productCount?: number; products?: number; updatedAt?: string; updated?: string };
export type AdminDiscount = { id: number; name: string; code: string; type: "percentage" | "fixed" | "Percentage" | "Fixed amount"; value: number | string; status: "active" | "scheduled" | "expired" | "Active" | "Scheduled" | "Expired"; startsAt?: string; endsAt?: string; ends?: string };
export type AdminOrder = { id: string; user_id?: string; customer?: string; items?: number; total: string | number; status: string; created_at?: string; date?: string };
export type AdminCustomer = { id: string; name: string | null; email: string; orderCount?: number; orders?: number; totalSpent?: string | number; spent?: string; isActive?: boolean; status?: "Active" | "Inactive"; createdAt?: string; joined?: string };
export type AdminSettings = { storeName: string; supportEmail: string; currency: string };

export const adminService = {
  listCategories: () => api.get<AdminCategory[]>("/categories"),
  createCategory: (name: string) => api.post<AdminCategory>("/categories", { name }),
  updateCategory: (id: number, name: string) => api.patch<AdminCategory>(`/categories/${id}`, { name }),
  deleteCategory: (id: number) => api.delete<void>(`/categories/${id}`),

  listDiscounts: async (params?: { status?: string; page?: number; limit?: number; search?: string }): Promise<ApiResult<AdminDiscount[]>> => {
    const result = await api.get<unknown>(`/admin/discounts${toQuery(params)}`);
    return { data: readList<AdminDiscount>(result.data), error: result.error };
  },
  createDiscount: (input: { name: string; code: string; type: "percentage" | "fixed"; value: number; startsAt?: string; endsAt?: string; isActive: boolean }) => api.post<AdminDiscount>("/admin/discounts", input),
  updateDiscount: (id: number, input: Partial<{ name: string; code: string; type: "percentage" | "fixed"; value: number; startsAt: string; endsAt: string; isActive: boolean }>) => api.patch<AdminDiscount>(`/admin/discounts/${id}`, input),
  deleteDiscount: (id: number) => api.delete<void>(`/admin/discounts/${id}`),

  listOrders: async (params?: { page?: number; limit?: number; status?: string }): Promise<ApiResult<AdminOrder[]>> => {
    const result = await api.get<unknown>(`/admin/orders${toQuery(params)}`);
    return { data: readList<AdminOrder>(result.data), error: result.error };
  },
  updateOrderStatus: (id: string, status: string) => api.patch<AdminOrder>(`/admin/orders/${id}/status`, { status }),

  listCustomers: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResult<AdminCustomer[]>> => {
    const result = await api.get<unknown>(`/admin/customers${toQuery(params)}`);
    return { data: readList<AdminCustomer>(result.data), error: result.error };
  },
  updateCustomerStatus: (id: string, isActive: boolean) => api.patch<AdminCustomer>(`/admin/customers/${id}/status`, { isActive }),

  getSettings: () => api.get<AdminSettings>("/admin/settings"),
  updateSettings: (settings: AdminSettings) => api.patch<AdminSettings>("/admin/settings", settings),
};

function readList<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (!body || typeof body !== "object") return [];

  if ("items" in body && Array.isArray(body.items)) return body.items as T[];
  if ("data" in body) return readList<T>(body.data);

  return [];
}

function toQuery(params?: Record<string, string | number | undefined>) {
  if (!params) return "";
  const values = Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]);
  const query = new URLSearchParams(values).toString();
  return query ? `?${query}` : "";
}
