import { api } from "@/lib/api";

export type Session = {
  id: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  lastSeenAt: string;
  current: boolean;
};

export const sessionsService = {
  list: () => api.get<Session[]>("/auth/sessions"),
  revoke: (id: string) => api.delete<void>(`/auth/sessions/${id}`),
};
