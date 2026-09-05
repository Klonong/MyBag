"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export const useProfile = () => {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  const displayName = profile?.name ?? user?.email?.split("@")[0] ?? "Member";

  return { router, user, loading, displayName };
};
