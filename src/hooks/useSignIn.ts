"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      console.log(data?.user.role);

      if (data?.user.role === "admin") {
        toast.success("Welcome, Admin!");
        router.push("/admin/create-product");
        return;
      }

      toast.success("Signed in successfully!");
      const redirect = searchParams.get("redirect");
      router.push(redirect ?? "/");
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, rememberMe, setRememberMe, loading, handleSignIn };
}
