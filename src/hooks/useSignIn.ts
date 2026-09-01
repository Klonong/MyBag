"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";

const getSafeRedirect = (value: string | null) => {
  if (!value) return "/";

  const decoded = decodeURIComponent(value);
  if (!decoded.startsWith("/") || decoded.startsWith("//")) {
    return "/";
  }

  return decoded;
};

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) {
        toast.error(error.message);
        return;
      }

      await refresh();

      if (data?.user.role === "admin") {
        toast.success("Welcome, Admin!");
        router.replace("/admin/create-product");
        return;
      }

      toast.success("Signed in successfully!");
      const redirectTo = getSafeRedirect(searchParams.get("redirect"));
      router.replace(redirectTo);
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    handleSignIn,
  };
}
