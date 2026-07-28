"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn, getSession } from "next-auth/react";

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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password.");
        return;
      }

      const session = await getSession();

      if (session?.user?.role === "admin") {
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
