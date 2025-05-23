import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SupabaseAuthService } from "@/lib/services/supabase-auth-service";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;
    if (accessToken) {
      const authService = new SupabaseAuthService();
      // Optionally, you can call signOut, but Supabase signOut is mostly for client-side
      // await authService.signOut();
    }
    // Create response
    const response = NextResponse.json({ success: true });
    // Delete the access token cookie
    response.cookies.delete("sb-access-token");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
