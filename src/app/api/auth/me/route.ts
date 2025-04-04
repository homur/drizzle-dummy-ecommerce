import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the session and user data
    const [session] = await db
      .select({
        id: sessions.id,
        userId: sessions.userId,
      })
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, session.userId));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
