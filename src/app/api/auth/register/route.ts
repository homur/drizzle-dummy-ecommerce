import { NextResponse } from "next/server";
import { SupabaseAuthService } from "@/lib/services/supabase-auth-service";

function isPasswordSecure(password: string): boolean {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return (
    password.length >= minLength && hasUppercase && hasLowercase && hasNumber
  );
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!isPasswordSecure(password)) {
      return NextResponse.json(
        {
          error:
            "Password does not meet security requirements. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.",
        },
        { status: 400 }
      );
    }
    const authService = new SupabaseAuthService();
    const { data, error } = await authService.signUp(email, password, name);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({
      message: "Registration successful. Please check your email to verify your account.",
      user: data.user,
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
