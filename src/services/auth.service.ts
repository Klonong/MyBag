import { api, API_URL } from "@/lib/api";
import type { AuthUser, OAuthProvider } from "@/interfaces";

export type { AuthUser, OAuthProvider } from "@/interfaces";

export const authService = {
  signIn: (email: string, password: string) =>
    api.post<{ user: AuthUser }>("/auth/login", { email, password }),

  signUp: (email: string, password: string, phone: string) =>
    api.post<{ user: AuthUser }>("/auth/register", { email, password, phone }),

  signInWithOAuth: (provider: OAuthProvider) => {
    window.location.href = `${API_URL}/auth/${provider}`;
  },

  signOut: () => api.post<null>("/auth/logout"),

  getMe: () => api.get<{ user: AuthUser }>("/auth/me"),
};
