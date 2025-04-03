import { NextResponse } from "next/server";
import { cleanupExpiredSessions } from "@/lib/session-cleanup";

export async function POST() {
  try {
    const cleanedCount = await cleanupExpiredSessions();
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${cleanedCount} expired sessions`,
    });
  } catch (error) {
    console.error("Session cleanup API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
