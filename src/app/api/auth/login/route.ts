import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "Admin credentials are not configured in environment variables." },
      { status: 500 }
    );
  }

  if (email === adminEmail && password === adminPassword) {
    const response = NextResponse.json({ success: true, role: "admin" });
    response.cookies.set({
      name: "admin_token",
      value: "true",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return response;
  }

  return NextResponse.json(
    { error: "Email atau password salah." },
    { status: 401 }
  );
}
