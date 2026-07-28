"use client";

import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export function useSignUp() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to create account.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.success("Account created! Please sign in.");
        return;
      }

      toast.success("Account created! Welcome to Pioma.");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirm,
    setConfirm,
    loading,
    handleSignUp,
  };
}
