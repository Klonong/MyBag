"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HeartIcon, ShoppingBagIcon, User, Menu, X } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { AuthRequiredDialog } from "@/components/ui/auth-required-dialog";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?badge=BESTSELLER", label: "Best Seller" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [authDialog, setAuthDialog] = useState<{
    open: boolean;
    message: string;
    redirect: string;
  }>({ open: false, message: "", redirect: "" });

  function requireAuth(message: string, redirect: string) {
    if (user) return false;
    setAuthDialog({ open: true, message, redirect });
    return true;
  }
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      setVisible(currentY < lastY || currentY < 80);
      setLastY(currentY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={[
          "w-full z-50 transition-all duration-500 ease-in-out",
          scrolled
            ? "fixed top-0 left-0 right-0 bg-neutral/70 backdrop-blur-md border-b border-secondary/40 shadow-sm"
            : "relative bg-white",
          scrolled && !visible ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between w-full">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-primary hover:text-tertiary transition-colors p-1 -ml-1"
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-headline text-xl sm:text-2xl font-bold tracking-[0.15em] text-primary hover:text-tertiary transition-colors duration-300 select-none"
          >
            MyBag
          </Link>

          {/* Nav - hidden on mobile, visible on lg+ */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={label}
                  href={href}
                  className={[
                    "relative text-sm font-medium tracking-wide transition-colors duration-300 py-1 group",
                    isActive
                      ? "text-tertiary"
                      : "text-primary hover:text-tertiary",
                  ].join(" ")}
                >
                  {label}
                  <span
                    className={[
                      "absolute bottom-0 left-0 h-px bg-tertiary transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                if (!requireAuth("Please sign in to view your shopping bag.", "/cart")) {
                  window.location.href = "/cart";
                }
              }}
              aria-label="Cart"
              className="relative text-primary hover:text-tertiary transition-colors duration-300 hover:scale-110 active:scale-95 transform"
            >
              <ShoppingBagIcon size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => {
                if (!requireAuth("Please sign in to view your wishlist.", "/wishlist")) {
                  window.location.href = "/wishlist";
                }
              }}
              aria-label="Wishlist"
              className="relative text-primary hover:text-tertiary transition-colors duration-300 hover:scale-110 active:scale-95 transform"
            >
              <HeartIcon size={20} strokeWidth={1.5} />
            </button>
            {user ? (
              <Link
                href={profile?.role === "admin" ? "/admin/create-product" : "/profile"}
                aria-label="Profile"
                className="text-primary hover:text-tertiary transition-colors duration-300 hover:scale-110 active:scale-95 transform"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
            ) : (
              <button
                onClick={() => requireAuth("Please sign in to access your profile.", "/profile")}
                aria-label="Profile"
                className="text-primary hover:text-tertiary transition-colors duration-300 hover:scale-110 active:scale-95 transform"
              >
                <User size={20} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
              <span className="font-headline text-xl font-bold tracking-[0.15em] text-primary">
                MyBag
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-primary hover:text-tertiary transition-colors p-1 -mr-1"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={[
                      "flex items-center px-6 py-4 text-base font-medium border-b border-gray-50 transition-colors",
                      isActive
                        ? "text-tertiary bg-tertiary/5"
                        : "text-primary hover:text-tertiary hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (!requireAuth("Please sign in to view your shopping bag.", "/cart")) {
                      window.location.href = "/cart";
                    }
                  }}
                  className="text-primary hover:text-tertiary transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingBagIcon size={20} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (!requireAuth("Please sign in to view your wishlist.", "/wishlist")) {
                      window.location.href = "/wishlist";
                    }
                  }}
                  className="text-primary hover:text-tertiary transition-colors"
                  aria-label="Wishlist"
                >
                  <HeartIcon size={20} strokeWidth={1.5} />
                </button>
                {user ? (
                  <Link
                    href={profile?.role === "admin" ? "/admin/create-product" : "/profile"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-primary hover:text-tertiary transition-colors"
                    aria-label="Profile"
                  >
                    <User size={20} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      requireAuth("Please sign in to access your profile.", "/profile");
                    }}
                    className="text-primary hover:text-tertiary transition-colors"
                    aria-label="Profile"
                  >
                    <User size={20} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthRequiredDialog
        open={authDialog.open}
        onClose={() => setAuthDialog((prev) => ({ ...prev, open: false }))}
        message={authDialog.message}
        redirectPath={authDialog.redirect}
      />
    </>
  );
}
