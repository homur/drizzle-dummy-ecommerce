import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SupabaseAuthService } from "@/lib/services/supabase-auth-service";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const authService = new SupabaseAuthService();
    const user = await authService.getUserByAccessToken(accessToken);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({
      id: user.id,
      name: user.user_metadata?.name,
      email: user.email,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
