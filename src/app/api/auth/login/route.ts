import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const inputEmail = (email || '').trim().toLowerCase();
    const inputPassword = (password || '').trim();

    await dbConnect();

    // 1. First check MongoDB User collection for database admin credentials
    const dbUser = await User.findOne({ email: inputEmail, active: true });
    
    if (dbUser && dbUser.password === inputPassword) {
      const token = await signToken({ email: dbUser.email, role: dbUser.role, name: dbUser.name });

      const response = NextResponse.json(
        { message: "Authenticated successfully via database", user: { email: dbUser.email, name: dbUser.name, role: dbUser.role } },
        { status: 200 }
      );

      response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return response;
    }

    // 2. Fallback check for environment credentials (.env.local or defaults)
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rafagarden.com').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'Admin@1234').trim();

    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      const token = await signToken({ email: adminEmail, role: 'super-admin', name: 'Super Admin' });

      const response = NextResponse.json(
        { message: "Authenticated successfully via environment config" },
        { status: 200 }
      );

      response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete("admin-token");
  return response;
}
