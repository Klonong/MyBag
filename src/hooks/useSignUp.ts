"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

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
      const { error } = await authService.signUp(email, password, phone);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! You can now sign in.", { duration: 6000 });
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
