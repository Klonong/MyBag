"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export function useSignUp(onSuccess?: () => void) {
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
      const { error } = await authService.signUp(email, password, phone);
      if (error) {
        toast.error(error.message);
      } else {
        onSuccess?.();
      }
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
