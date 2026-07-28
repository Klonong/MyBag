import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// Optimistic route protection: only reads the JWT session cookie (no DB hit),
// per Next.js guidance for Proxy/Middleware auth checks.
const ADMIN_PREFIX = "/admin";
const PROTECTED_PREFIXES = ["/profile", "/cart", "/wishlist", "/checkout"];

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!session?.user) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/cart", "/wishlist", "/checkout/:path*"],
};
