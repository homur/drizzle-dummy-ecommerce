import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, sessions } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      console.log("No session ID found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get valid session
    const session = await db
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date()))
      )
      .limit(1);

    if (!session || session.length === 0) {
      console.log("Invalid or expired session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update last accessed time
    await db
      .update(sessions)
      .set({ lastAccessedAt: new Date() })
      .where(eq(sessions.id, sessionId));

    // Fetch user from database
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, session[0].userId))
      .limit(1);

    if (!user || user.length === 0) {
      console.log("User not found for session");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user[0]);
    return NextResponse.json(user[0]);
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get valid session
    const session = await db
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date()))
      )
      .limit(1);

    if (!session || session.length === 0) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedUser = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, session[0].userId))
      .returning();

    if (!updatedUser || updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = updatedUser[0];
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
