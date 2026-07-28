"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user || profile?.role !== "admin") {
        router.replace("/login");
      }
    }
  }, [user, profile, loading, router]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (loading || !user || profile?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/admin/create-product" className="font-headline text-xl font-bold tracking-widest text-zinc-900">
            PIOMA <span className="text-tertiary text-sm font-sans font-normal tracking-normal">Admin</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
