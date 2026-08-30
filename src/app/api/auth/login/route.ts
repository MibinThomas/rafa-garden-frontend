import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const inputEmail = (email || '').trim().toLowerCase();
    const inputPassword = (password || '').trim();

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rafagarden.com').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'Admin@1234').trim();

    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      const token = await signToken({ email: adminEmail });

      const response = NextResponse.json(
        { message: "Authenticated successfully" },
        { status: 200 }
      );

      // Set JWT in a cookie
      response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid email or password. Please check your credentials." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed. Server error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete("admin-token");
  return response;
}
