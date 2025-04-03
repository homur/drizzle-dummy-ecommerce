import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { lt } from "drizzle-orm";

export async function cleanupExpiredSessions() {
  try {
    const now = new Date();
    const deletedSessions = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, now))
      .returning();

    console.log(`Cleaned up ${deletedSessions.length} expired sessions`);
    return deletedSessions.length;
  } catch (error) {
    console.error("Session cleanup error:", error);
    throw error;
  }
}
