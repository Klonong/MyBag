import { api, API_URL } from "@/lib/api";

export type OAuthProvider = "google" | "apple";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
};

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
