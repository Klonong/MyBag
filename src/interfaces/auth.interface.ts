export type OAuthProvider = "google" | "apple";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
}
