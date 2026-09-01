"use client";
import type { AuthUser } from "@/interfaces";
import { authService } from "@/services/auth.service";
import { createContext, useCallback, useEffect, useState } from "react";

export type UserProfile = AuthUser;

type AuthContextType = {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applyMe = useCallback(({ data }: { data: { user: AuthUser } | null }) => {
    setUser(data?.user ?? null);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    applyMe(await authService.getMe());
  }, [applyMe]);

  useEffect(() => {
    let active = true;
    authService.getMe().then((result) => {
      if (active) applyMe(result);
    });
    return () => {
      active = false;
    };
  }, [applyMe]);

  return (
    <AuthContext.Provider value={{ user, profile: user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
