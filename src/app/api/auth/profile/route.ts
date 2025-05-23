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

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const authService = new SupabaseAuthService();
    // Update user metadata (name)
    const client = authService.createClientWithToken(accessToken);
    const { data, error } = await client.auth.updateUser({ data: { name } });
    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || "Failed to update user" }, { status: 400 });
    }
    return NextResponse.json({
      id: data.user.id,
      name: data.user.user_metadata?.name,
      email: data.user.email,
      user_metadata: data.user.user_metadata,
      app_metadata: data.user.app_metadata,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
