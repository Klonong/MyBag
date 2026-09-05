import { api } from "@/lib/api";

export type Badge = {
  id: number;
  name: string;
  productCount?: number;
};

export const badgesService = {
  list: () => api.get<Badge[]>("/badges"),
  getById: (id: number) => api.get<Badge>(`/badges/${id}`),
  create: (name: string) => api.post<Badge>("/badges", { name }),
  update: (id: number, name: string) => api.patch<Badge>(`/badges/${id}`, { name }),
  remove: (id: number) => api.delete<void>(`/badges/${id}`),
};
