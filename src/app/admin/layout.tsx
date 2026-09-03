"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Boxes,
  FolderTree,
  LogOut,
  Percent,
  ReceiptText,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading } = useAuth();

  const navigation = [
    { href: "/admin", label: "Overview", icon: BarChart3 },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/discounts", label: "Discounts", icon: Percent },
    { href: "/admin/orders", label: "Orders", icon: ReceiptText },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    if (!loading) {
      if (!user || profile?.role !== "admin") {
        router.replace("/login");
      }
    }
  }, [user, profile, loading, router]);

  async function handleLogout() {
    await authService.signOut();
    router.push("/login");
  }

  if (loading || !user || profile?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-zinc-100 px-7">
          <Link href="/admin" className="font-headline text-2xl font-bold tracking-widest">
            MyBag <span className="font-sans text-xs font-normal tracking-[0.2em] text-tertiary">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-7">
          <p className="mb-3 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-400">Workspace</p>
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"}`}
              >
                <Icon className="size-[18px]" strokeWidth={1.7} />
                {label}
              </Link>
            );
          })}
          <Link href="/admin/create-product" className="mt-7 flex items-center gap-3 rounded-lg bg-tertiary px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c9604d]">
            <Boxes className="size-[18px]" strokeWidth={1.7} />
            Add product
          </Link>
        </nav>
        <div className="border-t border-zinc-100 p-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900">
            <LogOut className="size-[18px]" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-5 sm:px-8">
            <Link href="/admin" className="font-headline text-xl font-bold tracking-widest lg:hidden">
              MyBag <span className="font-sans text-xs font-normal tracking-[0.2em] text-tertiary">ADMIN</span>
            </Link>
            <div className="hidden text-sm text-zinc-500 lg:block">Store operations</div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-zinc-500 sm:block">{profile?.name || user.email}</span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 lg:hidden">
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-zinc-100 px-4 py-2 lg:hidden">
            {navigation.map(({ href, label }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return <Link key={href} href={href} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs ${active ? "bg-zinc-900 text-white" : "text-zinc-500"}`}>{label}</Link>;
            })}
          </nav>
        </header>
        <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
