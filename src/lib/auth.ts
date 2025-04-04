import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) return null;

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .leftJoin(users, eq(sessions.userId, users.id))
    .limit(1);

  if (!session[0] || session[0].sessions.expiresAt < new Date()) {
    return null;
  }

  return {
    ...session[0].sessions,
    user: session[0].users,
  };
}
