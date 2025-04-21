import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { createHash } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawToken = searchParams.get('token');

    if (!rawToken) {
      return NextResponse.json({ error: "Verification token is missing." }, { status: 400 });
    }

    // Hash the token received from the query parameter
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    // Find the user by the hashed token and check expiry
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.verificationToken, hashedToken),
          gt(users.verificationTokenExpires, new Date()) // Check if token is not expired
        )
      )
      .limit(1);

    if (!user) {
      // Token is invalid or expired
      // Consider checking separately for expired vs invalid if more specific feedback is needed
      return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });
    }

    // Check if user is already verified (idempotency)
    if (user.emailVerified) {
        return NextResponse.json({ message: "Email already verified." }, { status: 200 });
    }

    // Update the user record: verify email and clear token fields
    await db
      .update(users)
      .set({
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
        updatedAt: new Date(), // Update the timestamp
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ message: "Email verified successfully." }, { status: 200 });

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Internal server error during email verification." }, { status: 500 });
  }
} 