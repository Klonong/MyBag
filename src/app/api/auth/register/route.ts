import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hashPassword } from "@/server/auth/password";

// Creates the user account. The client is expected to call next-auth's
// signIn("credentials", ...) right after a successful response to establish
// the session, since Auth.js's Credentials provider only handles sign-in.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email: rawEmail, password, name, phone } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof rawEmail !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const email = rawEmail.trim().toLowerCase();

  if (!email || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const password_hash = await hashPassword(password);

    await prisma.users.create({
      data: {
        email,
        password_hash,
        name: typeof name === "string" && name.trim() ? name.trim() : null,
        phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to create account." },
      { status: 500 }
    );
  }
}
