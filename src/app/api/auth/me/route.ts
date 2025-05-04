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
      // Session not found, clear the cookie
      const response = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
      response.cookies.delete("sessionId");
      return response;
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
      // User not found, clear the session
      await db.delete(sessions).where(eq(sessions.id, sessionId));
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
      response.cookies.delete("sessionId");
      return response;
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
