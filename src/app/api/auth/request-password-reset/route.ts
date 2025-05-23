import { NextResponse } from "next/server";
import { SupabaseAuthService } from "@/lib/services/supabase-auth-service";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const authService = new SupabaseAuthService();
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`;
    const { data, error } = await authService.requestPasswordReset(email, redirectTo);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({
      message: "If an account with this email exists, a password reset link has been sent.",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
