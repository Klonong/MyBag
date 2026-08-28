import { api } from "@/lib/api";
import type { AuthUser } from "@/services/auth.service";

export type ProfileUpdate = {
  name?: string;
  phone?: string;
};

export const profileService = {
  getProfile: (userId: string) => api.get<AuthUser>(`/users/${userId}`),

  updateProfile: (userId: string, updates: ProfileUpdate) =>
    api.patch<AuthUser>(`/users/${userId}`, updates),
};
