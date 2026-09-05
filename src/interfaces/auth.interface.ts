export type OAuthProvider = "google" | "apple";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  role: string;
}
