import { NextResponse } from "next/server";
import { SupabaseAuthService } from "@/lib/services/supabase-auth-service";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const authService = new SupabaseAuthService();
    const { session, user } = await authService.signIn(email, password);
    if (!session) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    // Set access token in cookie for SSR/session
    const response = NextResponse.json({ user, token: session.access_token });
    response.cookies.set({
      name: "sb-access-token",
      value: session.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
